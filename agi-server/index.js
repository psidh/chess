require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());

app.post("/getMove", async (req, res) => {
  const { moves } = req.body;
  const apiKey = process.env.API_KEY;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

  const prompt = `Tell me your best next move after ${moves}, give it in the format of json
   {
  from  : --,
  to : --
  }`;

  try {
    const result = await model.generateContent(prompt);
    return res.json({ agiMove: result });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send("Error generating hints");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:3003/`);
});
