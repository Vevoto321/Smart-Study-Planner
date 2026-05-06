const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkModels() {
  const modelsToTest = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  
  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`✅ ${modelName} works! Response: ${result.response.text().trim()}`);
    } catch (e) {
      console.log(`❌ ${modelName} failed: ${e.message}`);
    }
  }
}

checkModels();
