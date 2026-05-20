import json
import os

BASE_DIR = r"c:\Users\Gustavo\Downloads\neurova"
GENERARISE_V32 = os.path.join(BASE_DIR, "agency", "workflows", "autonomous_sales_agent_v32_VISUAL_PREMIUM.json")

def create_generarise_autonomous():
    """Create clean autonomous workflow for GenerArise following MindHafen/Argenterio pattern"""
    base = json.loads(open(GENERARISE_V32, 'r', encoding='utf-8').read())
    
    # Update metadata
    base['name'] = "GenerArise - Autonomous Lead Generation (FIXED HTML)"
    base['versionId'] = "generarise-autonomous-v33-fixed"
    
    # Find and update Designer node
    designer_node = next(n for n in base['nodes'] if n['name'] == 'Diseñador Email Premium')
    
    # Replace with string concatenation instead of template literals
    designer_node['parameters']['jsCode'] = """const data = $input.item.json;
const title = $('Loop').item.json.title || 'Sin nombre';
const phone_maps = $('Loop').item.json.phone || '';
const banner = $('CONFIG').item.json.banner_url;

// Datos con fallback
const phone = data.phone || phone_maps || '5491112345678';
const email = data.email || 'test@ejemplo.com';
const score = data.score || 5;

// Contenido del email (viene de IA o fallback)
const emailBody = data.email_body || '<p>Hola equipo de <strong>' + title + '</strong>,</p><p>Detectamos una oportunidad para automatizar sus procesos con IA.</p>';

// Template HTML GenerArise (sin nested template literals)
const email_html_generarise = '<!DOCTYPE html>' +
'<html lang="es">' +
'<head>' +
'    <meta charset="UTF-8">' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'    <title>GenerArise AI - Automatización Inteligente</title>' +
'</head>' +
'<body style="margin: 0; padding: 0; font-family: \\'Segoe UI\\', Arial, sans-serif; background-color: #f4f4f7; color: #333;">' +
'    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f7; padding: 40px 20px;">' +
'        <tr>' +
'            <td align="center">' +
'                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">' +
'                    <tr>' +
'                        <td style="background-image: url(\\'' + banner + '\\'); background-size: cover; background-position: center; height: 180px; position: relative;">' +
'                            <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);"></div>' +
'                            <div style="position: absolute; bottom: 20px; left: 30px; color: #ffffff; font-size: 24px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;">' +
'                                GENERARISE' +
'                            </div>' +
'                        </td>' +
'                    </tr>' +
'                    <tr>' +
'                        <td style="padding: 40px 30px; color: #444; line-height: 1.6; font-size: 16px;">' +
                            emailBody +
'                            <div style="text-align: center; margin-top: 30px;">' +
'                                <a href="https://generarise.space" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px;">' +
'                                    VER DEMOSTRACION' +
'                                </a>' +
'                            </div>' +
'                        </td>' +
'                    </tr>' +
'                    <tr>' +
'                        <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #888;">' +
'                            <p style="margin-bottom: 5px;"><strong>GenerArise AI Solutions</strong></p>' +
'                            <p style="margin: 0;">Buenos Aires, Argentina • <a href="https://generarise.space" style="color:#2563eb; text-decoration:none;">generarise.space</a></p>' +
'                        </td>' +
'                    </tr>' +
'                </table>' +
'            </td>' +
'        </tr>' +
'    </table>' +
'</body>' +
'</html>';

return {
  text: title,
  score: score,
  email_address: email,
  phone: phone,
  wa_msg: data.wa_msg || 'Hola equipo de ' + title + ', somos GenerArise. Automatizamos procesos con IA para escalar negocios. ¿Les interesa una demo?',
  email_html: email_html_generarise,
  search_term: $('CONFIG').item.json.search_term,
  location: $('CONFIG').item.json.location,
  raw_ai: JSON.stringify(data)
};"""
    
    # Save
    output_path = os.path.join(BASE_DIR, "agency", "workflows", "generarise_autonomous_v33_fixed.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(base, f, indent=4, ensure_ascii=False)
    
    print(f"GenerArise workflow corregido: {output_path}")
    return output_path

if __name__ == "__main__":
    print("Creando workflow GenerArise corregido...")
    create_generarise_autonomous()
    print("\nListo!")
