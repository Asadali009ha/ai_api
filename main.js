const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8089;
const API_KEY = process.env.GEMINI_API_KEY;

app.get('/ai/text=:text', async (req, res) => {
    const userText = req.params.text;

    if (!userText) {
        return res.json({
            status: "error",
            result: "",
            question: "No text provided"
        });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: userText }],
                        role: "user"
                    }
                ]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        res.json({
            status: "success",
            result: resultText,
            question: userText
        });

    } catch (error) {
        res.json({
            status: "error",
            result: error.response?.data?.error?.message || error.message,
            question: userText
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
