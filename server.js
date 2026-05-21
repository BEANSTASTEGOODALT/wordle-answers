// server.js
// Simple CORS proxy + tiny GUI for Render

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow frontend requests
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

// Tiny GUI
app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Wordle Fetcher</title>
    <style>
        body {
            font-family: Arial;
            background: #111;
            color: white;
            padding: 20px;
        }

        button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }

        pre {
            background: #222;
            padding: 15px;
            border-radius: 10px;
            overflow-x: auto;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>NYT Wordle Fetcher</h1>

    <button onclick="getAnswer()">Fetch Answer</button>

    <pre id="output">Waiting...</pre>

    <script>
        async function getAnswer() {
            const output = document.getElementById("output");

            output.textContent = "Loading...";

            try {
                const res = await fetch("/answer");
                const data = await res.json();

                output.textContent = JSON.stringify(data, null, 2);
            } catch (err) {
                output.textContent = err.toString();
            }
        }
    </script>
</body>
</html>
    `);
});

// Proxy endpoint
app.get("/answer", async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const url = `https://www.nytimes.com/svc/wordle/v2/${today}.json`;

        const response = await fetch(url);

        const data = await response.json();

        res.json({
            success: true,
            answer: data.solution,
            full: data
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.toString()
        });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
