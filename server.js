const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, "./static")));
app.use(bodyParser.json());

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.post("/scores", (request, response) => {
    console.log(`post request received. Score: ${ request.body.score }`);
    response.status(204).end();
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));