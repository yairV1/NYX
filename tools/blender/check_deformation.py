"""Measure real morph and secondary deformation, not just key/bone names."""
import bpy
import json
import sys
from pathlib import Path

def mesh_positions(obj):
    evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    mesh = evaluated.to_mesh()
    points = [v.co.copy() for v in mesh.vertices]
    evaluated.to_mesh_clear()
    return points

rig = bpy.data.objects.get("RIG_Nyx")
if rig:
    rig.animation_data_clear()
    for b in rig.pose.bones:
        b.matrix_basis.identity()
bpy.context.view_layer.update()
report = {"morphs": {}}
for obj in bpy.data.objects:
    if obj.type != "MESH" or not obj.data.shape_keys:
        continue
    for key in list(obj.data.shape_keys.key_blocks)[1:]:
        key.value = 0
        bpy.context.view_layer.update()
        baseline = mesh_positions(obj)
        key.value = 1
        bpy.context.view_layer.update()
        posed = mesh_positions(obj)
        maximum = max((a-b).length for a,b in zip(baseline,posed))
        report["morphs"][obj.name + "/" + key.name] = maximum
        if maximum < 1e-7:
            raise RuntimeError("No deformation for " + key.name)
        key.value = 0
bpy.context.view_layer.update()
if rig:
    action = bpy.data.actions.get("Idle_Secondary")
    if action:
        ad = rig.animation_data_create()
        ad.action = action
        if action.slots:
            ad.action_slot = action.slots[0]
        values = []
        for frame in (1,30,60,90,121):
            bpy.context.scene.frame_set(frame)
            values.append({"frame":frame, "angles":{b.name:list(b.rotation_euler)
                           for b in rig.pose.bones if b.name.startswith("MCH_spring_")}})
        report["secondary_samples"] = values
output = Path(sys.argv[sys.argv.index("--")+1])
output.write_text(json.dumps(report,indent=2))
print("Measured",len(report["morphs"]),"morphs")
