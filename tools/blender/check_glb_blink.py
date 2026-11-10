"""Check the exported blink the way a browser plays it.
blender -b --python check_glb_blink.py -- model.glb [report.json]

A browser adds glTF morph targets as: base + sum(weight_k * delta_k), with every
delta relative to the base mesh. This script reads the animated weights straight
from the GLB and the base and target shapes from an import of the same file,
rebuilds every animated frame with that formula and measures how far each eyelid
vertex is from its eye centre. The lids are built on a sphere, so a frame that
leaves it means the weights add up wrongly (lids through the face).
"""
import json
import struct
import sys
import bpy
import numpy as np

args = sys.argv[sys.argv.index("--") + 1:]
data = open(args[0], "rb").read()
length = struct.unpack_from("<I", data, 12)[0]
gltf = json.loads(data[20:20 + length])
binary = 20 + length + 8


def floats(index, width):
    accessor = gltf["accessors"][index]
    view = gltf["bufferViews"][accessor["bufferView"]]
    offset = binary + view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    return np.frombuffer(data, dtype="<f4", count=accessor["count"] * width, offset=offset).reshape(accessor["count"], width)


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=args[0])
rig = next(o for o in bpy.data.objects if o.type == "ARMATURE")
report = {"file": args[0], "clips": {}, "worst_radius_error": 0.0, "max_weight_sum": 0.0}

for node_index, node in enumerate(gltf["nodes"]):
    name = node.get("name", "")
    if not name.startswith("GEO_lid") or "mesh" not in node:
        continue
    mesh_name = gltf["meshes"][node["mesh"]]["name"]
    lid = next(o for o in bpy.data.objects if o.type == "MESH" and o.data.shape_keys
               and o.name.split(".0")[0] == name)
    blocks = lid.data.shape_keys.key_blocks
    count = len(lid.data.vertices)
    base = np.empty(count * 3, dtype=np.float32)
    blocks[0].data.foreach_get("co", base)
    base = base.reshape(count, 3)
    deltas = []
    for block in blocks[1:]:
        shape = np.empty(count * 3, dtype=np.float32)
        block.data.foreach_get("co", shape)
        deltas.append(shape.reshape(count, 3) - base)
    deltas = np.stack(deltas)
    side = "L" if ".L" in name else "R"
    centre = np.array((lid.matrix_world.inverted() @ rig.matrix_world @ rig.data.bones["DEF_eye." + side].head_local)[:])
    rest = np.linalg.norm(base - centre, axis=1)
    for animation in gltf["animations"]:
        for channel in animation["channels"]:
            if channel["target"]["node"] != node_index or channel["target"]["path"] != "weights":
                continue
            sampler = animation["samplers"][channel["sampler"]]
            frames = gltf["accessors"][sampler["input"]]["count"]
            weights = floats(sampler["output"], 1).reshape(frames, len(deltas))
            positions = base[None] + np.einsum("fk,kvc->fvc", weights, deltas)
            radius = np.linalg.norm(positions - centre, axis=2)
            error = float(np.abs(radius - rest.mean()).max())
            total = float(weights.sum(axis=1).max())
            clip = report["clips"].setdefault(animation["name"], {"worst_radius_error": 0.0, "max_weight_sum": 0.0})
            clip["worst_radius_error"] = max(clip["worst_radius_error"], error)
            clip["max_weight_sum"] = max(clip["max_weight_sum"], total)
            report["worst_radius_error"] = max(report["worst_radius_error"], error)
            report["max_weight_sum"] = max(report["max_weight_sum"], total)

if len(args) > 1:
    open(args[1], "w").write(json.dumps(report, indent=2))
print("RESULT worst_radius_error %.4f max_weight_sum %.2f clips %d" % (
    report["worst_radius_error"], report["max_weight_sum"], len(report["clips"])))
# Lids sit on a 0.168 sphere. Interpolating between two neighbouring steps cuts a
# chord, so a few millimetres are expected; a wrong sum is off by centimetres.
if report["worst_radius_error"] > 0.004 or report["max_weight_sum"] > 1.001:
    raise RuntimeError("Blink leaves the eye sphere in the exported GLB")
