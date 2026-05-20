import json
import os

BASE_DIR = r"c:\Users\Gustavo\Downloads\neurova"

def fix_mindhafen():
    path = os.path.join(BASE_DIR, "mindhafen", "workflows", "mindhafen_autonomous_lead_gen_v1.json")
    workflow = json.loads(open(path, 'r', encoding='utf-8').read())
    
    designer_node = next(n for n in workflow['nodes'] if n['name'] == 'Diseñador Email Premium')
    
    # Fixed JavaScript code without nested template literals
    designer_node['parameters']['jsCode'] = """const data = $input.item.json;
const title = $('Loop').item.json.title || 'Sin nombre';
const phone_maps = $('Loop').item.json.phone || '';
const banner = $('CONFIG').item.json.banner_url;

// Datos con fallback
const phone = data.phone || phone_maps || '5491112345678';
const email = data.email || 'contacto@ejemplo.com';
const score = data.score || 5;

// Contenido del email (viene de IA o fallback)
const emailBody = data.email_body || '<p>Hola <strong>' + title + '</strong>,</p><p>Nos especializamos en herramientas digitales de salud mental basadas en neurociencia.</p>';

// Template HTML (sin nested template literals)
const email_html_mindhafen = '<!DOCTYPE html>' +
'<html lang="es">' +
'<head>' +
'    <meta charset="UTF-8">' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'    <title>MindHafen - Salud Mental Digital</title>' +
'</head>' +
'<body style="margin: 0; padding: 0; font-family: \\'Helvetica Neue\\', Helvetica, Arial, sans-serif; background-color: #f0f4f8; color: #334e68;">' +
'    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f4f8; padding: 40px 20px;">' +
'        <tr>' +
'            <td align="center">' +
'                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(50, 50, 93, 0.05), 0 5px 15px rgba(0, 0, 0, 0.05);">' +
'                    <tr>' +
'                        <td style="background-image: url(\\'' + banner + '\\'); background-size: cover; background-position: center; height: 180px; position: relative;">' +
'                            <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);"></div>' +
'                            <div style="position: absolute; bottom: 20px; left: 30px; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: 0.5px;">' +
'                                Mind<span style="color: #81e6d9;">Hafen</span>' +
'                            </div>' +
'                        </td>' +
'                    </tr>' +
'                    <tr>' +
'                        <td style="padding: 40px 30px;">' +
                            emailBody +
'                            <div style="text-align: center; margin-top: 30px;">' +
'                                <a href="https://mindhafen.generarise.space" style="display: inline-block; background: linear-gradient(135deg, #38b2ac 0%, #319795 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(56, 178, 172, 0.3);">' +
'                                    Conocer MindHafen' +
'                                </a>' +
'                            </div>' +
'                        </td>' +
'                    </tr>' +
'                    <tr>' +
'                        <td style="background-color: #f7f9fc; padding: 25px; text-align: center; border-top: 1px solid #eef2f7; font-size: 12px; color: #829ab1;">' +
'                            <p style="margin: 5px 0;"><strong>MindHafen by GenerArise</strong></p>' +
'                            <p style="margin: 0;">Buenos Aires, Argentina • <a href="https://mindhafen.generarise.space" style="color:#38b2ac; text-decoration:none;">mindhafen.generarise.space</a></p>' +
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
  wa_msg: data.wa_msg || 'Hola ' + title + ', somos MindHafen. Ofrecemos herramientas digitales de salud mental para profesionales. ¿Te interesa conocerlas?',
  email_html: email_html_mindhafen,
  search_term: $('CONFIG').item.json.search_term,
  location: $('CONFIG').item.json.location,
  raw_ai: JSON.stringify(data)
};"""
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(workflow, f, indent=4, ensure_ascii=False)
    
    print(f"MindHafen corregido: {path}")

