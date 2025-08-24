const axios = require("axios");

let roleMemory = {}; // ✅ Role memory per threadID

module.exports.config = {
  name: "baby",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "Aman",
  description: "Gemini chatbot with baby trigger and roleplay",
  commandCategory: "no prefix",
  usages: "no prefix",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID, messageReply } = event;

  if (!body || senderID == api.getCurrentUserID()) return;
  const lowerBody = body.toLowerCase();

  // ✅ Only Owner ID
  const OWNER_ID = "100088677459075";

  // ✅ Role set/change/delete (Only Owner use kar sakta hai)
  if (lowerBody.startsWith("role ")) {
    if (senderID !== OWNER_ID) {
      return api.sendMessage("❌ Ye command sirf owner ke liye hai.", threadID, messageID);
    }

    const roleText = body.slice(5).trim();

    if (roleText.toLowerCase() === "delete") {
      delete roleMemory[threadID];
      return api.sendMessage("✅ Role delete kar diya gaya.", threadID, messageID);
    } else {
      roleMemory[threadID] = roleText;
      return api.sendMessage(`✅ Role set ho gaya: ${roleText}`, threadID, messageID);
    }
  }

  // ✅ Trigger word check
  const hasTriggerWord = lowerBody.includes("baby");
  const isReplyToBot = messageReply && messageReply.senderID == api.getCurrentUserID();

  if (hasTriggerWord || isReplyToBot) {
    try {
      api.setMessageReaction("❤️", messageID, (err) => {}, true);

      let finalMessage = body;

      if (isReplyToBot && messageReply) {
        const repliedMessage = messageReply.body || "";
        finalMessage = `Previous: ${repliedMessage} | Reply: ${body}`;
      }

      // ✅ Role memory include
      if (roleMemory[threadID]) {
        finalMessage = `Role: ${roleMemory[threadID]} | User: ${finalMessage}`;
      }

      // API call
      const res = await axios.post("https://sexy-lhxg.onrender.com/gemini", {
        message: finalMessage
      });

      if (!res.data || !res.data.reply) {
        return api.sendMessage("⚠️ Baby reply nahi kar paya.", threadID, messageID);
      }

      return api.sendMessage(res.data.reply, threadID, messageID);

    } catch (error) {
      console.error("Gemini API error:", error.message);
      return api.sendMessage("⚠️ Baby abhi thoda busy hai.", threadID, messageID);
    }
  }
};

module.exports.run = async function () {
  return;
};
