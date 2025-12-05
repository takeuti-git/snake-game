// @ts-check

import { Game } from "../core/game.js";
import { GAME_STATUS } from "../constants/game_status.js";

import { setOutBorderColor, resetOutBorderColor } from "./display.js";
import { status, setStatus } from "./status_controller.js";
import * as gameSpeed from "./speed_controller.js";
import { COLORS } from "../constants/colors.js";

const START_KEYS = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "KeyW", "KeyA", "KeyS", "KeyD"];

/**
 * UIイベントの登録
 * @param {Game} game 
 */
export function setupKeyEvents(game) {
    setStatus(GAME_STATUS.READY);
    document.addEventListener("keydown", (e) => handleKeyDown(e, game));
    document.addEventListener("keyup", (e) => handleKeyUp(e));
}

/**
 * keydown処理
 * @param {KeyboardEvent} e 
 * @param {Game} game 
 */
function handleKeyDown(e, game) {
    if (e.repeat) return;
    if (/^F([1-9]|1[0-2])$/.test(e.key)) return;
    e.preventDefault();

    switch (status) {
        case GAME_STATUS.READY:
            if (START_KEYS.includes(e.code)) startGame(game, e);
            break;

        case GAME_STATUS.PLAYING:
            handlePlayingKey(e, game);
            break;
    }
    if (e.code === "KeyR") resetGame(game);
}

/**
 * @param {KeyboardEvent} e 
 * @param {Game} game 
 */
function handlePlayingKey(e, game) {
    game.handleKey(e);

    if (e.ctrlKey) {
        gameSpeed.setSlow();
        setOutBorderColor(COLORS.SLOW);
        return;
    }
    if (e.shiftKey) {
        gameSpeed.setFast();
        setOutBorderColor(COLORS.FAST);
        return;
    }

}

/**
 * @param {KeyboardEvent} e 
 */
function handleKeyUp(e) {
    if (e.key === "Shift" || e.key === "Control") {
        gameSpeed.setNormal();
        resetOutBorderColor();
        return;
    }
}

/**
 * @param {Game} game 
 * @param {KeyboardEvent} e
 */
function startGame(game, e) {
    setStatus(GAME_STATUS.PLAYING);
    game.onStart(e);
}

/**
 * @param {Game} game 
 */
function resetGame(game) {
    setStatus(GAME_STATUS.READY);
    game.onReset();
}
