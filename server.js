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
    <title>NYT Fetcher</title>
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
            margin-right: 10px;
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

    <h1>NYT Puzzle Fetcher</h1>

    <button onclick="getWordle()">Wordle</button>
    <button onclick="getConnections()">Connections</button>

    <pre id="output">Waiting...</pre>

    <script>

        async function show(res) {
            const output = document.getElementById("output");
            output.textContent = "Loading...";

            try {
                const data = await res;
                output.textContent = JSON.stringify(data, null, 2);
            } catch (err) {
                output.textContent = err.toString();
            }
        }

        function getWordle() {
            show(fetch("/answer").then(r => r.json()));
        }

        function getConnections() {
            show(fetch("/connections").then(r => r.json()));
        }

    </script>

</body>
</html>
    `);
});

// ---------------- WORDLE ----------------
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

// ---------------- CONNECTIONS (NEW) ----------------
app.get("/connections", async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const url = `https://www.nytimes.com/svc/connections/v2/${today}.json`;

        const response = await fetch(url);
        const data = await response.json();

        res.json({
            success: true,
            categories: data.categories,
            full: data
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.toString()
        });
    }
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
