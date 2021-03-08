const express = require("express");
const path = require("path");

const router = express.Router();

module.exports = () => {
    router.get("/", (request, response) => {
        response.sendFile(path.join(__dirname, "../leaderboard.html"));
    });

    return router;
}