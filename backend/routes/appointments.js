const express = require("express");
const router = express.Router();
const { pool } = require("../db/mysql");

router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_date ASC",
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      userId = 1,
      doctorName,
      specialty,
      appointmentDate,
      notes = ""
    } = req.body;

    await pool.execute(
      "INSERT INTO appointments (user_id, doctor_name, specialty, appointment_date, notes) VALUES (?, ?, ?, ?, ?)",
      [userId, doctorName, specialty, appointmentDate, notes]
    );

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

module.exports = router;
