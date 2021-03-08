const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const HighscoreService = require("./HighscoreService");

const app = express();

const PORT = 3000;

const highscoreService = new HighscoreService("highscores.json");

app.use(helmet());
app.use(express.static(path.join(__dirname, "./static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/scores", async (request, response) => {
    const highscores = await highscoreService.getData();
    const score = request.body.score;

    if (highscores.length < 5) {
        return response.status(200).end();
    }

    for (let i = 0; i < highscores.length; i++) {
        if (score > parseInt(highscores[i].score)) {
            return response.status(200).end();
        }
    }
    return response.status(204).end();
})

app.post("/api/highscores", async (request, response) => {
    await highscoreService.setNewHighscore(request.body);
    response.status(204);
    return response.redirect("/");
});

app.get("/api/highscores", async (request, response) => {
    response.send(await highscoreService.getData());
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));