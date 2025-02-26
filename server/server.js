import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAlqxKeY79HaO0mohqtyJZ3C4p_9lr-mjQ"; // Store API key in .env

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello from NoCode!' });
});

app.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;

        // Correct payload structure
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        res.status(200).send({ bot: response.data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send({ error: error.response ? error.response.data : error.message });
    }
});

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
