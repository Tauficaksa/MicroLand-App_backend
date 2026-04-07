const { GoogleGenerativeAI } = require("@google/generative-ai");

async function getBotReply(message) {
  const text = (message || "").toLowerCase();

  if (text.includes("fever") && text.includes("headache")) {
    return "You mentioned fever and headache. Drink fluids, get rest, and monitor symptoms. If symptoms worsen or persist, consult a doctor.";
  }
  if (text.includes("fever")) {
    return "You mentioned fever. Stay hydrated, take rest, and keep checking temperature.";
  }
  if (text.includes("headache")) {
    return "For headache, try hydration and rest. If severe or recurring, seek medical advice.";
  }
  if (text.includes("cough")) {
    return "For cough, stay hydrated and monitor severity. If breathing becomes difficult, seek immediate care.";
  }
  if (text.includes("appointment")) {
    return "I can help with appointment booking. Please select a doctor and time slot in the appointment screen.";
  }
  if (text.includes("medicine") || text.includes("medication")) {
    return "You can manage medicine reminders in the Medications section.";
  }

  // Try using Gemini for generalized questions
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are a helpful healthcare assistant chatbot. Answer the user's healthcare-related question concisely. If the question is not healthcare related, briefly answer it anyway but remind them of your main purpose.\nUser question: ${message}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.error("Gemini API error:", e);
      return "I'm having trouble connecting to my AI brain. Please try again later.";
    }
  }

  return "Please tell me more about your symptoms, such as fever, headache, cough, body pain, or appointment needs.";
}

function extractSymptoms(message) {
  const map = ["fever", "headache", "cough", "cold", "body pain", "fatigue", "vomiting"];
  const text = (message || "").toLowerCase();
  return map.filter(item => text.includes(item));
}

module.exports = { getBotReply, extractSymptoms };
