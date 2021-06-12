const scoreCounter = document.querySelector(".score-counter"); //TODO: Color scheme??
const messageBox = document.querySelector(".message-box");

let game;

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
    } else {
        gameOver();
        return;
    }

    requestAnimationFrame(run);
}

function gameOver() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 204) {
                setMessageBoxContents("#game-over-template");
                messageBox.querySelector("#game-over-score-display")
                    .textContent = `Final score: ${game.getScore()}`;
                messageBox.querySelector(".restart-button").onclick = start;

                showMessageBox();
            } else if (xhr.status === 200) {
                setMessageBoxContents("#highscore-submit-template");
                messageBox.querySelector("#score").value = game.getScore();
                showMessageBox();
            }
        }
    }
    xhr.open("POST", "/api/scores", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`score=${game.getScore()}`);
}

function submitInfo() {
    const infoForm = document.getElementById("info-form");
    const name = infoForm.elements["name"].value;
    const message = infoForm.elements["message"].value;
    const badName = document.getElementById("bad-name-text");
    const badMessage = document.getElementById("bad-message-text");

    badName.style.display = "none";
    badMessage.style.display = "none";

    let errors = false;
    if (name.length < 3) {
        badName.style.display = "block";
        errors = true;
    }
    if (message.length < 5) {
        badMessage.style.display = "block";
        errors = true;
    }

    if (!errors) {
        infoForm.submit();
    }
}

function firstKeystrokeListener(event) {
    let code = event.code;
    if (code !== "ArrowUp" &&
        code !== "ArrowDown" &&
        code !== "ArrowLeft" &&
        code !== "ArrowRight" &&
        code !== "KeyW" &&
        code !== "KeyS" &&
        code !== "KeyA" &&
        code !== "KeyD"
    ) return;

    hideMessageBox();
    window.removeEventListener("keydown", firstKeystrokeListener);
    window.addEventListener("keydown", e => { game.handleInput(e); });
    game.handleInput(event);
    game.running = true;
    lastTime = performance.now();
    run();
}

function hideMessageBox() {
    messageBox.style.display = "none";
}

function showMessageBox() {
    messageBox.style.display = "block";
}

function setMessageBoxContents(templateID) {
    let templateContents = document.querySelector(templateID);
    messageBox.innerHTML = "";
    messageBox.appendChild(templateContents.content.cloneNode(true));
}

function start() {
    game = new Game();
    game.initialize();

    setMessageBoxContents("#instructions-template");
    showMessageBox();
    window.addEventListener("keydown", firstKeystrokeListener);

}

window.onload = start;