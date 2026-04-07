const express = require("express");
const router = express.Router();
const { pool } = require("../db/mysql");
const { getBotReply, extractSymptoms } = require("../services/chatbot");

router.post("/", async (req, res) => {
  try {
    const { userId = 1, message = "" } = req.body;
    const reply = await getBotReply(message);
    const symptoms = extractSymptoms(message);

    await pool.execute(
      "INSERT INTO messages (user_id, sender, message_text) VALUES (?, ?, ?), (?, ?, ?)",
      [userId, "user", message, userId, "bot", reply]
    );

    for (const symptom of symptoms) {
      await pool.execute(
        "INSERT INTO symptom_logs (user_id, symptom_name) VALUES (?, ?)",
        [userId, symptom]
      );
    }

    res.json({ success: true, reply, symptomsLogged: symptoms });
  } catch (error) {
    console.error("chat error:", error.message);
    res.status(500).json({ success: false, error: "Failed to process chat" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.execute(
      "SELECT id, sender, message_text, created_at FROM messages WHERE user_id = ? ORDER BY id ASC",
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

module.exports = router;
