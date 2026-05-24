import os
import glob

brain_dir = r"C:\Users\Gustavo\.gemini\antigravity\brain\56600e55-2f5a-4920-8e51-64839b826d1e"
png_files = glob.glob(os.path.join(brain_dir, "*.png"))

print(f"Found {len(png_files)} png files.")
sorted_pngs = sorted(png_files, key=os.path.getmtime)

for file in sorted_pngs[-15:]:
    mtime = os.path.getmtime(file)
    print(f"File: {os.path.basename(file)} | Size: {os.path.getsize(file)} bytes | Time: {mtime}")
