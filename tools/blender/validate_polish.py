"""Fresh-import export contract; reject missing animation, rig or texture detail.
blender -b -P tools/blender/validate_polish.py -- candidate.glb report.json
"""
import bpy
import json
import struct
import sys
from pathlib import Path
path, report_path=sys.argv[sys.argv.index('--')+1:]
data=Path(path).read_bytes()
gltf=json.loads(data[20:20+struct.unpack_from('<I',data,12)[0]])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(Path(path).resolve()))
rigs=[o for o in bpy.data.objects if o.type=='ARMATURE']
assert len(rigs)==1, 'Legacy armature or missing rig'
assert len(rigs[0].data.bones)==89
assert len(gltf['animations'])==17
added=['GEO_bag_piping','GEO_bag_zipper','GEO_bag_zip_pull','GEO_bag_signal']
for name in added + ['GEO_hoodie', 'GEO_hood', 'GEO_backpack', 'GEO_string']:
    obj=bpy.data.objects.get(name)
    assert obj and any(m.type=='ARMATURE' and m.object==rigs[0] for m in obj.modifiers),name+' not skinned'
    assert all(abs(sum(g.weight for g in v.groups)-1)<.001 for v in obj.data.vertices),name+' weights'
meshes=[o for o in bpy.data.objects if o.type=='MESH']
triangles=0;degenerate=0
for obj in meshes:
    obj.data.calc_loop_triangles()
    triangles+=len(obj.data.loop_triangles)
    degenerate+=sum(t.area<1e-12 for t in obj.data.loop_triangles)
assert degenerate==0
materials={m['name']:m for m in gltf['materials']}
for name in ('M_hoodie','M_hoodie_dark','M_bag','M_bag_dark'):
    assert 'normalTexture' in materials[name],name+' normal missing'
result={'bytes':len(data),'armatures':len(rigs),'bones':len(rigs[0].data.bones),'meshes':len(meshes),'triangles':triangles,'degenerate_triangles':degenerate,'animations':[a['name'] for a in gltf['animations']],'skinned_added_meshes':added,'cloth_normal_textures':True,'original_armature_excluded':True}
Path(report_path).write_text(json.dumps(result,indent=2))
print(json.dumps(result))
