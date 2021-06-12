class Game {
    constructor() {
        this.canvas = document.querySelector("#game-canvas");
        this.context = this.canvas.getContext("2d");
        this.tailTextures = [];
        this.headTextures = [];
        this.backgroundTexture;
        this.appleTexture;
        this.snake;
        this.apple;
        this.running;
    }

    toVector(vectorOrX, y = undefined) {
        if (y !== undefined) {
            return {x: vectorOrX, y: y};
        } else {
            return {x: vectorOrX.x, y: vectorOrX.y};
        }
    }

    createCornerBuffer() {
        const temp = document.createElement("canvas");
        temp.width = Config.tileSize;
        temp.height = Config.tileSize;
        const ctx = temp.getContext("2d");
        ctx.fillStyle = Config.snakeColor;
        ctx.beginPath();
        const middlePoint = Config.tileSize - Config.snakeGap
        ctx.arc(middlePoint, middlePoint, middlePoint - Config.snakeGap, Math.PI, Math.PI * 1.5);
        ctx.lineTo(middlePoint, middlePoint);
        ctx.lineTo(0, middlePoint);
        ctx.fillRect(middlePoint, Config.snakeGap, Config.snakeGap, middlePoint - Config.snakeGap);
        ctx.fillRect(Config.snakeGap, middlePoint, middlePoint - Config.snakeGap, Config.snakeGap);
        ctx.fill();
        return temp;
    }

    createRotatedContext(reference, times = 1) {
        const temp = document.createElement("canvas");
        temp.width = Config.tileSize;
        temp.height = Config.tileSize;
        const ctx = temp.getContext("2d");
        ctx.save();
        for (let i = 0; i < times; i++) {
            ctx.translate(Config.tileSize, 0);
            ctx.rotate(90 * Math.PI / 180);
        }
        ctx.drawImage(reference, 0, 0);
        ctx.restore();
        return temp;
    }

    initializeTextures() {
        const verticalStraight = document.createElement("canvas");
        verticalStraight.width = Config.tileSize;
        verticalStraight.height = Config.tileSize;
        let ctx = verticalStraight.getContext("2d");
        ctx.fillStyle = Config.snakeColor;
        ctx.fillRect(Config.snakeGap, 0, Config.tileSize - 2 * Config.snakeGap, Config.tileSize);

        const horizontalStraight = document.createElement("canvas");
        horizontalStraight.width = Config.tileSize;
        horizontalStraight.height = Config.tileSize;
        ctx = horizontalStraight.getContext("2d");
        ctx.fillStyle = Config.snakeColor;
        ctx.fillRect(0, Config.snakeGap, Config.tileSize, Config.tileSize - 2 * Config.snakeGap);

        const errorSquare = document.createElement("canvas");
        errorSquare.width = Config.tileSize;
        errorSquare.height = Config.tileSize;
        ctx = errorSquare.getContext("2d");
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0, 0, Config.tileSize, Config.tileSize);

        const corner = this.createCornerBuffer();
        this.tailTextures = [
            corner,
            this.createRotatedContext(corner, 1),
            this.createRotatedContext(corner, 2),
            this.createRotatedContext(corner, 3),
            verticalStraight,
            horizontalStraight,
            errorSquare
        ];

        const head = document.createElement("canvas");
        head.width = Config.tileSize;
        head.height = Config.tileSize;
        ctx = head.getContext("2d");
        ctx.fillStyle = Config.snakeColor;
        ctx.fillRect(
            Config.snakeGap,
            Config.tileSize / 2,
            Config.tileSize - Config.snakeGap * 2,
            Config.tileSize / 2
        );
        ctx.beginPath();
        ctx.arc(
            Config.tileSize / 2,
            Config.tileSize / 2,
            (Config.tileSize - Config.snakeGap * 2) / 2,
            Math.PI, 0
        );
        ctx.fill();

        this.headTextures = [
            head,
            this.createRotatedContext(head, 1),
            this.createRotatedContext(head, 2),
            this.createRotatedContext(head, 3),
            errorSquare
        ];

        this.backgroundTexture = document.createElement("canvas");
        this.backgroundTexture.width = this.canvas.width;
        this.backgroundTexture.height = this.canvas.height;
        ctx = this.backgroundTexture.getContext("2d");
        let color = Config.bgColor1;
        for (let i = 0; i < Config.tileCount; i++) {
            if (Config.tileCount % 2 === 0) {
                color = color === Config.bgColor1 ? Config.bgColor2 : Config.bgColor1;
            }
            for (let j = 0; j < Config.tileCount; j++) {
                color = color === Config.bgColor1 ? Config.bgColor2 : Config.bgColor1;
                ctx.fillStyle = color;
                ctx.fillRect(
                    i * Config.tileSize,
                    j * Config.tileSize,
                    Config.tileSize,
                    Config.tileSize
                );
            }
        }

        this.appleTexture = document.createElement("canvas");
        this.appleTexture.width = Config.tileSize;
        this.appleTexture.height = Config.tileSize;
        ctx = this.appleTexture.getContext("2d");
        ctx.fillStyle = "#DB8979";
        ctx.beginPath();
        ctx.arc(
            Config.tileSize / 2,
            Config.tileSize / 2,
            Config.tileSize / 2 - Config.snakeGap / 2,
            0, Math.PI * 2
        )
        ctx.fill();
    }


    initialize() {
        this.canvas.width = Config.tileCount * Config.tileSize
        this.canvas.height = Config.tileCount * Config.tileSize
        this.canvas.focus();

        this.initializeTextures();

        this.snake = new Snake(this, Math.floor(Config.tileCount / 2), Config.tileCount - 2);
        this.apple = {
            x: 0,
            y: 0,
            game: this,
            draw: function () {
                this.game.context.drawImage(
                    this.game.appleTexture,
                    this.x * Config.tileSize,
                    this.y * Config.tileSize
                );
            },
            spawn: function () {
                let positions = [];
                for (let i = 0; i < Config.tileCount; i++) {
                    for (let j = 0; j < Config.tileCount; j++) {
                        if (this.game.snake.collides(i, j)) continue;
                        positions.push(this.game.toVector(i, j));
                    }
                }
                positions.forEach(pos => {
                    let selected = positions[Math.floor(Math.random() * positions.length)];
                    this.x = selected.x;
                    this.y = selected.y;
                }); //WTF ??? TODO: CHECK WTF IS HAPPENING HERE
            }

        }
        this.apple.spawn();
        this.draw();

        Config.setFPS(7);
        this.running = false;
    }

    handleInput(event) {
        this.snake.handleInput(event.code);
    }

    update(deltaTime) {
        this.snake.update();
        if (this.snake.collidesBorderOrSelf()) {
            this.running = false;
        }
        if (this.snake.headCollides(this.apple.x, this.apple.y)) {
            this.snake.grow();
            this.apple.spawn();
        }
    }

    draw() {
        this.context.drawImage(this.backgroundTexture, 0, 0);
        this.apple.draw();
        this.snake.draw();
    }

    getScore() {
        return this.snake.trueLength;
    }
}