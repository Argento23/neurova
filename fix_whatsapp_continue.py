import json
import os

BASE_DIR = r"c:\Users\Gustavo\Downloads\neurova"

workflows = [
    ("mindhafen", "mindhafen_autonomous_lead_gen_v1.json"),
    ("argenterio", "argenterio_autonomous_lead_gen_v1.json"),
    ("agency", "generarise_autonomous_v33_fixed.json")
]

def ensure_continue_on_fail():
    """Asegurar que el nodo WhatsApp tenga continueOnFail activado"""
    
    for folder, filename in workflows:
        if folder == "agency":
            path = os.path.join(BASE_DIR, folder, "workflows", filename)
        else:
            if folder == "mindhafen":
                path = os.path.join(BASE_DIR, folder, "workflows", filename)
            else:
                path = os.path.join(BASE_DIR, folder, filename)
        
        # Load workflow
        with open(path, 'r', encoding='utf-8') as f:
            workflow = json.load(f)
        
        # Find WhatsApp node
        wa_nodes = [n for n in workflow['nodes'] if 'WhatsApp' in n['name'] or 'texto' in n['name'].lower()]
        
        if wa_nodes:
            for node in wa_nodes:
                node['continueOnFail'] = True
                print(f"  - {filename}: Nodo '{node['name']}' configurado con continueOnFail")
        
        # Save
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(workflow, f, indent=4, ensure_ascii=False)
    
    print("\nTodos los workflows actualizados!")

if __name__ == "__main__":
    print("Configurando continueOnFail en nodos WhatsApp...\n")
    ensure_continue_on_fail()
    print("\nAhora el workflow continuara enviando emails aunque WhatsApp falle.")
