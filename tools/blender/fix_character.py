"""Repairs on the prepared v2 candidate, before refine_phase2.py.
blender -b prepared.blend -P fix_character.py -- --out fixed.blend

1. Hoodie collar. Between the top edge of the hoodie and the hood there is an
   open slot (a notch in the neckline) through which the bare neck shows. A
   ribbed inner collar is built around the neck, just outside the body and
   inside the hoodie, so the garment reads as one piece. It takes its weights
   from the body, so it follows the neck in every pose.
2. Wave. The action raised the upper arm with a Z rotation only. The elbow
   hinge then pointed forwards, so the forearm folded towards the camera with
   the hand hanging down. The upper arm now also rolls 90 degrees, which turns
   the hinge so the forearm rises beside the head, and the wave is a side-to-side
   swing of the forearm.
3. Fabric sheen. Blender multiplies the sheen tint by its weight (0.15), but
   glTF only carries the tint, so the browser applied it at full strength and
   the navy hoodie washed out to grey. The weight is folded into the tint.
"""
import argparse
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector

COLLAR = "GEO_hoodie_collar"
SEGMENTS = 48
HEIGHTS = (1.58, 1.66, 1.74, 1.81, 1.87, 1.92)
CLEARANCE = 0.02      # outside the neck
INSIDE_HOODIE = 0.008  # stay under the outer fabric where the hoodie covers it


def cast_radius(obj, depsgraph, height, angle):
    """Distance from the neck axis to the first surface of obj, looking outwards-in."""
    direction = Vector((math.cos(angle), math.sin(angle), 0))
    evaluated = obj.evaluated_get(depsgraph)
    inverse = evaluated.matrix_world.inverted()
    origin = Vector((0, 0, height)) + direction * 2
    hit, location, _normal, _face = evaluated.ray_cast(inverse @ origin, inverse.to_3x3() @ -direction)
    if not hit:
        return None
    world = evaluated.matrix_world @ location
    return Vector((world.x, world.y, 0)).length


def build_collar(rig):
    old = bpy.data.objects.get(COLLAR)
    if old:
        bpy.data.objects.remove(old, do_unlink=True)
    body = bpy.data.objects["GEO_Nyx_body"]
    hoodie = bpy.data.objects["GEO_hoodie"]
    depsgraph = bpy.context.evaluated_depsgraph_get()
    verts = []
    for height in HEIGHTS:
        for segment in range(SEGMENTS):
            angle = 2 * math.pi * segment / SEGMENTS
            neck = cast_radius(body, depsgraph, height, angle)
            if neck is None:
                raise RuntimeError("Neck not found at height %.2f" % height)
            radius = neck + CLEARANCE
            fabric = cast_radius(hoodie, depsgraph, height, angle)
            if fabric is not None:
                radius = min(radius, fabric - INSIDE_HOODIE)
            radius = max(radius, neck + 0.004)
            verts.append((radius * math.cos(angle), radius * math.sin(angle), height))
    faces = []
    for ring in range(len(HEIGHTS) - 1):
        for segment in range(SEGMENTS):
            following = (segment + 1) % SEGMENTS
            faces.append((ring * SEGMENTS + segment, ring * SEGMENTS + following,
                          (ring + 1) * SEGMENTS + following, (ring + 1) * SEGMENTS + segment))
    mesh = bpy.data.meshes.new(COLLAR)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    mesh.materials.append(bpy.data.materials["M_hoodie_dark"])
    collar = bpy.data.objects.new(COLLAR, mesh)
    bpy.data.collections["GEO"].objects.link(collar)
    collar.parent = rig
    modifier = collar.modifiers.new("Armature", "ARMATURE")
    modifier.object = rig

    # Weights: copy from the nearest body face so the collar follows the neck.
    groups = {group.index: group.name for group in body.vertex_groups}
    deform = {bone.name for bone in rig.data.bones if bone.use_deform}
    to_body = body.matrix_world.inverted() @ collar.matrix_world
    for vertex in mesh.vertices:
        found, _location, _normal, face = body.closest_point_on_mesh(to_body @ vertex.co)
        if not found:
            raise RuntimeError("No body surface near the collar")
        weights = {}
        polygon = body.data.polygons[face]
        for index in polygon.vertices:
            for element in body.data.vertices[index].groups:
                name = groups[element.group]
                if name in deform:
                    weights[name] = weights.get(name, 0) + element.weight
        total = sum(weights.values())
        for name, weight in weights.items():
            group = collar.vertex_groups.get(name) or collar.vertex_groups.new(name=name)
            group.add([vertex.index], weight / total, "REPLACE")
    collar["nyx_note"] = "Ribbed inner collar closing the slot between hoodie and hood."
    return {"vertices": len(mesh.vertices), "faces": len(mesh.polygons)}


