const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const HighscoreService = require("./HighscoreService");

const app = express();

const PORT = 3000;

const highscoreService = new HighscoreService("highscores.json");

app.use(express.static(path.join(__dirname, "./static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/scores", async (request, response) => {
    response.status(204).end();
});

app.get("/api/scores", async (request, response) => {
    response.send(await highscoreService.getData());
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));