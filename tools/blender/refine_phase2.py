"""Reproducible LOD and facial repair of the prepared v2 candidate."""
import argparse
import json
import math
import sys
from pathlib import Path
import bpy
import bmesh
from mathutils import Vector

def clean(obj):
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=1e-6)
    bmesh.ops.dissolve_degenerate(bm, edges=list(bm.edges), dist=1e-7)
    loose = [v for v in bm.verts if not v.link_faces]
    if loose:
        bmesh.ops.delete(bm, geom=loose, context="VERTS")
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()

def set_head_weights(obj, rig):
    for group in list(obj.vertex_groups):
        obj.vertex_groups.remove(group)
    group = obj.vertex_groups.new(name="DEF_head")
    group.add(list(range(len(obj.data.vertices))),1,"REPLACE")
    if not any(m.type == "ARMATURE" for m in obj.modifiers):
        mod = obj.modifiers.new("Armature","ARMATURE")
        mod.object = rig
    obj.parent = rig

def mesh_object(name, verts, faces, material, rig):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts,[],faces)
    mesh.update()
    obj = bpy.data.objects.new(name,mesh)
    bpy.data.collections["FACIAL"].objects.link(obj)
    mesh.materials.append(bpy.data.materials[material])
    for polygon in mesh.polygons:
        polygon.use_smooth=True
    set_head_weights(obj,rig)
    return obj

def spherical_blink(obj, rig):
    side=obj.name[-1]
    upper="up" in obj.name
    center=rig.data.bones["DEF_eye."+side].head_local
    start,end=(0,45) if upper else (145,180)
    base=[v.co.copy() for v in obj.data.vertices]
    colors=obj.data.color_attributes.get("Col")
    if colors:
        for index,item in enumerate(colors.data):
            vertex=index if colors.domain=="POINT" else obj.data.loops[index].vertex_index
            v=base[vertex]-center
            angle=math.degrees(math.acos(max(-1,min(1,v.z/v.length))))
            distance=abs(angle-(45 if upper else 145))
            ink=max(0,1-distance/1.2)
            item.color=tuple(.32*(1-ink)+.025*ink for _ in range(3))+(1,)
    obj.shape_key_add(name="Basis")
    previous=obj.data.shape_keys.key_blocks[0]
    set_head_weights(obj,rig)
    for step in range(1,9):
        key=obj.shape_key_add(name=f"BlinkStep{step}")
        key.relative_key=previous
        for point,co in zip(key.data,base):
            v=co-center
            theta=math.acos(max(-1,min(1,v.z/v.length)))
            phi=math.atan2(v.y,v.x)
            fraction=(math.degrees(theta)-start)/(end-start)
            low=0 if upper else 145+(90-145)*step/8
            high=45+(90-45)*step/8 if upper else 180
            angle=math.radians(low+(high-low)*fraction)
            point.co=center+Vector((math.sin(angle)*math.cos(phi),math.sin(angle)*math.sin(phi),math.cos(angle)))*.168
        driver=key.driver_add("value").driver
        variable=driver.variables.new()
        variable.name="rotation"
        variable.type="SINGLE_PROP"
        variable.targets[0].id=rig
        part="up" if upper else "low"
        variable.targets[0].data_path=f'pose.bones["CTRL_lid_{part}.{side}"].rotation_euler[0]'
        divisor=-math.radians(61) if upper else math.radians(40)
        driver.expression=f"min(1,max(0,rotation/({divisor})*8-{step-1}))"
        previous=key

