import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // or relative path depending on where it's run
import outreachEngine from '../src/sales/outreach-engine.js';

async function test() {
  console.log("Starting AI outreach draft test...");
  
  const fakeLead = {
    name: "Gustavo Meyer",
    company: "Hotel Soler",
    industry: "hotel",
    city: "Buenos Aires",
    country: "Argentina",
    main_pain: "no atienden consultas después de hora"
  };

  try {
    console.log("Generating B2B cold outreach message draft for:", fakeLead.name);
    const draft = await outreachEngine.generateAIOutreach(fakeLead, 'outreach_industrial');
    console.log("\n--- GENERATED DRAFT ---");
    console.log(draft);
    console.log("-----------------------\n");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
