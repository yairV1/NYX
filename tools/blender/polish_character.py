"""Refine v2's wearable materials and backpack without changing rig, UVs or actions.
blender -b artifacts/phase-4/nyx-v2-quality-c.blend -P tools/blender/polish_character.py -- --out artifacts/design-refinement/nyx-polished.blend
The input stays immutable. Generated normal images are packed in the output.
"""
import argparse
import json
import math
import sys
from pathlib import Path
import bpy
import numpy as np
from mathutils import Vector
from mathutils.kdtree import KDTree

p = argparse.ArgumentParser()
p.add_argument('--out', required=True)
a = p.parse_args(sys.argv[sys.argv.index('--') + 1:])
out = Path(a.out).resolve()
if out.exists() or out == Path(bpy.data.filepath).resolve():
    raise RuntimeError('Choose a fresh output path')
rig = bpy.data.objects['RIG_Nyx']
rig.animation_data_clear()
for bone in rig.pose.bones:
    bone.matrix_basis.identity()
bpy.context.view_layer.update()

# A tileable tangent normal, not procedural nodes that disappear in glTF.
size = 512
y, x = np.mgrid[0:size, 0:size] / size
height = (np.sin(2*math.pi*x*64 + .65*np.sin(2*math.pi*y*64)) *
          np.cos(2*math.pi*y*64))
dx = (np.roll(height, -1, axis=1)-np.roll(height, 1, axis=1))*.12
dy = (np.roll(height, -1, axis=0)-np.roll(height, 1, axis=0))*.12
normal = np.stack((-dx, -dy, np.ones_like(x)), axis=-1)
normal /= np.linalg.norm(normal, axis=-1, keepdims=True)
rgba = np.concatenate((normal*.5+.5, np.ones((size,size,1))), axis=-1).astype(np.float32)
image = bpy.data.images.new('NYX_woven_normal', width=size, height=size, alpha=False)
image.colorspace_settings.name = 'Non-Color'
image.pixels.foreach_set(rgba.ravel())
image.pack()

cloth = {'M_hoodie':(.82,.38), 'M_hoodie_dark':(.9,.52),
         'M_bag':(.77,.3), 'M_bag_dark':(.84,.35)}
for name, (roughness, strength) in cloth.items():
    mat = bpy.data.materials[name]
    tree = mat.node_tree
    bsdf = next(n for n in tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Roughness'].default_value = roughness
    # glTF sheen is explicit and low, avoiding the old full-weight sheen export bug.
    bsdf.inputs['Sheen Weight'].default_value = 0
    tex = tree.nodes.new('ShaderNodeTexImage')
    tex.name = 'NYX_Woven_Normal'
    tex.image = image
    nm = tree.nodes.new('ShaderNodeNormalMap')
    nm.inputs['Strength'].default_value = strength
    tree.links.new(tex.outputs['Color'],nm.inputs['Color'])
    tree.links.new(nm.outputs['Normal'],bsdf.inputs['Normal'])

# Accessories had no UVs. Project each polygon along its dominant normal;
# this affects only the new tileable normal map, never the original fur/eye UVs.
for obj in bpy.data.objects:
    if obj.type != 'MESH' or not any(m and m.name in cloth for m in obj.data.materials):
        continue
    if not obj.data.uv_layers:
        uv = obj.data.uv_layers.new(name='NYX_Weave')
        for poly in obj.data.polygons:
            axis = max(range(3), key=lambda i: abs(poly.normal[i]))
            axes = [i for i in range(3) if i != axis]
            for li in poly.loop_indices:
                co = obj.data.vertices[obj.data.loops[li].vertex_index].co
                uv.data[li].uv = (co[axes[0]], co[axes[1]])

metal = bpy.data.materials['M_buckle']
bsdf = next(n for n in metal.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
bsdf.inputs['Base Color'].default_value = (.28,.32,.42,1)
bsdf.inputs['Metallic'].default_value = .78
bsdf.inputs['Roughness'].default_value = .28
for name in ('GEO_aglet','GEO_aglet.001'):
    bpy.data.objects[name].data.materials[0] = metal

# Piping, zipper track and pull tab: real geometry weighted to the same nearby
# backpack vertices, so these details follow all existing spine/chest motion.
bag = bpy.data.objects['GEO_backpack']
kdtree = KDTree(len(bag.data.vertices))
for v in bag.data.vertices:
    kdtree.insert(v.co, v.index)
kdtree.balance()
added=[]
def tube(name, points, radius, material):
    curve=bpy.data.curves.new(name,'CURVE')
    curve.dimensions='3D'
    curve.bevel_depth=radius
    curve.bevel_resolution=1
    spline=curve.splines.new('POLY')
    spline.points.add(len(points)-1)
    for point,co in zip(spline.points,points): point.co=(*co,1)
    obj=bpy.data.objects.new(name,curve)
    bpy.data.collections['ACCESSORIES'].objects.link(obj)
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active=obj
    obj.select_set(True)
    bpy.ops.object.convert(target='MESH')
    obj=bpy.context.object
    obj.data.materials.append(material)
    for group in bag.vertex_groups: obj.vertex_groups.new(name=group.name)
    for vertex in obj.data.vertices:
        _,index,_=kdtree.find(vertex.co)
        for group in bag.data.vertices[index].groups:
            obj.vertex_groups[group.group].add([vertex.index],group.weight,'REPLACE')
    modifier=obj.modifiers.new('NYX_Rig','ARMATURE')
    modifier.object=rig
    for face in obj.data.polygons: face.use_smooth=True
    obj.select_set(False)
    added.append(obj.name)
    return obj

# Rounded outline on back face, inset from the actual bevel bounds.
points=[]
for cx,cz,start in ((.31,1.63,0),(-.31,1.63,90),(-.31,1.09,180),(.31,1.09,270)):
    for i in range(9):
        angle=math.radians(start+i*90/8)
        points.append((cx+.035*math.cos(angle),.668,cz+.035*math.sin(angle)))
points.append(points[0])
tube('GEO_bag_piping',points,.006,bpy.data.materials['M_bag_dark'])
tube('GEO_bag_zipper',[(-.19,.754,1.34),(.19,.754,1.34)],.007,metal)
tube('GEO_bag_zip_pull',[(.15,.762,1.34),(.15,.777,1.30),(.18,.777,1.30),(.18,.762,1.34)],.005,metal)
# Small cyan signal on the backpack, like a quiet device status indicator.
signal=bpy.data.materials.new('M_Nodo_signal')
signal.use_nodes=True
bsdf=signal.node_tree.nodes.get('Principled BSDF')
bsdf.inputs['Base Color'].default_value=(.02,.48,.57,1)
bsdf.inputs['Metallic'].default_value=.3
bsdf.inputs['Roughness'].default_value=.3
bsdf.inputs['Emission Color'].default_value=(.01,.35,.45,1)
bsdf.inputs['Emission Strength'].default_value=.4
tube('GEO_bag_signal',[(-.07,.671,1.51),(.07,.671,1.51)],.012,signal)

# Conversion must never apply modifiers on another selected object.
for name in ('GEO_hoodie', 'GEO_hood', 'GEO_backpack', 'GEO_string'):
    assert any(m.type == 'ARMATURE' and m.object == rig for m in bpy.data.objects[name].modifiers), name + ' lost its skin modifier'
out.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out))
out.with_suffix('.json').write_text(json.dumps({'source':'artifacts/phase-4/nyx-v2-quality-c.blend', 'added':added,'materials':list(cloth),'unchanged':'rest skeleton, actions, body geometry, fur and eye UVs'},indent=2))
