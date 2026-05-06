require("dotenv").config();
const readline = require("readline");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyAzVJJ0ixZiKqlFstnq8NrdjNzCmK-jeuM");

// Create CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask question
async function askQuestion(question) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const result = await model.generateContent(question);
    const response = result.response.text();

    console.log("\n🤖 Answer:\n", response);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Loop function (continuous chat)
function startChat() {
  rl.question("\n💬 Ask something (type 'exit' to quit): ", async (input) => {
    if (input.toLowerCase() === "exit") {
      console.log("👋 Goodbye!");
      rl.close();
      return;
    }

    await askQuestion(input);
    startChat(); // loop again
  });
}

// Start app
console.log("🚀 Gemini CLI Chat Started");
startChat();