"""Render full-body wireframe views with a fixed framing, for before/after LOD review.
blender -b candidate.blend -P render_geometry_review.py -- --out folder
Writes front.png and three-quarter.png and prints the evaluated triangle count.
The framing is constant so that two candidates can be compared side by side.
"""
import argparse
import json
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
rig.animation_data_clear()
for pb in rig.pose.bones:
    pb.matrix_basis.identity()

character = set()
for name in ("GEO", "FACIAL", "ACCESSORIES"):
    character.update(o for o in bpy.data.collections[name].all_objects if o.type == "MESH")
for obj in bpy.data.objects:
    if obj.type == "MESH":
        obj.hide_render = obj not in character
for obj in list(bpy.data.objects):
    if obj.type in ("LIGHT", "CAMERA"):
        bpy.data.objects.remove(obj, do_unlink=True)

# Wireframe override: every triangle edge is drawn, whatever the source material.
material = bpy.data.materials.new("NYX_wire_review")
material.use_nodes = True
nodes, links = material.node_tree.nodes, material.node_tree.links
nodes.clear()
wire = nodes.new("ShaderNodeWireframe")
wire.use_pixel_size = True
wire.inputs["Size"].default_value = 0.55
surface = nodes.new("ShaderNodeBsdfDiffuse")
surface.inputs["Color"].default_value = (0.62, 0.66, 0.78, 1)
line = nodes.new("ShaderNodeEmission")
line.inputs["Color"].default_value = (0.01, 0.01, 0.02, 1)
mix = nodes.new("ShaderNodeMixShader")
output = nodes.new("ShaderNodeOutputMaterial")
links.new(wire.outputs["Fac"], mix.inputs["Fac"])
links.new(surface.outputs["BSDF"], mix.inputs[1])
links.new(line.outputs["Emission"], mix.inputs[2])
links.new(mix.outputs["Shader"], output.inputs["Surface"])
bpy.context.view_layer.material_override = material


def aim(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


scene = bpy.context.scene
camera_data = bpy.data.cameras.new("Review")
camera_data.type = "ORTHO"
camera_data.ortho_scale = 3.7
camera = bpy.data.objects.new("Review", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
scene.render.engine = "CYCLES"
scene.cycles.samples = 16
scene.render.resolution_x = 900
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
if scene.world is None:
    scene.world = bpy.data.worlds.new("Review")
scene.world.use_nodes = False
scene.world.color = (0.35, 0.35, 0.38)
for name, location, power in (("Key", (-3, -5, 5), 500), ("Fill", (4, -4, 2), 250)):
    light = bpy.data.lights.new(name, "AREA")
    light.energy = power
    light.size = 4
    obj = bpy.data.objects.new(name, light)
    scene.collection.objects.link(obj)
    obj.location = location
    aim(obj, (0, 0, 1.6))

target = (0.06, 0.09, 1.6)
for name, location in (("front", (0.06, -9, 1.6)), ("three-quarter", (-5.5, -7, 2.4))):
    camera.location = location
    aim(camera, target)
    scene.render.filepath = str(out / (name + ".png"))
    bpy.ops.render.render(write_still=True)

depsgraph = bpy.context.evaluated_depsgraph_get()
triangles = 0
for obj in character:
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    mesh.calc_loop_triangles()
    triangles += len(mesh.loop_triangles)
    evaluated.to_mesh_clear()
report = {"input": bpy.data.filepath, "character_meshes": len(character), "evaluated_triangles": triangles}
(out / "geometry.json").write_text(json.dumps(report, indent=2))
print("RESULT", report)
