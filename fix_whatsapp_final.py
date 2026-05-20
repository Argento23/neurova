import json
import os

BASE_DIR = r"c:\Users\Gustavo\Downloads\neurova"

def fix_workflows():
    """
    1. MindHafen y Argenterio: Eliminar nodo WhatsApp, reconectar flujo directo a Email
    2. GenerArise: Corregir prompt IA para generar teléfono sin + y sin espacios
    """
    
    # === MINDHAFEN: Eliminar WhatsApp ===
    print("1. MindHafen: Eliminando nodo WhatsApp...")
    mh_path = os.path.join(BASE_DIR, "mindhafen", "workflows", "mindhafen_autonomous_lead_gen_v1.json")
    mh = json.load(open(mh_path, 'r', encoding='utf-8'))
    
    # Eliminar nodo WhatsApp
    mh['nodes'] = [n for n in mh['nodes'] if 'WhatsApp' not in n['name']]
    
    # Reconectar: Diseñador Email Premium -> Enviar Email (saltar WhatsApp)
    mh['connections']['Diseñador Email Premium']['main'][0][0] = {
        "node": "Enviar Email",
        "type": "main",
        "index": 0
    }
    
    with open(mh_path, 'w', encoding='utf-8') as f:
        json.dump(mh, f, indent=4, ensure_ascii=False)
    print("   OK MindHafen actualizado (sin WhatsApp)")
    
    # === ARGENTERIO: Eliminar WhatsApp ===
    print("\n2. Argenterio: Eliminando nodo WhatsApp...")
    arg_path = os.path.join(BASE_DIR, "argenterio", "argenterio_autonomous_lead_gen_v1.json")
    arg = json.load(open(arg_path, 'r', encoding='utf-8'))
    
    # Eliminar nodo WhatsApp
    arg['nodes'] = [n for n in arg['nodes'] if 'WhatsApp' not in n['name']]
    
    # Reconectar: Diseñador Email Premium -> Enviar Email
    arg['connections']['Diseñador Email Premium']['main'][0][0] = {
        "node": "Enviar Email",
        "type": "main",
        "index": 0
    }
    
    with open(arg_path, 'w', encoding='utf-8') as f:
        json.dump(arg, f, indent=4, ensure_ascii=False)
    print("   OK Argenterio actualizado (sin WhatsApp)")
    
    # === GENERARISE: Corregir formato de teléfono ===
    print("\n3. GenerArise: Corrigiendo formato de teléfono en IA...")
    gen_path = os.path.join(BASE_DIR, "agency", "workflows", "generarise_autonomous_v33_fixed.json")
    gen = json.load(open(gen_path, 'r', encoding='utf-8'))
    
    # Actualizar prompt de IA
    ai_node = next(n for n in gen['nodes'] if n['name'] == 'IA Extractor PRO')
    ai_node['parameters']['text'] = """=CONTEXTO:
Eres el Equipo de **GenerArise**.

NEGOCIO:
Web: {{ $json.text }}
Nombre: {{ $json.title }}
Tel Maps: {{ $json.phone_from_maps }}

TAREA:
1. EXTRAE datos:
   - Teléfono/WhatsApp: FORMATO OBLIGATORIO sin + y sin espacios, código 549 al inicio
     Ejemplo correcto: "5491139867665" (NO "+54 11 3986-7665")
   - Email
2. IDENTIFICA industria
3. GENERA WA TEXTO (Corto, profesional, 'Equipo GenerArise').
4. GENERA EMAIL BODY (SOLO EL TEXTO CENTRAL, sin <html> ni <head>, usa <p> y <ul>):
   - Saludo: 'Hola equipo de [Nombre]'
   - Párrafo 1: Mención a su industria y oportunidad de IA.
   - Párrafo 2: Solución específica para ellos.
   - Lista: 3 Beneficios clave.
   - CTA: '¿Agendamos una demo breve?'

JSON:
{
  "phone": "5491139867665",
  "email": "...",
  "score": 8,
  "wa_msg": "Hola [Nombre]...",
  "email_body": "<p>...</p>"
}"""
    
    with open(gen_path, 'w', encoding='utf-8') as f:
        json.dump(gen, f, indent=4, ensure_ascii=False)
    print("   OK GenerArise actualizado (telefono sin + ni espacios)")
    
    print("\nOK Todos los workflows actualizados!")
    print("\nResumen:")
    print("- MindHafen: Email solamente (sin WhatsApp)")
    print("- Argenterio: Email solamente (sin WhatsApp)")
    print("- GenerArise: WhatsApp + Email (teléfono formato correcto)")

if __name__ == "__main__":
    fix_workflows()
