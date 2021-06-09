const express = require("express");
const crypto = require("crypto");
const leaderboardRoute = require("./leaderboard");

const router = express.Router();

module.exports = (params) => {
    const { highscoreService } = params;

    router.get("/", (request, response) => {

        let nonce = crypto.randomBytes(16).toString("base64");

        //Ugly code to remove old 'script-src' policy and add new one with a nonce
        let csp = response.get("Content-Security-Policy");
        let policies = csp.split(";")
        policies = policies.filter(policy => { return !policy.startsWith("script-src"); });
        csp = policies.join(";");
        csp = `script-src 'self' 'nonce-${nonce}'; ` + csp

        response.set("Content-Security-Policy", csp);

        response.render("game.ejs", { nonce });
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


    router.use("/leaderboard", leaderboardRoute({ highscoreService }));

    return router;
}