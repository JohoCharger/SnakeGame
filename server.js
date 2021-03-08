const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const HighscoreService = require("./HighscoreService");
const routes = require("./routes/index");

const app = express();

const PORT = 3000;

const highscoreService = new HighscoreService("highscores.json");

app.use(helmet());
app.use(express.static(path.join(__dirname, "./static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/css", express.static(path.join(__dirname, "./node_modules/bootstrap/dist/css")));

app.use(routes({ highscoreService }));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));