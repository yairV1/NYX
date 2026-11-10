"""Read-only rig inventory. Run with Blender -b INPUT -P this.py -- OUTPUT.json."""
import bpy
import json
import sys
from pathlib import Path

def inventory():
    result = {"blender": bpy.app.version_string, "source": bpy.data.filepath,
              "rigs": [], "meshes": [], "actions": []}
    for obj in bpy.data.objects:
        if obj.type == "ARMATURE":
            result["rigs"].append({
                "name": obj.name,
                "bones": [{"name": b.name, "parent": b.parent.name if b.parent else None,
                           "deform": b.use_deform, "head": list(b.head_local),
                           "tail": list(b.tail_local),
                           "constraints": [c.type for c in obj.pose.bones[b.name].constraints]}
                          for b in obj.data.bones]})
        if obj.type == "MESH":
            result["meshes"].append({
                "name": obj.name, "vertices": len(obj.data.vertices),
                "materials": [m.name if m else None for m in obj.data.materials],
                "keys": [k.name for k in obj.data.shape_keys.key_blocks] if obj.data.shape_keys else [],
                "modifiers": [{"name": m.name, "type": m.type} for m in obj.modifiers],
                "groups": [g.name for g in obj.vertex_groups],
                "parent": obj.parent.name if obj.parent else None,
                "collections": [c.name for c in obj.users_collection]})
    result["actions"] = [{"name": a.name, "range": list(a.frame_range)} for a in bpy.data.actions]
    return result

if __name__ == "__main__":
    output = Path(sys.argv[sys.argv.index("--") + 1])
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(inventory(), indent=2))
