const express = require("express");
const router = express.Router();
const { pool } = require("../db/mysql");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [[chatCount]] = await pool.execute(
      "SELECT COUNT(*) AS totalChats FROM messages WHERE user_id = ? AND sender = 'user'",
      [userId]
    );

    const [[appointmentCount]] = await pool.execute(
      "SELECT COUNT(*) AS totalAppointments FROM appointments WHERE user_id = ?",
      [userId]
    );

    const [[medicationCount]] = await pool.execute(
      "SELECT COUNT(*) AS totalMedications FROM medications WHERE user_id = ?",
      [userId]
    );

    const [topSymptoms] = await pool.execute(
      "SELECT symptom_name, COUNT(*) AS total FROM symptom_logs WHERE user_id = ? GROUP BY symptom_name ORDER BY total DESC LIMIT 5",
      [userId]
    );

    res.json({
      totalChats: chatCount.totalChats,
      totalAppointments: appointmentCount.totalAppointments,
      totalMedications: medicationCount.totalMedications,
      topSymptoms
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

module.exports = router;
