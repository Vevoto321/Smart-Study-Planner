const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyAzVJJ0ixZiKqlFstnq8NrdjNzCmK-jeuM');

async function listModels() {
  try {
    console.log('Listing available models...');
    const models = await genAI.listModels();
    console.log('Available models:');
    models.forEach(model => {
      console.log(`- ${model.name} (displayName: ${model.displayName})`);
    });
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
