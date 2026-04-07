const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { testConnection } = require("./db/mysql");
const chatRoutes = require("./routes/chat");
const appointmentRoutes = require("./routes/appointments");
const medicationRoutes = require("./routes/medications");
const historyRoutes = require("./routes/history");
const insightsRoutes = require("./routes/insights");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Healthcare chatbot backend running" });
});

app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/insights", insightsRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  await testConnection();
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}
start();
