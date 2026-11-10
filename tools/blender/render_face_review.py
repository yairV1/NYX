"""Render neutral, blink phases and smile/open with matching cameras."""
import argparse
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector
p=argparse.ArgumentParser()
p.add_argument("--out",required=True)
a=p.parse_args(sys.argv[sys.argv.index("--")+1:])
out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
rig=bpy.data.objects["RIG_Nyx"]
rig.animation_data_clear()
for pb in rig.pose.bones:
    pb.matrix_basis.identity()
for obj in bpy.data.objects:
    if obj.type=="MESH":
        obj.hide_render=not any(c.name in ("GEO","FACIAL","ACCESSORIES") for c in obj.users_collection)
for obj in list(bpy.data.objects):
    if obj.type in ("LIGHT","CAMERA"):
        bpy.data.objects.remove(obj,do_unlink=True)
def aim(obj,target):
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat("-Z","Y").to_euler()
camera_data=bpy.data.cameras.new("Review")
camera=bpy.data.objects.new("Review",camera_data);bpy.context.scene.collection.objects.link(camera)
camera.location=(.12,-4,2.45);aim(camera,(0,-.1,2.32));camera_data.type="ORTHO";camera_data.ortho_scale=1.45
scene=bpy.context.scene;scene.camera=camera;scene.render.engine="CYCLES";scene.cycles.samples=24
scene.render.resolution_x=640;scene.render.resolution_y=640;scene.render.resolution_percentage=100
scene.world.color=(.08,.08,.08)
for name,loc,power,size in [("Key",(-2,-3,4),220,3),("Fill",(2,-2,3),100,2)]:
    light=bpy.data.lights.new(name,"AREA");light.energy=power;light.shape="DISK";light.size=size
    obj=bpy.data.objects.new(name,light);scene.collection.objects.link(obj);obj.location=loc;aim(obj,(0,0,2.2))
for name,blink,opening,smile in [("neutral",0,0,0),("blink-half",.5,0,0),("blink-closed",1,0,0),("smile",0,0,1),("open",0,1,.4)]:
    for side in ("L","R"):
        for part,degrees in (("up",-61),("low",40)):
            pb=rig.pose.bones["CTRL_lid_"+part+"."+side];pb.rotation_mode="XYZ";pb.rotation_euler.x=math.radians(degrees)*blink
    new=bpy.data.objects.get("GEO_lip_loops")
    if new:
        for obj_name in ("GEO_lip_loops","GEO_mouth_cavity"):
            keys=bpy.data.objects[obj_name].data.shape_keys.key_blocks
            keys["Smile"].value=smile;keys["MouthOpen"].value=opening
    else:
        rig.pose.bones["CTRL_mouth_open"].scale.z=1+opening*7
        for side in ("L","R"):
            rig.pose.bones["CTRL_mouth."+side].location.z=.022*smile
    bpy.context.view_layer.update()
    scene.render.filepath=str(out/(name+".png"));bpy.ops.render.render(write_still=True)
