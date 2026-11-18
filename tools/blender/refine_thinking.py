"""Improve Thinking with bounded FK fitting, then eased entry/hold/return.
Run on nyx-polished-v2.blend; writes a fresh candidate, never the input.
"""
import argparse, json, sys
from pathlib import Path
import bpy
from mathutils import Vector
p=argparse.ArgumentParser();p.add_argument('--out',required=True)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);out=Path(a.out).resolve()
assert not out.exists() and out != Path(bpy.data.filepath).resolve()
r=bpy.data.objects['RIG_Nyx'];action=bpy.data.actions['Thinking']
ad=r.animation_data_create();ad.action=action;ad.action_slot=action.slots[0]
bpy.context.scene.frame_set(30)
cb=action.layers[0].strips[0].channelbag(action.slots[0])
before=list(r.pose.bones['DEF_hand.L'].tail)
ad.action=None
upper=r.pose.bones['CTRL_FK_upper_arm.L'];fore=r.pose.bones['CTRL_FK_forearm.L']
# Knuckles just in front of the lower muzzle; avoid pushing the paw into the face.
target=Vector((.10,-.47,1.98))
initial=[upper.rotation_euler[i] for i in range(3)]+[fore.rotation_euler.x]
values=initial[:]
def loss(v):
 upper.rotation_euler=v[:3];fore.rotation_euler.x=v[3]
 bpy.context.view_layer.update()
 hand=r.pose.bones['DEF_hand.L'];elbow=r.pose.bones['DEF_forearm.L'].head
 return (hand.tail-target).length_squared + .035*(elbow-Vector((.48,-.23,1.53))).length_squared
bounds=[(-1.2,1.8),(-1.4,1.4),(-1.2,1.2),(.2,2.6)]
for step in (.24,.12,.06,.03,.015,.0075):
 for iteration in range(18):
  best=loss(values);changed=False
  for axis in range(4):
   for direction in (-1,1):
    candidate=values[:];candidate[axis]=max(bounds[axis][0],min(bounds[axis][1],candidate[axis]+step*direction))
    score=loss(candidate)
    if score<best: values=candidate;best=score;changed=True
  if not changed: break
loss(values)
after=list(r.pose.bones['DEF_hand.L'].tail)
assert (Vector(after)-target).length < .045
# Match the existing frame-1 rest exactly at the last frame on every channel.
# Previously the action held its thinking pose at frame 61 and relied on a fade.
for curve in cb.fcurves:
 start=curve.evaluate(1)
 for key in curve.keyframe_points:
  if round(key.co.x)==61: key.co.y=start
  key.interpolation='BEZIER';key.handle_left_type=key.handle_right_type='AUTO_CLAMPED'
 curve.update()
for bone,axis,value in [('CTRL_FK_upper_arm.L',i,values[i]) for i in range(3)]+[('CTRL_FK_forearm.L',0,values[3]),('CTRL_fingers.L',0,.50),('CTRL_thumb.L',0,.20)]:
 path=f'pose.bones["{bone}"].rotation_euler'
 curve=cb.fcurves.find(path,index=axis)
 rest=curve.evaluate(1)
 while curve.keyframe_points: curve.keyframe_points.remove(curve.keyframe_points[0])
 for frame,v in ((1,rest),(20,value),(42,value),(61,rest)):
  key=curve.keyframe_points.insert(frame,v);key.interpolation='BEZIER';key.handle_left_type=key.handle_right_type='AUTO_CLAMPED'
 curve.update()
ad.action=action;ad.action_slot=action.slots[0]
# Regression: first and last deformed-bone transforms agree, and no scale is changed.
bpy.context.scene.frame_set(1);first={b.name:b.matrix.copy() for b in r.pose.bones if b.name.startswith('DEF_')}
bpy.context.scene.frame_set(61)
residual=max(abs(b.matrix[i][j]-first[b.name][i][j]) for b in r.pose.bones if b.name in first for i in range(4) for j in range(4))
assert residual<1e-5,residual
bpy.context.scene.frame_set(30)
out.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out))
out.with_suffix('.json').write_text(json.dumps({'action':'Thinking','frames':[1,20,42,61],'fps':bpy.context.scene.render.fps,'old_knuckle_position':before,'new_knuckle_position':after,'target':list(target),'fk_rotations':values,'start_end_matrix_error':residual},indent=2))
