"""Export selected NYX collections, optional Draco, bounded PNG textures.
Blender -b candidate.blend -P export_web.py -- --out nyx.glb [--draco] [--action Idle_Secondary]
Run in a fresh process. Does not save texture resizing back to the blend.
"""
import argparse
import json
import struct
import sys
import tempfile
from pathlib import Path
import bpy

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--draco", action="store_true")
    p.add_argument("--texture-size", type=int, default=1024)
    p.add_argument("--action")
    a = p.parse_args(sys.argv[sys.argv.index("--")+1:])
    output = Path(a.out).resolve()
    if output.exists():
        raise RuntimeError("Choose a new output file.")
    if a.texture_size < 64:
        raise RuntimeError("Texture size must be at least 64.")
    rig = bpy.data.objects["RIG_Nyx"]
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="DESELECT")
    objects = {rig}
    for name in ("GEO", "FACIAL", "ACCESSORIES"):
        collection = bpy.data.collections.get(name)
        if collection:
            objects.update(o for o in collection.all_objects if o.type == "MESH")
    for obj in objects:
        obj.hide_set(False)
        obj.select_set(True)
    bpy.context.view_layer.objects.active = rig
    ad = rig.animation_data_create()
    ad.action = None
    for track in list(ad.nla_tracks):
        ad.nla_tracks.remove(track)
    for bone in rig.pose.bones:
        bone.matrix_basis.identity()
    if a.action:
        action = bpy.data.actions.get(a.action)
        if action is None:
            raise RuntimeError("Action missing: " + a.action)
        track = ad.nla_tracks.new()
        track.name = a.action
        strip = track.strips.new(a.action, int(action.frame_range[0]), action)
        if action.slots:
            strip.action_slot = action.slots[0]
    texture_temp = tempfile.TemporaryDirectory(prefix="nyx-textures-")
    for image in list(bpy.data.images):
        if image.type not in {"IMAGE", "UV_TEST"}:
            continue
        w,h = image.size
        if not w or not h:
            continue
        scale = min(1, a.texture_size/max(w,h))
        if scale < 1:
            image.scale(max(1,round(w*scale)), max(1,round(h*scale)))
        # Reload the resized PNG so glTF cannot reuse stale packed source bytes.
        path = Path(texture_temp.name) / (image.name.replace("/", "_") + ".png")
        # A fresh datablock prevents Blender from saving original packed bytes.
        replacement = bpy.data.images.new("NYX_export_" + image.name,
                                          width=image.size[0], height=image.size[1], alpha=True)
        replacement.colorspace_settings.name = image.colorspace_settings.name
        replacement.pixels.foreach_set(image.pixels[:])
        replacement.filepath_raw = str(path)
        replacement.file_format = "PNG"
        replacement.save()
        for material in bpy.data.materials:
            if material.use_nodes:
                for node in material.node_tree.nodes:
                    if node.type == "TEX_IMAGE" and node.image == image:
                        node.image = replacement
    options = dict(filepath=str(output), export_format="GLB", use_selection=True,
        export_animations=bool(a.action), export_animation_mode="NLA_TRACKS",
        export_force_sampling=True, export_frame_range=False,
        export_def_bones=True, export_skins=True, export_morph=True,
        export_apply=False, export_all_influences=False, export_influence_nb=4,
        export_image_format="AUTO", export_yup=True, export_materials="EXPORT",
        export_draco_mesh_compression_enable=a.draco,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=14, export_draco_normal_quantization=10)
    props = bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
    missing = set(options)-set(props)
    if missing:
        raise RuntimeError("Unsupported exporter options: " + str(missing))
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(**options)
    data = output.read_bytes()
    length = struct.unpack_from("<I", data,12)[0]
    gltf = json.loads(data[20:20+length])
    primitives = [p for m in gltf.get("meshes",[]) for p in m["primitives"]]
    compressed = sum("KHR_draco_mesh_compression" in p.get("extensions",{}) for p in primitives)
    if a.draco and not compressed:
        raise RuntimeError("Draco requested but no compressed primitive found.")
    report = {"bytes":len(data), "meshes":len(gltf.get("meshes",[])),
              "joints":sum(len(s["joints"]) for s in gltf.get("skins",[])),
              "animations":[x.get("name") for x in gltf.get("animations",[])],
              "morph_primitives":sum(bool(p.get("targets")) for p in primitives),
              "draco_primitives":compressed, "textures_max":a.texture_size}
    output.with_suffix(".report.json").write_text(json.dumps(report,indent=2))
    print(report)
    texture_temp.cleanup()

if __name__ == "__main__":
    main()
