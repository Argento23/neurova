import json
import os

# Base paths
BASE_DIR = r"c:\Users\Gustavo\Downloads\neurova"
GENERARISE_WORKFLOW = os.path.join(BASE_DIR, "agency", "workflows", "autonomous_sales_agent_v32_VISUAL_PREMIUM.json")

def read_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def create_mindhafen_workflow():
    """Create autonomous lead generation workflow for MindHafen"""
    base = read_json(GENERARISE_WORKFLOW)
    
    # Update workflow metadata
    base['name'] = "MindHafen - Autonomous Lead Generation (HTML Premium)"
    base['versionId'] = "mindhafen-autonomous-v1"
    
    # Update CONFIG node
    config_node = next(n for n in base['nodes'] if n['name'] == 'CONFIG')
    config_node['parameters']['values']['string'] = [
        {
            "name": "search_term",
            "value": "Psicólogos"
        },
        {
            "name": "location",
            "value": "Buenos Aires, Argentina"
        },
        {
            "name": "banner_url",
            "value": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop"
        }
    ]
    
    # Update AI Extractor prompt
    ai_node = next(n for n in base['nodes'] if n['name'] == 'IA Extractor PRO')
    ai_node['parameters']['text'] = """=CONTEXTO:
Eres el Equipo de **MindHafen**, plataforma de salud mental digital basada en neurociencia.

NEGOCIO:
Web: {{ $json.text }}
Nombre: {{ $json.title }}
Tel Maps: {{ $json.phone_from_maps }}

TAREA:
1. EXTRAE datos (tel/wa con 549, email)
2. IDENTIFICA si es psicólogo, coach, terapeuta o centro de salud mental
3. GENERA WA TEXTO (Cordial, profesional, máximo 2 líneas).
4. GENERA EMAIL BODY (SOLO EL TEXTO CENTRAL, sin <html> ni <head>, usa <p> y <ul>):
   - Saludo: 'Hola Dr/Dra [Nombre]' o 'Hola equipo de [Nombre]'
   - Párrafo 1: Reconocer su labor en salud mental
   - Párrafo 2: Presentar MindHafen como herramienta digital para pacientes
   - Lista: 3 Beneficios para sus pacientes (ejercicios neurocientíficos, tracking de progreso, etc.)
   - CTA: '¿Te gustaría conocer cómo puede complementar tu práctica?'

JSON:
{
  "phone": "549...",
  "email": "...",
  "score": 8,
  "wa_msg": "Hola [Nombre], somos MindHafen...",
  "email_body": "<p>...</p>"
}"""
    
    # Update Email Designer node with MindHafen template
    designer_node = next(n for n in base['nodes'] if n['name'] == 'Diseñador Email Premium')
    designer_node['parameters']['jsCode'] = f"""const data = $input.item.json;
const title = $('Loop').item.json.title || 'Sin nombre';
const phone_maps = $('Loop').item.json.phone || '';
const banner = $('CONFIG').item.json.banner_url;

// Datos con fallback
const phone = data.phone || phone_maps || '5491112345678';
const email = data.email || 'contacto@ejemplo.com';
const score = data.score || 5;

// --- TEMPLATE HTML MINDHAFEN ---
const email_html_mindhafen = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MindHafen - Salud Mental Digital</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f0f4f8; color: #334e68;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f4f8; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(50, 50, 93, 0.05), 0 5px 15px rgba(0, 0, 0, 0.05);">
                    
                    <!-- Header with Banner -->
                    <tr>
                        <td style="background-image: url('$dollar{{banner}}'); background-size: cover; background-position: center; height: 180px; position: relative;">
                            <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);"></div>
                            <div style="position: absolute; bottom: 20px; left: 30px; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: 0.5px;">
                                Mind<span style="color: #81e6d9;">Hafen</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            $dollar{{data.email_body || `<p>Hola equipo de <strong>$dollar{{title}}</strong>,</p><p>Nos especializamos en herramientas digitales de salud mental basadas en neurociencia.</p>`}}
                            
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="https://mindhafen.generarise.space" style="display: inline-block; background: linear-gradient(135deg, #38b2ac 0%, #319795 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(56, 178, 172, 0.3);">
                                    Conocer MindHafen
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7f9fc; padding: 25px; text-align: center; border-top: 1px solid #eef2f7; font-size: 12px; color: #829ab1;">
                            <p style="margin: 5px 0;"><strong>MindHafen by GenerArise</strong></p>
                            <p style="margin: 0;">Buenos Aires, Argentina • <a href="https://mindhafen.generarise.space" style="color:#38b2ac; text-decoration:none;">mindhafen.generarise.space</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

return {{
  text: title,
  score: score,
  email_address: email,
  phone: phone,
  wa_msg: data.wa_msg || `Hola $dollar{{title}}, somos MindHafen. Ofrecemos herramientas digitales de salud mental para profesionales. ¿Te interesa conocerlas? 🧠`,
  email_html: email_html_mindhafen,
  search_term: $('CONFIG').item.json.search_term,
  location: $('CONFIG').item.json.location,
  raw_ai: JSON.stringify(data)
}};"""
    
    # Save
    output_path = os.path.join(BASE_DIR, "mindhafen", "workflows", "mindhafen_autonomous_lead_gen_v1.json")
    save_json(output_path, base)
    print(f"MindHafen workflow saved: {output_path}")
    return output_path

