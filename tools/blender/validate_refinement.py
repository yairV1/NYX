"""Verify eyelid clearance at nine blink stages and closed-eye coverage."""
import bpy
import json
import math
import sys
from pathlib import Path
from mathutils import Vector
from mathutils.geometry import closest_point_on_tri
from mathutils.bvhtree import BVHTree

rig=bpy.data.objects["RIG_Nyx"]
rig.animation_data_clear()
for pb in rig.pose.bones:
    pb.matrix_basis.identity()
report={"blink_samples":[], "closed_coverage":[]}
for fraction in [i/8 for i in range(9)]:
    for side in ("L","R"):
        for part,degrees in (("up",-61),("low",40)):
            pb=rig.pose.bones[f"CTRL_lid_{part}.{side}"]
            pb.rotation_mode="XYZ"
            pb.rotation_euler.x=math.radians(degrees)*fraction
    bpy.context.view_layer.update()
    dg=bpy.context.evaluated_depsgraph_get()
    for side in ("L","R"):
        center=rig.data.bones["DEF_eye."+side].head_local
        lid_trees=[]
        minimum=1.0
        for part in ("up","low"):
            obj=bpy.data.objects[f"GEO_lid_{part}.{side}"].evaluated_get(dg)
            mesh=obj.to_mesh()
            mesh.calc_loop_triangles()
            vertices=[obj.matrix_world@v.co for v in mesh.vertices]
            triangles=[tuple(t.vertices) for t in mesh.loop_triangles]
            for tri in triangles:
                nearest=closest_point_on_tri(center,*(vertices[i] for i in tri))
                minimum=min(minimum,(nearest-center).length)
            lid_trees.append(BVHTree.FromPolygons(vertices,triangles,all_triangles=True))
            obj.to_mesh_clear()
        clearance=minimum-.16
        report["blink_samples"].append({"fraction":fraction,"side":side,"minimum_clearance":clearance})
        if clearance<0:
            raise RuntimeError("Lid penetrates eye at "+str(fraction))
        if fraction==1:
            covered=0
            for dx in (-.08,-.04,0,.04,.08):
                for dz in (-.08,-.04,0,.04,.08):
                    origin=Vector((center.x+dx,-2,center.z+dz))
                    hits=[tree.ray_cast(origin,Vector((0,1,0)))[0] for tree in lid_trees]
                    if any(hit is not None and hit.y<center.y for hit in hits):
                        covered+=1
            report["closed_coverage"].append({"side":side,"covered":covered,"samples":25})
            if covered<25:
                raise RuntimeError("Closed lid gap on "+side)
Path(sys.argv[sys.argv.index("--")+1]).write_text(json.dumps(report,indent=2))
print("PASS spherical clearance and coverage")