def fix_argenterio():
    path = os.path.join(BASE_DIR, "argenterio", "argenterio_autonomous_lead_gen_v1.json")
    workflow = json.loads(open(path, 'r', encoding='utf-8').read())
    
    designer_node = next(n for n in workflow['nodes'] if n['name'] == 'Diseñador Email Premium')
    
    # Fixed JavaScript code without nested template literals
    designer_node['parameters']['jsCode'] = """const data = $input.item.json;
const title = $('Loop').item.json.title || 'Sin nombre';
const phone_maps = $('Loop').item.json.phone || '';
const banner = $('CONFIG').item.json.banner_url;

// Datos con fallback
const phone = data.phone || phone_maps || '5491112345678';
const email = data.email || 'contacto@ejemplo.com';
const score = data.score || 5;

// Contenido del email (viene de IA o fallback)
const emailBody = data.email_body || '<p>Hola <strong>' + title + '</strong>,</p><p>Argenterio es un sistema de diagnóstico financiero automatizado para proteger patrimonios contra la inflación.</p>';

// Template HTML (sin nested template literals)
const email_html_argenterio = '<!DOCTYPE html>' +
'<html lang="es">' +
'<head>' +
'    <meta charset="UTF-8">' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'    <title>Argenterio - Defensa Financiera</title>' +
'</head>' +
'<body style="margin: 0; padding: 0; background-color: #050505; font-family: \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">' +
'    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; padding: 40px 10px; background-image: radial-gradient(#1a1a1a 1px, transparent 1px); background-size: 20px 20px;">' +
'        <tr>' +
'            <td align="center">' +
'                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #0a0a0a; border: 1px solid #222; max-width: 600px; width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 0 40px rgba(0, 255, 65, 0.05);">' +
'                    <tr>' +
'                        <td style="background-image: url(\\'' + banner + '\\'); background-size: cover; background-position: center; height: 160px; position: relative;">' +
'                            <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%);"></div>' +
'                            <div style="position: absolute; bottom: 20px; left: 30px; color: #ffffff; font-size: 26px; font-weight: 800; text-shadow: 0 2px 6px rgba(0,0,0,0.5); letter-spacing: 1.5px;">' +
'                                ARGENTERIO<span style="color:#00ff41;">_</span>' +
'                            </div>' +
'                        </td>' +
'                    </tr>' +
'                    <tr>' +
'                        <td style="padding: 40px 30px; color: #e0e0e0; line-height: 1.6; font-size: 16px;">' +
                            emailBody +
'                            <div style="text-align: center; margin-top: 30px;">' +
'                                <a href="https://argenterio.com" style="display: inline-block; background: linear-gradient(90deg, #00C853 0%, #00ff41 100%); color: #000000; text-decoration: none; padding: 16px 40px; font-weight: 800; font-size: 16px; border-radius: 4px; box-shadow: 0 0 20px rgba(0, 255, 65, 0.4); text-transform: uppercase; letter-spacing: 1px;">' +
'                                    [ VER DEMO ]' +
'                                </a>' +
'                            </div>' +
'                        </td>' +
'                    </tr>' +
'                    <tr>' +
'                        <td style="background-color: #080808; padding: 25px; text-align: center; border-top: 1px solid #222; font-size: 11px; color: #444;">' +
'                            <p style="margin: 5px 0; color: #888;"><strong>ARGENTERIO FINANCIAL DEFENSE AI</strong></p>' +
'                            <p style="margin: 0;">© 2026 NEUROVA • <a href="https://argenterio.com" style="color:#00ff41; text-decoration:none;">argenterio.com</a></p>' +
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
  wa_msg: data.wa_msg || 'Hola ' + title + ', Argenterio: Diagnóstico financiero automatizado anti-inflación. ¿Querés verlo en acción?',
  email_html: email_html_argenterio,
  search_term: $('CONFIG').item.json.search_term,
  location: $('CONFIG').item.json.location,
  raw_ai: JSON.stringify(data)
};"""
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(workflow, f, indent=4, ensure_ascii=False)
    
    print(f"Argenterio corregido: {path}")

if __name__ == "__main__":
    print("Corrigiendo syntax error en workflows...")
    fix_mindhafen()
    fix_argenterio()
    print("\nListo! Reimporta los workflows en n8n.")
