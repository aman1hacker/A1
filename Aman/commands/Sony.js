const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "1.0.0",
  hasPermssion: 1, // ✅ Only admin use
  credits: "Aman",
  description: "Gemini chatbot with baby trigger",
  commandCategory: "no prefix",
  usages: "no prefix",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID, messageReply } = event;

  if (!body || senderID == api.getCurrentUserID()) return;

  const lowerBody = body.toLowerCase();

  // ✅ Trigger word check
  const hasTriggerWord = lowerBody.includes("baby");
  const isReplyToBot = messageReply && messageReply.senderID == api.getCurrentUserID();

  if (hasTriggerWord || isReplyToBot) {
    try {
      // Reaction ❤️
      api.setMessageReaction("❤️", messageID, (err) => {}, true);

      let finalMessage = body;

      // If replying to bot's message, include context
      if (isReplyToBot && messageReply) {
        const repliedMessage = messageReply.body || "";
        finalMessage = `Previous: ${repliedMessage} | Reply: ${body}`;
      }

      // API call
      const res = await axios.post("https://sexy-lhxg.onrender.com/gemini", {
        message: finalMessage
      });

      if (!res.data || !res.data.reply) {
        return api.sendMessage("⚠️ Baby reply nahi kar paya.", threadID, messageID);
      }

      // ✅ Direct reply without owner/user
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
