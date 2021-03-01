const Config = {
    tileSize: 32,
    tileCount: 20,
    snakeGap: 5,
    FPS: 0,
    frameTime: 0,
    setFPS: function setFPS(fps) {
        this.FPS = fps;
        this.frameTime = 1000/fps;
    }
}