import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import supabase from '../src/sales/supabase-client.js';
import { handleWhatsAppWebhook } from '../src/sales/whatsapp-webhook.js';

// Since processInboundMessage isn't exported directly (it's internal to the webhook module),
// we can simulate an inbound webhook payload from Meta Cloud API or Chatwoot to trigger it!
// Let's simulate a Meta Cloud API incoming message payload.

async function test() {
  console.log("Starting End-to-End Inbound Flow Test...");

  const testPhone = "5491123906673"; // Real or mock Argentine number
  const testMessage = "Hola Alex! Sí, contame un poco más de esa idea de tráfico orgánico para automatizar reservas.";

  try {
    // 1. Ensure test lead exists in Supabase
    console.log("Preparing test lead in database...");
    const { data: lead } = await supabase.upsertLead({
      name: "Gustavo Test",
      phone: testPhone,
      company: "Test Boutique Hotel",
      industry: "hotel",
      city: "Buenos Aires",
      country: "Argentina",
      ai_score: 85,
      pipeline_stage: "discovered",
      outreach_status: "contacted",
      main_pain: "pierden clientes por demoras en respuestas fuera de hora"
    });

    console.log("Lead created/retrieved:", lead.name, "(ID:", lead.id, ")");

    // 2. Simulate the incoming Meta Cloud API webhook payload
    const mockWebhookBody = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "WABA_ID",
          changes: [
            {
              field: "messages",
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "123456789",
                  phone_number_id: "PHONE_ID"
                },
                contacts: [
                  {
                    profile: {
                      name: "Gustavo Test"
                    },
                    wa_id: testPhone
                  }
                ],
                messages: [
                  {
                    from: testPhone,
                    id: "wamid.HBgNNTQ5MTEyMzkwNjY3MxUCGQYSFDMwNzJCMDMwRDJCMDMwRDJDMwA=",
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: {
                      body: testMessage
                    },
                    type: "text"
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    console.log("\n--- SIMULATING WEBHOOK INBOUND MESSAGE ---");
    console.log("From:", testPhone);
    console.log("Message:", testMessage);
    console.log("------------------------------------------\n");

    // Express-like mock request and response objects
    const req = { body: mockWebhookBody };
    const res = {
      status: (code) => {
        return {
          send: (msg) => {
            console.log(`Webhook responded with status ${code}: ${msg}`);
          }
        };
      }
    };

    await handleWhatsAppWebhook(req, res);
    
    console.log("\nFlow execution finished. Check the log outputs above for detailed steps.");
  } catch (error) {
    console.error("Test execution failed:", error);
  }
}

test();
