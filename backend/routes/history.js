const express = require("express");
const router = express.Router();
const { pool } = require("../db/mysql");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [symptoms] = await pool.execute(
      "SELECT symptom_name, COUNT(*) AS count FROM symptom_logs WHERE user_id = ? GROUP BY symptom_name ORDER BY count DESC",
      [userId]
    );

    const [messages] = await pool.execute(
      "SELECT sender, message_text, created_at FROM messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      [userId]
    );

    res.json({ symptoms, recentMessages: messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patient history" });
  }
});

module.exports = router;
