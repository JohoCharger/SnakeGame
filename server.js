const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (request, response) => {
    response.send("Hello express!");
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));