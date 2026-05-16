const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyCUuLfxuwA19ILtBjuWTZFUlPe1y7tA0JA');

async function testGemini() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent("Hello!");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.log("Error:", e.message);
    }
}
testGemini();
