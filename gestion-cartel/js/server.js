import express from "express";
import cors from "cors";
import { sendMail } from "./serverMail.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/send-mail", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await sendMail(to, subject, text);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`[SERVER] API Mail escuchando en puerto ${PORT}`);
});