def set_keys(action, bone, index, values):
    """Overwrite a rotation channel with (frame, value) pairs."""
    path = f'pose.bones["{bone}"].rotation_euler'
    slot = action.slots[0]
    bag = action.layers[0].strips[0].channelbag(slot)
    curve = bag.fcurves.find(path, index=index) or bag.fcurves.new(path, index=index)
    while curve.keyframe_points:
        curve.keyframe_points.remove(curve.keyframe_points[0])
    for frame, value in values:
        point = curve.keyframe_points.insert(frame, value)
        point.interpolation = "BEZIER"
        point.handle_left_type = point.handle_right_type = "AUTO_CLAMPED"
    curve.update()


def fix_wave():
    action = bpy.data.actions["Wave"]
    frames = (1, 9, 22, 31, 40, 49, 58, 73, 91)
    up = slice(2, 8)

    def track(rest, anticipation, raised):
        values = [rest, anticipation] + list(raised) + [rest]
        return list(zip(frames, values))

    # Upper arm: out to the side (Z) and rolled (Y) so the elbow folds upwards.
    set_keys(action, "CTRL_FK_upper_arm.R", 0, track(0.0, 0.09, [0.0] * 6))
    set_keys(action, "CTRL_FK_upper_arm.R", 1, track(0.0, 0.0, [1.5708] * 6))
    set_keys(action, "CTRL_FK_upper_arm.R", 2, track(-0.07, 0.03, [-1.5, -1.5, -1.56, -1.5, -1.56, -1.5]))
    # Forearm: the wave itself, swinging the hand away from and towards the head.
    set_keys(action, "CTRL_FK_forearm.R", 0, track(0.14, 0.14, [1.05, 0.78, 1.32, 0.78, 1.32, 1.05]))
    set_keys(action, "CTRL_FK_forearm.R", 2, track(0.0, 0.0, [0.0] * 6))
    return {"frames": list(frames), "raised_frames": list(frames[up])}


def fold_sheen_weight():
    changed = {}
    for material in bpy.data.materials:
        if not material.use_nodes:
            continue
        for node in material.node_tree.nodes:
            if node.type != "BSDF_PRINCIPLED":
                continue
            weight = node.inputs["Sheen Weight"]
            tint = node.inputs["Sheen Tint"]
            if weight.is_linked or tint.is_linked or not 0 < weight.default_value < 1:
                continue
            amount = weight.default_value
            tint.default_value = [c * amount for c in tint.default_value[:3]] + [1]
            weight.default_value = 1.0
            changed[material.name] = round(amount, 3)
    return changed


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    a = p.parse_args(sys.argv[sys.argv.index("--") + 1:])
    output = Path(a.out).resolve()
    if output.exists() or output == Path(bpy.data.filepath).resolve():
        raise RuntimeError("Choose a fresh output path.")
    rig = bpy.data.objects["RIG_Nyx"]
    stored = rig.animation_data.action if rig.animation_data else None
    if rig.animation_data:
        rig.animation_data.action = None
    for bone in rig.pose.bones:
        bone.matrix_basis.identity()
    bpy.context.view_layer.update()
    report = {"collar": build_collar(rig), "wave": fix_wave(), "sheen": fold_sheen_weight()}
    if stored:
        rig.animation_data.action = stored
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(output))
    print("RESULT", report)


if __name__ == "__main__":
    main()
