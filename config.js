const Config = {
    tileSize: 32,
    tileCount: 15,
    snakeGap: 5, //TODO: More descriptive name??
    snakeColor: "#8888ff",
    bgColor1: "#66ff66",
    bgColor2: "#aaffaa",
    FPS: 0,
    frameTime: 0,
    setFPS: function setFPS(fps) {
        this.FPS = fps;
        this.frameTime = 1000/fps;
    }
}