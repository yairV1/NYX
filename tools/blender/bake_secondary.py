"""Bake damped spring offsets onto a COPY of an existing action.
Blender -b prepared.blend -P bake_secondary.py -- --action Idle --out springs.blend
No collision solver: inspect clipping before production use.
"""
import argparse
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--action", default="Idle")
    p.add_argument("--out", required=True)
    a = p.parse_args(sys.argv[sys.argv.index("--")+1:])
    output = Path(a.out).resolve()
    if output.exists() or output == Path(bpy.data.filepath).resolve():
        raise RuntimeError("Output must be a new file.")
    rig = bpy.data.objects["RIG_Nyx"]
    source = bpy.data.actions.get(a.action)
    if source is None:
        raise RuntimeError("Unknown action " + a.action)
    helpers = [b for b in rig.pose.bones if b.name.startswith("MCH_spring_")]
    if not helpers:
        raise RuntimeError("Run prepare_character.py first.")
    ad = rig.animation_data_create()
    ad.action = source
    if source.slots:
        ad.action_slot = source.slots[0]
    start, end = map(int, source.frame_range)
    fps = bpy.context.scene.render.fps / bpy.context.scene.render.fps_base
    dt = 1/fps
    samples = {b.name: [] for b in helpers}
    previous = {}
    offsets = {b.name: Vector((0,0,0)) for b in helpers}
    velocities = {b.name: Vector((0,0,0)) for b in helpers}
    for frame in range(start, end+1):
        bpy.context.scene.frame_set(frame)
        for helper in helpers:
            target = rig.pose.bones[helper.name.removeprefix("MCH_spring_")]
            parent = target.parent or target
            rotation = parent.matrix.to_quaternion()
            prior = previous.get(helper.name, rotation)
            delta = prior.rotation_difference(rotation)
            if delta.w < 0:
                delta.negate()
            angular_velocity = Vector(delta.to_euler())/dt
            previous[helper.name] = rotation.copy()
            x, velocity = offsets[helper.name], velocities[helper.name]
            goal = -angular_velocity * .018
            for _ in range(4):
                h = dt/4
                velocity += (100*(goal-x)-20*velocity)*h
                x += velocity*h
                for axis in range(3):
                    x[axis] = min(.18, max(-.18, x[axis]))
            samples[helper.name].append(tuple(x))
    baked = source.copy()
    baked.name = source.name + "_Secondary"
    baked.use_fake_user = True
    ad.action = baked
    if baked.slots:
        ad.action_slot = baked.slots[0]
    for helper in helpers:
        helper.rotation_mode = "XYZ"
        for index, value in enumerate(samples[helper.name]):
            helper.rotation_euler = value
            helper.keyframe_insert("rotation_euler", frame=start+index, group="Secondary")
    bpy.context.scene.frame_set(start)
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(output))
    print("Baked", baked.name, "frames", start, end, "helpers", len(helpers))

if __name__ == "__main__":
    main()
