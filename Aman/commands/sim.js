const axios = require("axios");

module.exports.config = {
  name: "flash",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Aman Khan",
  description: "Google Gemini Flash 2.0 AI (No Prefix)",
  commandCategory: "ai",
  usages: "flash [question]",
  cooldowns: 5
};

// Author AK https://www.facebook.com/AK47xk
module.exports.handleEvent = async function ({ api, event }) {
  try {
    const body = event.body ? event.body.trim() : "";
    if (!body) return;

    if (body.toLowerCase().startsWith("flash")) {
      let question = body.slice(5).trim(); // "flash" ke baad ka text
      if (!question || question.length === 0) {
        question = "koi joke ya shayari sunao";
      }

      // Pehle AI ko instruction bhejo, fir user ka actual message
      const payload = {
        contents: [
          {
            parts: [
              {
                text: "Tum ek friendly AI ho jo hamesha funny, thoda shayari aur emojis ke sath reply karega. Language mix Hindi-English (Roman Hindi) me hogi. Answer hamesha short aur engaging ho."
              },
              {
                text: question
              }
            ]
          }
        ]
      };

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": "AIzaSyD-I6TGcWoFUafug_w3zF8NIokfgUVIHgg"
          }
        }
      );

      let answer = "❌ Flash se koi reply nahi mila.";
      if (response.data?.candidates?.[0]?.content?.parts) {
        answer = response.data.candidates[0].content.parts
          .map(p => p.text || "")
          .join("\n");
      }

      return api.sendMessage(
        `⚡ Flash 2.0:\n\n${answer}\n\n— Owner: AK 🤖`,
        event.threadID,
        event.messageID
      );
    }
  } catch (error) {
    console.error("Flash error:", error.response?.data || error.message);
    api.sendMessage("❌ Flash error!", event.threadID, event.messageID);
  }
};

// normal run ko empty rakho, taaki prefix wale se na chale
module.exports.run = () => {};
