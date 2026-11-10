"""Render transparent posters of NYX for the landing (fallback of the live 3D hero).
blender -b candidate.blend -P render_poster.py -- --out folder
Writes idle.png (rest pose) and wave.png (mid Wave), both with alpha.
"""
import argparse
import sys
from pathlib import Path
import bpy
from mathutils import Vector

p = argparse.ArgumentParser()
p.add_argument("--out", required=True)
a = p.parse_args(sys.argv[sys.argv.index("--") + 1:])
out = Path(a.out)
out.mkdir(parents=True, exist_ok=True)

rig = bpy.data.objects["RIG_Nyx"]
character = set()
for name in ("GEO", "FACIAL", "ACCESSORIES"):
    character.update(o for o in bpy.data.collections[name].all_objects if o.type == "MESH")
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
scene.cycles.samples = 96
scene.render.film_transparent = True
scene.render.resolution_x = 1100
scene.render.resolution_y = 1400
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "Standard"
if scene.world is None:
    scene.world = bpy.data.worlds.new("Poster")
scene.world.use_nodes = False
scene.world.color = (0.02, 0.02, 0.05)

camera_data = bpy.data.cameras.new("Poster")
camera_data.lens = 70
camera = bpy.data.objects.new("Poster", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera.location = (-2.6, -9.2, 2.2)
aim(camera, (0.05, 0, 1.62))

# Neutral key from the front, violet and cyan rims from behind: the landing palette.
for name, location, power, size, color in (
    ("Key", (-2.5, -5, 4.5), 900, 4, (1, 0.97, 0.94)),
    ("Fill", (4, -4, 1.5), 260, 5, (0.75, 0.8, 1)),
    ("RimViolet", (3.5, 4, 3.5), 2600, 2.5, (0.49, 0.23, 0.93)),
    ("RimCyan", (-4, 3.5, 2.5), 1800, 2.5, (0.02, 0.71, 0.83)),
):
    light = bpy.data.lights.new(name, "AREA")
    light.energy = power
    light.size = size
    light.color = color
    obj = bpy.data.objects.new(name, light)
    scene.collection.objects.link(obj)
    obj.location = location
    aim(obj, (0, 0, 1.7))

animation = rig.animation_data_create()
for name, action_name, frame in (("idle", "Idle_Secondary", 1), ("wave", "Wave", 44)):
    action = bpy.data.actions[action_name]
    animation.action = action
    if action.slots:
        animation.action_slot = action.slots[0]
    scene.frame_set(frame)
    scene.render.filepath = str(out / (name + ".png"))
    bpy.ops.render.render(write_still=True)
print("RESULT posters written to", out)
