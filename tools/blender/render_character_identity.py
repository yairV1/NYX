"""Repeatable identity look-development: same camera/light for old and new assets.
blender -b candidate.blend -P tools/blender/render_character_identity.py -- --out folder
Outputs neutral, back, portrait and wave, plus the complete presentation .blend.
"""
import argparse
import json
import sys
from pathlib import Path
import bpy
from mathutils import Vector
p=argparse.ArgumentParser()
p.add_argument('--out',required=True)
p.add_argument('--size',type=int,default=800)
p.add_argument('--samples',type=int,default=32)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:])
out=Path(a.out).resolve(); out.mkdir(parents=True,exist_ok=True)
rig=bpy.data.objects['RIG_Nyx']
character={o for n in ('GEO','FACIAL','ACCESSORIES') for o in bpy.data.collections[n].all_objects if o.type=='MESH'}
for o in bpy.data.objects:
    if o.type=='MESH': o.hide_render=o not in character
for o in list(bpy.data.objects):
    if o.type in ('LIGHT','CAMERA'): bpy.data.objects.remove(o,do_unlink=True)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=a.samples
scene.cycles.use_denoising=True
scene.render.resolution_x=scene.render.resolution_y=a.size
scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGBA'
scene.view_settings.view_transform='AgX'
scene.world.use_nodes=True
scene.world.node_tree.nodes.get('Background').inputs[0].default_value=(.12,.15,.22,1)
scene.world.node_tree.nodes.get('Background').inputs[1].default_value=.25

def aim(o,target): o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
for name,position,energy,size,color in (
    ('NYX_Key',(-3,-4,5),750,4,(.9,.94,1)),
    ('NYX_Fill',(3,-3,2),300,3,(1,.8,.65)),
    ('NYX_Violet',(2,3,4),1000,3,(.48,.25,1)),
    ('NYX_Cyan',(-3,1,3),550,2,(.12,.65,1))):
    light=bpy.data.lights.new(name,'AREA');light.energy=energy;light.size=size;light.color=color
    obj=bpy.data.objects.new(name,light);scene.collection.objects.link(obj);obj.location=position;aim(obj,(0,0,1.7))
cam=bpy.data.cameras.new('NYX_Identity');cam.type='ORTHO'
obj=bpy.data.objects.new('NYX_Identity',cam);scene.collection.objects.link(obj);scene.camera=obj
ad=rig.animation_data_create()
for track in ad.nla_tracks: track.mute=True
shots=[('neutral',(3,-7,2.5),(0,0,1.65),3.65,'Idle_Secondary',1),
       ('back',(-3,7,2.8),(0,0,1.65),3.65,'Idle_Secondary',1),
       ('portrait',(.9,-7,2.6),(0,0,2.18),2.3,'Idle_Secondary',1),
       ('wave',(1,-7,2.7),(0,0,1.65),3.65,'Wave',44)]
for name,pos,target,scale,action,frame in shots:
    ad.action=bpy.data.actions[action]
    if ad.action.slots: ad.action_slot=ad.action.slots[0]
    scene.frame_set(frame)
    cam.ortho_scale=scale;obj.location=pos;aim(obj,target)
    scene.render.filepath=str(out/(name+'.png'))
    bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out/'presentation.blend'))
(out/'render-settings.json').write_text(json.dumps({'blender':bpy.app.version_string,'engine':'Cycles','device':'CPU','size':a.size,'samples':a.samples,'denoise':True,'view_transform':'AgX','shots':[s[0] for s in shots]},indent=2))
