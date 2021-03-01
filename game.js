const canvas = document.querySelector("#cs");
const context = canvas.getContext("2d");

let tailTextures = [];
let headTextures = [];
let snake;

function toVector(vectorOrX, y) {
    if (y) {
        return {x: vectorOrX, y: y};
    } else {
        return {x: vectorOrX.x, y: vectorOrX.y};
    }
}

function createCornerBuffer() {
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

function createRotatedContext(reference, times=1) {
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

function initializeTextures() {
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
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, Config.tileSize, Config.tileSize);

    const corner = createCornerBuffer();
    tailTextures = [
        corner,
        createRotatedContext(corner, 1),
        createRotatedContext(corner, 2),
        createRotatedContext(corner, 3),
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

    headTextures = [
        head,
        createRotatedContext(head, 1),
        createRotatedContext(head, 2),
        createRotatedContext(head, 3),
        errorSquare
    ];
}

window.onload = function initialize() {
    initializeTextures();

    canvas.width = Config.tileCount * Config.tileSize
    canvas.height = Config.tileCount * Config.tileSize
    canvas.focus();

    snake = new Snake();
    draw();

    window.addEventListener("keydown", function keydown(event) {
        snake.handleInput(event.code)
        if (event.code === "KeyP" && !event.repeat) {
            running = !running;
        }
    });

    Config.setFPS(8);
    lastTime = performance.now();
    game();
}

let lastTime = 0;
let accumulator = 0;

let running = true;
function game(time=performance.now()) {
    const deltaTime = time - lastTime;
    lastTime = time;
    if (running) {
        accumulator += deltaTime;
        if (accumulator >= Config.frameTime) {
            while (accumulator >= Config.frameTime) {
                accumulator -= Config.frameTime;
                update(deltaTime);
            }
            draw();
        }
    }
    requestAnimationFrame(game);
}

function update(deltaTime) {
    snake.update();
}

function draw() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    snake.draw();
}