def create_argenterio_workflow():
    """Create autonomous lead generation workflow for Argenterio"""
    base = read_json(GENERARISE_WORKFLOW)
    
    # Update workflow metadata
    base['name'] = "Argenterio - Autonomous Lead Generation (HTML Premium)"
    base['versionId'] = "argenterio-autonomous-v1"
    
    # Update CONFIG node
    config_node = next(n for n in base['nodes'] if n['name'] == 'CONFIG')
    config_node['parameters']['values']['string'] = [
        {
            "name": "search_term",
            "value": "Contadores"
        },
        {
            "name": "location",
            "value": "Buenos Aires, Argentina"
        },
        {
            "name": "banner_url",
            "value": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop"
        }
    ]
    
    # Update AI Extractor prompt
    ai_node = next(n for n in base['nodes'] if n['name'] == 'IA Extractor PRO')
    ai_node['parameters']['text'] = """=CONTEXTO:
Eres el Equipo de **Argenterio**, sistema de defensa financiera contra la inflación argentina.

NEGOCIO:
Web: {{ $json.text }}
Nombre: {{ $json.title }}
Tel Maps: {{ $json.phone_from_maps }}

TAREA:
1. EXTRAE datos (tel/wa con 549, email)
2. IDENTIFICA si es contador, asesor financiero, o consultor
3. GENERA WA TEXTO (Directo, urgente, tono técnico, máximo 2 líneas).
4. GENERA EMAIL BODY (SOLO EL TEXTO CENTRAL, sin <html> ni <head>, usa <p> y <ul>):
   - Saludo: 'Hola [Nombre]' o 'Hola equipo de [Nombre]'
   - Párrafo 1: Reconocer el desafío de proteger el patrimonio de clientes en contexto argentino
   - Párrafo 2: Presentar Argenterio como herramienta de diagnóstico financiero con IA
   - Lista: 3 Beneficios clave (diagnóstico automatizado, recomendaciones anti-inflación, reportes profesionales)
   - CTA: '¿Querés ver cómo puede potenciar tu consultora?'

JSON:
{
  "phone": "549...",
  "email": "...",
  "score": 8,
  "wa_msg": "Hola [Nombre], Argenterio...",
  "email_body": "<p>...</p>"
}"""
    
    # Update Email Designer node with Argenterio template
    designer_node = next(n for n in base['nodes'] if n['name'] == 'Diseñador Email Premium')
    designer_node['parameters']['jsCode'] = f"""const data = $input.item.json;
const title = $('Loop').item.json.title || 'Sin nombre';
const phone_maps = $('Loop').item.json.phone || '';
const banner = $('CONFIG').item.json.banner_url;

// Datos con fallback
const phone = data.phone || phone_maps || '5491112345678';
const email = data.email || 'contacto@ejemplo.com';
const score = data.score || 5;

// --- TEMPLATE HTML ARGENTERIO ---
const email_html_argenterio = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Argenterio - Defensa Financiera</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; padding: 40px 10px; background-image: radial-gradient(#1a1a1a 1px, transparent 1px); background-size: 20px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #0a0a0a; border: 1px solid #222; max-width: 600px; width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 0 40px rgba(0, 255, 65, 0.05);">
                    
                    <!-- Header with Banner -->
                    <tr>
                        <td style="background-image: url('$dollar{{banner}}'); background-size: cover; background-position: center; height: 160px; position: relative;">
                            <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%);"></div>
                            <div style="position: absolute; bottom: 20px; left: 30px; color: #ffffff; font-size: 26px; font-weight: 800; text-shadow: 0 2px 6px rgba(0,0,0,0.5); letter-spacing: 1.5px;">
                                ARGENTERIO<span style="color:#00ff41;">_</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px; color: #e0e0e0; line-height: 1.6; font-size: 16px;">
                            $dollar{{data.email_body || `<p>Hola equipo de <strong>$dollar{{title}}</strong>,</p><p>Argenterio es un sistema de diagnóstico financiero automatizado para proteger patrimonios contra la inflación.</p>`}}
                            
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="https://argenterio.generarise.space" style="display: inline-block; background: linear-gradient(90deg, #00C853 0%, #00ff41 100%); color: #000000; text-decoration: none; padding: 16px 40px; font-weight: 800; font-size: 16px; border-radius: 4px; box-shadow: 0 0 20px rgba(0, 255, 65, 0.4); text-transform: uppercase; letter-spacing: 1px;">
                                    [ VER DEMO ]
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #080808; padding: 25px; text-align: center; border-top: 1px solid #222; font-size: 11px; color: #444;">
                            <p style="margin: 5px 0; color: #888;"><strong>ARGENTERIO FINANCIAL DEFENSE AI</strong></p>
                            <p style="margin: 0;">© 2026 NEUROVA • <a href="https://argenterio.generarise.space" style="color:#00ff41; text-decoration:none;">argenterio.generarise.space</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

return {{
  text: title,
  score: score,
  email_address: email,
  phone: phone,
  wa_msg: data.wa_msg || `Hola $dollar{{title}}, Argenterio: Diagnóstico financiero automatizado anti-inflación. ¿Querés verlo en acción? 📊`,
  email_html: email_html_argenterio,
  search_term: $('CONFIG').item.json.search_term,
  location: $('CONFIG').item.json.location,
  raw_ai: JSON.stringify(data)
}};"""
    
    # Save
    output_path = os.path.join(BASE_DIR, "argenterio", "argenterio_autonomous_lead_gen_v1.json")
    save_json(output_path, base)
    print(f"Argenterio workflow saved: {output_path}")
    return output_path

if __name__ == "__main__":
    print("Creando workflows autonomos...")
    print()
    
    mindhafen_path = create_mindhafen_workflow()
    argenterio_path = create_argenterio_workflow()
    
    print()
    print("WORKFLOWS CREADOS:")
    print(f"  - MindHafen: {mindhafen_path}")
    print(f"  - Argenterio: {argenterio_path}")