def mouth(rig):
    for name in ("GEO_mouth.L","GEO_mouth.R","GEO_mouth_inside","GEO_mouth_line"):
        obj=bpy.data.objects.get(name)
        if obj:
            bpy.data.objects.remove(obj,do_unlink=True)
    # Concentric quad loops around the aperture, with a recessed interior bowl.
    segments=48
    def coords(opening=0,smile=0,interior=False):
        out=[]
        for ring in range(4):
            for i in range(segments):
                t=2*math.pi*i/segments
                radius=(1-ring*.22) if interior else (1+ring*.12)
                x=.075*(1+smile*.12)*math.cos(t)*radius
                z=2.105+(.0025+opening*.032)*math.sin(t)*radius
                z-=.012*(1-opening*.7)*math.sin(math.pi*min(1,abs(x)/.075))
                z+=smile*.016*math.cos(t)**2
                y=-.503 + (ring*.003 if interior else ring*.0006)
                out.append((x,y,z))
        if interior:
            out.append((0,-.49,2.10))
        return out
    for interior in (False,True):
        faces=[]
        for r in range(3):
            for i in range(segments):
                j=(i+1)%segments
                faces.append((r*segments+i,r*segments+j,(r+1)*segments+j,(r+1)*segments+i))
        if interior:
            for i in range(segments):
                faces.append((3*segments+i,3*segments+(i+1)%segments,4*segments))
        obj=mesh_object("GEO_mouth_cavity" if interior else "GEO_lip_loops",
                        coords(interior=interior),faces,
                        "M_mouth_inside" if interior else "M_mouth_line",rig)
        obj.shape_key_add(name="Basis")
        for name,op,sm in (("MouthOpen",1,0),("Smile",0,1)):
            key=obj.shape_key_add(name=name)
            for point,co in zip(key.data,coords(op,sm,interior)):
                point.co=co
        obj["nyx_note"]="Quad lip loops and shallow cavity. Morph values 0..1."
    # Philtrum follows the face; its thin surface is retained as a separate detail.

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--out",required=True)
    a=p.parse_args(sys.argv[sys.argv.index("--")+1:])
    output=Path(a.out).resolve()
    if output.exists() or output==Path(bpy.data.filepath).resolve():
        raise RuntimeError("Choose a fresh output path.")
    rig=bpy.data.objects["RIG_Nyx"]
    rig.animation_data_clear()
    for pb in rig.pose.bones:
        pb.matrix_basis.identity()
    bpy.context.view_layer.update()
    report={"meshes":{}}
    objects={o for n in ("GEO","FACIAL","ACCESSORIES")
             for o in bpy.data.collections[n].all_objects if o.type=="MESH"}
    for obj in objects:
        before=sum(len(p.vertices)-2 for p in obj.data.polygons)
        # Replace the preliminary linear blink morph with spherical bone motion.
        if obj.data.shape_keys:
            obj.shape_key_clear()
        clean(obj)
        if obj.name.startswith("GEO_lid"):
            # Keep enough spherical tessellation to remain outside the eyeball.
            side=obj.name[-1]
            center=rig.data.bones["DEF_eye."+side].head_local
            for v in obj.data.vertices:
                offset=v.co-center
                if offset.length:
                    v.co=center+offset.normalized()*.168
        elif before>500:
            bpy.context.view_layer.objects.active=obj
            mod=obj.modifiers.new("NYX_LOD","DECIMATE")
            mod.ratio=.18 if obj.name in ("GEO_Nyx_body","GEO_hoodie") else .3
            mod.use_collapse_triangulate=True
            bpy.ops.object.modifier_move_to_index(modifier=mod.name, index=0)
            bpy.ops.object.modifier_apply(modifier=mod.name)
            clean(obj)
        report["meshes"][obj.name]={"before":before,"after":sum(len(p.vertices)-2 for p in obj.data.polygons)}
    for side in ("L","R"):
        for part in ("up","low"):
            bone=rig.pose.bones[f"DEF_lid_{part}.{side}"]
            for constraint in list(bone.constraints):
                if constraint.type == "COPY_ROTATION" and constraint.subtarget.startswith("MCH_eye"):
                    bone.constraints.remove(constraint)
    for obj in objects:
        if obj.name.startswith("GEO_lid"):
            spherical_blink(obj,rig)
    mouth(rig)
    # Existing spherical lid bones rotate about the real eye centers.
    # Their constraints/Idle curves remain the only blink authority.
    rig["nyx_blink_mode"]="Spherical bone rotation; linear chord morphs removed."
    output.parent.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(output))
    output.with_suffix(".json").write_text(json.dumps(report,indent=2))

if __name__=="__main__":
    main()
