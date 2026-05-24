import json

transcript_path = r"C:\Users\Gustavo\.gemini\antigravity\brain\56600e55-2f5a-4920-8e51-64839b826d1e\.system_generated\logs\transcript.jsonl"

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line)
            content = data.get("content", "")
            if content and "EUREKA" in content:
                print(f"MATCH: {data.get('step_index')}")
                print(content[:500])
        except Exception as e:
            pass










