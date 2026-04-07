const express = require("express");
const router = express.Router();
const { pool } = require("../db/mysql");

router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM medications WHERE user_id = ? ORDER BY created_at DESC",
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medications" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId = 1, medicineName, dosage, reminderTime, frequency } = req.body;

    await pool.execute(
      "INSERT INTO medications (user_id, medicine_name, dosage, reminder_time, frequency) VALUES (?, ?, ?, ?, ?)",
      [userId, medicineName, dosage, reminderTime, frequency]
    );

    res.json({ success: true, message: "Medication reminder added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add medication" });
  }
});

module.exports = router;
