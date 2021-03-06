const scoreCounter = document.querySelector(".score-counter");

let game = new Game();
game.initialize();

let keyboardListener;

function bindKeyboard() {
    keyboardListener = window.addEventListener("keydown", event => {
        game.handleInput(event);
    });
}

function unbindKeyboard() {
    window.removeEventListener("keydown", keyboardListener);
}

let lastTime = 0;
let accumulator = 0;
function run(time=performance.now()) {
    const deltaTime = time - lastTime;
    lastTime = time;
    if (game.running) {
        accumulator += deltaTime;
        if (accumulator >= Config.frameTime) {
            while (accumulator >= Config.frameTime && game.running) {
                accumulator -= Config.frameTime;
                game.update(deltaTime);
            }
            scoreCounter.textContent = String(game.getScore());
            game.draw();
        }
    }
    requestAnimationFrame(run);
}

function firstKeystrokeListener(event) {
    let code = event.code;
    if (code !== "ArrowUp" &&
        code !== "ArrowDown" &&
        code !== "ArrowLeft" &&
        code !== "ArrowRight"
    ) return;

    window.removeEventListener("keydown", firstKeystrokeListener);
    bindKeyboard();
    game.handleInput(event);
    game.running = true;
    lastTime = performance.now();
    run();
}

window.onload = function start() {
    window.addEventListener("keydown", firstKeystrokeListener);
}