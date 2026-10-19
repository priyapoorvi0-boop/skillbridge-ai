
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("SkillBridge AI backend is running!");
});

app.post("/api/career-match", (req, res) => {
    const { skills } = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({
            message: "Please provide at least one skill."
        });
    }

    const skillText = skills.join(" ").toLowerCase();
    const careers = [];

    if (skillText.includes("html") || skillText.includes("css") ||
        skillText.includes("javascript")) {
        careers.push("Frontend Developer Intern");
    }

    if (skillText.includes("testing") || skillText.includes("debugging")) {
        careers.push("Software Testing Intern");
    }

    if (skillText.includes("python") || skillText.includes("excel") ||
        skillText.includes("sql")) {
        careers.push("Junior Data Analyst Intern");
    }

    if (skillText.includes("embedded") || skillText.includes("electronics") ||
        skillText.includes("circuit") || skillText.includes("c++")) {
        careers.push("Embedded Systems Intern");
    }

    res.json({ careers });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
