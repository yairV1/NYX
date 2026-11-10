"""Textured diagnostic renders with fixed cameras, for before/after review.
blender -b candidate.blend -P render_diagnostic.py -- --out folder
    [--shot name:action:frame:view ...] [--samples 32] [--size 720]
Views: neck-front, neck-3q, neck-side, neck-back, body-front, body-3q-l,
body-3q-r, body-side-l, body-back, face. Same framing for every candidate.
"""
import argparse
import sys
from pathlib import Path
import bpy
from mathutils import Vector

VIEWS = {
    "neck-front": ((0.0, -6.0, 1.95), (0.0, 0.0, 1.78), 1.25),
    "neck-3q": ((-3.6, -4.8, 2.1), (0.0, 0.0, 1.78), 1.25),
    "neck-side": ((-6.0, 0.0, 1.95), (0.0, 0.0, 1.78), 1.25),
    "neck-back": ((0.0, 6.0, 2.1), (0.0, 0.0, 1.78), 1.25),
    "body-front": ((0.0, -8.0, 1.7), (0.0, 0.0, 1.65), 3.5),
    "body-3q-l": ((-4.6, -6.5, 2.0), (0.0, 0.0, 1.65), 3.5),
    "body-3q-r": ((4.6, -6.5, 2.0), (0.0, 0.0, 1.65), 3.5),
    "body-side-l": ((-8.0, 0.0, 1.7), (0.0, 0.0, 1.65), 3.5),
    "body-back": ((0.0, 8.0, 1.9), (0.0, 0.0, 1.65), 3.5),
    "face": ((0.6, -6.0, 2.45), (0.0, 0.0, 2.3), 1.5),
}

p = argparse.ArgumentParser()
p.add_argument("--out", required=True)
p.add_argument("--shot", action="append", default=[])
p.add_argument("--samples", type=int, default=32)
p.add_argument("--size", type=int, default=720)
a = p.parse_args(sys.argv[sys.argv.index("--") + 1:])
out = Path(a.out)
out.mkdir(parents=True, exist_ok=True)

rig = bpy.data.objects.get("RIG_Nyx") or next(o for o in bpy.data.objects if o.type == "ARMATURE")
names = ("GEO", "FACIAL", "ACCESSORIES")
if all(n in bpy.data.collections for n in names):
    character = {o for n in names for o in bpy.data.collections[n].all_objects if o.type == "MESH"}
else:  # an imported GLB: every skinned mesh belongs to the character
    character = {o for o in bpy.data.objects if o.type == "MESH" and o.find_armature()}
for obj in bpy.data.objects:
    if obj.type == "MESH":
        obj.hide_render = obj not in character
for obj in list(bpy.data.objects):
    if obj.type in ("LIGHT", "CAMERA"):
        bpy.data.objects.remove(obj, do_unlink=True)


def aim(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = a.samples
scene.render.film_transparent = False
scene.render.resolution_x = scene.render.resolution_y = a.size
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = "Standard"
if scene.world is None:
    scene.world = bpy.data.worlds.new("Diagnostic")
scene.world.use_nodes = False
scene.world.color = (0.22, 0.23, 0.27)
camera_data = bpy.data.cameras.new("Diagnostic")
camera_data.type = "ORTHO"
camera = bpy.data.objects.new("Diagnostic", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
for name, location, power in (("Key", (-3, -6, 5), 900), ("Fill", (5, -4, 2), 450), ("Back", (0, 6, 4), 500)):
    light = bpy.data.lights.new(name, "AREA")
    light.energy = power
    light.size = 5
    obj = bpy.data.objects.new(name, light)
    scene.collection.objects.link(obj)
    obj.location = location
    aim(obj, (0, 0, 1.7))

animation = rig.animation_data_create()
for shot in a.shot:
    name, action_name, frame, view = shot.split(":")
    if action_name == "rest":
        animation.action = None
        for bone in rig.pose.bones:
            bone.matrix_basis.identity()
    else:
        action = bpy.data.actions[action_name]
        animation.action = action
        if action.slots:
            animation.action_slot = next((s for s in action.slots if s.target_id_type == "OBJECT"), action.slots[0])
    scene.frame_set(int(frame))
    location, target, scale = VIEWS[view]
    camera.location = location
    camera_data.ortho_scale = scale
    aim(camera, target)
    scene.render.filepath = str(out / (name + ".png"))
    bpy.ops.render.render(write_still=True)
print("RESULT wrote", len(a.shot), "shots to", out)
