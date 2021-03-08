const express = require("express");
const path = require("path");
const leaderboardRoute = require("./leaderboard");

const router = express.Router();

module.exports = (params) => {
    const { highscoreService } = params;

    router.get("/", (request, response) => {
        response.sendFile(path.join(__dirname, "../game.html"));
    });

    router.post("/api/scores", async (request, response) => {
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

    router.post("/api/highscores", async (request, response) => {
        await highscoreService.setNewHighscore(request.body);
        response.status(204);
        return response.redirect("/leaderboard");
    });

    router.get("/api/highscores", async (request, response) => {
        response.send(await highscoreService.getData());
    });


    router.use("/leaderboard", leaderboardRoute());

    return router;
}