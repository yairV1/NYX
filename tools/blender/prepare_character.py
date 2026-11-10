"""Evolve RIG_Nyx in a NEW blend. Blender -b source.blend -P prepare_character.py -- --out candidate.blend"""
import argparse
import json
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector

def args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    return parser.parse_args(sys.argv[sys.argv.index("--") + 1:])

def linear(hex_color):
    rgb = [int(hex_color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    return tuple(v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in rgb) + (1,)

def palette():
    colors = {"Violet":"#7C3AED", "Indigo":"#6366F1", "Cyan":"#06B6D4",
              "Success":"#10B981", "Text":"#E5E7EB", "Night":"#0F172A"}
    for name, color in colors.items():
        mat = bpy.data.materials.get("NYX_" + name) or bpy.data.materials.new("NYX_" + name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = linear(color)
        bsdf.inputs["Roughness"].default_value = .55
        mat.diffuse_color = linear(color)
    # Preserve all image/vertex-color links in existing character materials.
    for name, roughness in {"M_hoodie":.85, "M_bag":.65, "M_eye":.12}.items():
        mat = bpy.data.materials.get(name)
        if mat and mat.use_nodes:
            for node in mat.node_tree.nodes:
                if node.type == "BSDF_PRINCIPLED":
                    node.inputs["Roughness"].default_value = roughness

def coordinates(obj):
    evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    mesh = evaluated.to_mesh()
    result = [v.co.copy() for v in mesh.vertices]
    evaluated.to_mesh_clear()
    return result

def facial_keys(rig):
    """Bake existing facial controls into local morph deltas at neutral pose.
    These are starting shapes, not a retopology or a sculpted lip-sync library.
    Do not apply the corresponding bone pose and morph together.
    """
    definitions = {}
    for side in ("L", "R"):
        definitions["Blink." + side] = (
            ["GEO_lid_up." + side, "GEO_lid_low." + side],
            {"CTRL_lid_up." + side: ("rotation_euler", (-math.radians(61),0,0)),
             "CTRL_lid_low." + side: ("rotation_euler", (math.radians(40),0,0))})
        definitions["Smile." + side] = (
            ["GEO_mouth." + side],
            {"CTRL_mouth." + side: ("location", (-.012 if side == "L" else .012,0,.022))})
    definitions["MouthOpen"] = (
        ["GEO_mouth_inside"],
        {"CTRL_mouth_open": ("scale", (1,1,8))})
    report = {}
    for name, (objects, controls) in definitions.items():
        for bone in controls:
            if bone not in rig.pose.bones:
                raise RuntimeError("Missing control: " + bone)
        targets = [bpy.data.objects[n] for n in objects]
        for obj in targets:
            if any(m.type != "ARMATURE" for m in obj.modifiers):
                raise RuntimeError("Unexpected modifier on " + obj.name)
            if obj.data.shape_keys:
                raise RuntimeError("Existing shapes on " + obj.name + "; use the original source.")
        baseline = {o.name: coordinates(o) for o in targets}
        for bone, (prop, value) in controls.items():
            pb = rig.pose.bones[bone]
            pb.rotation_mode = "XYZ"
            setattr(pb, prop, value)
        bpy.context.view_layer.update()
        posed = {o.name: coordinates(o) for o in targets}
        for bone in controls:
            rig.pose.bones[bone].matrix_basis.identity()
        bpy.context.view_layer.update()
        for obj in targets:
            if len(baseline[obj.name]) != len(obj.data.vertices):
                raise RuntimeError("Vertex count changed on " + obj.name)
            basis = obj.shape_key_add(name="Basis")
            key = obj.shape_key_add(name=name)
            maximum = 0
            for index, point in enumerate(key.data):
                delta = posed[obj.name][index] - baseline[obj.name][index]
                point.co = basis.data[index].co + delta
                maximum = max(maximum, delta.length)
            if maximum < 1e-7:
                raise RuntimeError("Empty morph: " + obj.name)
            obj["nyx_morph_note"] = "Neutral-pose delta from existing controls; avoid double-driving."
            report[obj.name + "/" + name] = maximum
    return report

def secondary_bones(rig):
    """Reuse tail/ear bones. Add LOCAL additive spring helpers and weighted strings."""
    targets = [f"DEF_tail_{i:02}" for i in range(1,9)]
    targets += ["DEF_ear_02.L", "DEF_ear_02.R"]
    strings = [("GEO_string", "GEO_aglet", "L"), ("GEO_string.001", "GEO_aglet.001", "R")]
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode="EDIT")
    for mesh_name, _, side in strings:
        obj = bpy.data.objects[mesh_name]
        points = [rig.matrix_world.inverted() @ obj.matrix_world @ v.co for v in obj.data.vertices]
        top, bottom = max(points, key=lambda p:p.z), min(points, key=lambda p:p.z)
        for index in range(3):
            name = f"DEF_cord_{index+1:02}.{side}"
            bone = rig.data.edit_bones.new(name)
            bone.head = top.lerp(bottom, index/3)
            bone.tail = top.lerp(bottom, (index+1)/3)
            bone.parent = rig.data.edit_bones["DEF_chest" if index == 0 else f"DEF_cord_{index:02}.{side}"]
            bone.use_deform = True
            bone.use_connect = index > 0
            targets.append(name)
    for target in targets:
        original = rig.data.edit_bones[target]
        helper = rig.data.edit_bones.new("MCH_spring_" + target)
        helper.head, helper.tail = original.head, original.tail
        helper.roll = original.roll
        helper.use_deform = False
        helper.parent = rig.data.edit_bones["CTRL_root"]
    bpy.ops.object.mode_set(mode="OBJECT")
    for target in targets:
        constraint = rig.pose.bones[target].constraints.new("COPY_ROTATION")
        constraint.name = "NYX spring offset"
        constraint.target = rig
        constraint.subtarget = "MCH_spring_" + target
        constraint.owner_space = constraint.target_space = "LOCAL"
        constraint.mix_mode = "AFTER"
    for mesh_name, aglet_name, side in strings:
        obj = bpy.data.objects[mesh_name]
        coords = [rig.matrix_world.inverted() @ obj.matrix_world @ v.co for v in obj.data.vertices]
        low, high = min(p.z for p in coords), max(p.z for p in coords)
        for group in list(obj.vertex_groups):
            obj.vertex_groups.remove(group)
        groups = [obj.vertex_groups.new(name=f"DEF_cord_{i+1:02}.{side}") for i in range(3)]
        for vertex, co in zip(obj.data.vertices, coords):
            t = min(2.0, max(0.0, (high-co.z)/(high-low)*2))
            i = min(1, int(t))
            groups[i].add([vertex.index], 1-(t-i), "REPLACE")
            groups[i+1].add([vertex.index], t-i, "REPLACE")
        aglet = bpy.data.objects[aglet_name]
        for group in list(aglet.vertex_groups):
            aglet.vertex_groups.remove(group)
        group = aglet.vertex_groups.new(name=f"DEF_cord_03.{side}")
        group.add(list(range(len(aglet.data.vertices))), 1, "REPLACE")
    return targets

def main():
    output = Path(args().out).resolve()
    if output == Path(bpy.data.filepath).resolve() or output.exists():
        raise RuntimeError("Choose a NEW output path.")
    rig = bpy.data.objects.get("RIG_Nyx")
    if not rig or rig.type != "ARMATURE":
        raise RuntimeError("Expected RIG_Nyx from Nyx_rig v2.")
    if any(b.name.startswith("MCH_spring_") for b in rig.data.bones):
        raise RuntimeError("Already prepared. Use the original source.")
    rig.animation_data_clear()
    for pb in rig.pose.bones:
        pb.matrix_basis.identity()
    bpy.context.view_layer.update()
    report = {"morphs": facial_keys(rig), "secondary_targets": secondary_bones(rig)}
    palette()
    output.parent.mkdir(parents=True, exist_ok=True)
    rig["nyx_phase2"] = json.dumps(report)
    bpy.ops.wm.save_as_mainfile(filepath=str(output))
    output.with_suffix(".json").write_text(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
