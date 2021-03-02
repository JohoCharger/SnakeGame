class Snake {
    constructor() {
        this.vel = {x: 0, y: -1};
        this.velQueue = [];
        this.pos = {x: 10, y: 17};
        this.trueLength = 10; //TODO: More descriptive name??
        this.tail = [];

        this.velToTexID = {
            "-10-10": 5,
            "1010": 5,
            "0-10-1": 4,
            "0101": 4,
            "0-110": 2,
            "1001": 3,
            "-100-1": 1,
            "01-10": 0,
            "-1001": 2,
            "0-1-10": 3,
            "0110": 1,
            "100-1": 0,
        };
    }

    update() {
        let lastVel = toVector(this.vel);
        if (this.velQueue.length) this.vel = toVector(this.velQueue.shift());

        let a = String(this.vel.x) + String(this.vel.y) + String(lastVel.x) + String(lastVel.y);
        let textureID = this.velToTexID[a];
        if (!(a in this.velToTexID)) textureID = 6;

        this.tail.unshift({
            x: this.pos.x,
            y: this.pos.y,
            textureID: textureID
        });
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.tail.length === this.trueLength) {
            this.tail.pop()
        }
    }

    handleInput(code) {
        let previousVel = this.velQueue.length ? toVector(this.velQueue[0]) : toVector(this.vel)
        if (code === "ArrowLeft" && previousVel.x === 0) {
            this.queueInput(-1, 0);
        } else if (code === "ArrowRight" && previousVel.x === 0) {
            this.queueInput(1, 0);
        } else if (code === "ArrowUp" && previousVel.y === 0) {
            this.queueInput(0, -1);
        } else if (code === "ArrowDown" && previousVel.y === 0) {
            this.queueInput(0, 1);
        }
    }

    queueInput(x, y) {
        if (this.velQueue.length === 0) {
            if (x === this.vel.x || y === this.vel.y)
                return;
            else this.velQueue.push(toVector(x, y));
        }
        let lastInput = this.velQueue[this.velQueue.length - 1]; //TODO
        if (x === lastInput.x || y === lastInput.y) return;
        this.velQueue.push(toVector(x, y));
    }

    draw() {
        let headTexture = 4;
        if (this.vel.y === -1) headTexture = 0;
        if (this.vel.x === 1) headTexture = 1;
        if (this.vel.y === 1) headTexture = 2;
        if (this.vel.x === -1) headTexture = 3;

        context.drawImage(
            headTextures[headTexture],
            this.pos.x * Config.tileSize,
            this.pos.y * Config.tileSize
        );

        this.tail.forEach(tailPiece => {
            context.drawImage(
                tailTextures[tailPiece.textureID],
                tailPiece.x * Config.tileSize,
                tailPiece.y * Config.tileSize
            );
        });
    }
}