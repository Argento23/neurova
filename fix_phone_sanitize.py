import json
import os
import re

BASE_DIR = r"c:\Users\Gustavo\Downloads\neurova"

def fix_phone_format_in_designer():
    """Corregir formato de telefono en nodo Diseñador Email Premium"""
    
    workflows = [
        ("agency", "workflows", "generarise_autonomous_v33_fixed.json")
    ]
    
    for folder, subfolder, filename in workflows:
        path = os.path.join(BASE_DIR, folder, subfolder, filename)
        
        with open(path, 'r', encoding='utf-8') as f:
            workflow = json.load(f)
        
        # Encontrar nodo Diseñador Email Premium
        designer = next(n for n in workflow['nodes'] if n['name'] == 'Diseñador Email Premium')
        
        # Buscar en el código donde se asigna phone
        code = designer['parameters']['jsCode']
        
        # Reemplazar la línea que asigna phone
        # Debe limpiar el formato: quitar +, espacios, y guiones
        old_line = "const phone = data.phone || phone_maps || '5491112345678';"
        new_line = """// Limpiar formato de telefono (quitar +, espacios, guiones)
const rawPhone = data.phone || phone_maps || '5491112345678';
const phone = rawPhone.replace(/[+\\s-]/g, '');"""
        
        code = code.replace(old_line, new_line)
        
        designer['parameters']['jsCode'] = code
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(workflow, f, indent=4, ensure_ascii=False)
        
        print(f"OK {filename}: Telefono limpiado (sin +, espacios, guiones)")
    
    print("\nAhora el telefono se generara como: 5491154021644")
    print("(sin +, sin espacios, sin guiones)")

if __name__ == "__main__":
    print("Limpiando formato de telefono en Diseñador Email Premium...\n")
    fix_phone_format_in_designer()
