require('dotenv').config();
const fetch = require('node-fetch');

async function checkModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await globalThis.fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        
        const models = data.models || [];
        const names = models.map(m => m.name);
        console.log("All Model Names:", names);
        
        console.log("Includes gemini-1.5-flash?", names.includes("models/gemini-1.5-flash"));
        console.log("Includes gemini-pro?", names.includes("models/gemini-pro"));
    } catch(e) {
        console.log(e);
    }
}
checkModels();
