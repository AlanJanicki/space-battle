import { Common, HIDE, SHOW } from './Common';
import { ESCAPE_KEY } from './Modal';
import { gameState } from './GameState';
import { gameResult } from './GameResult';
import { media } from './Media';
import { menu } from './Menu';
import { settings } from './Settings';

const BLUE_COLOR = '#8bafce';
const CANVAS_FONT = '12px Roboto Mono';
export const CANVAS_HEIGHT = 480;
const CANVAS_ID = 'js-game-screen';
export const CANVAS_WIDTH = 640;
export const GAME_BAR_OFFSET_Y = 15;
const GREEN_COLOR = '#7cfac3';
const RED_COLOR = 'red';
const WHITE_COLOR = 'white';

class Canvas extends Common {
  /** @type {CanvasRenderingContext2D} */
  #context;

  constructor() {
    super(CANVAS_ID);
    this.#setCanvas();
    window.addEventListener('keydown', (e) => this.#handleGameMenu(e));
  }

  openCanvas() {
    this.changeVisibility(this.element, SHOW);
    menu.showOpenGameMenuButton();
  }

  closeCanvas() {
    this.changeVisibility(this.element, HIDE);
    menu.hideOpenGameMenuButton();
  }

  #setCanvas() {
    this.#context = this.element.getContext('2d');
    this.#context.canvas.width = CANVAS_WIDTH;
    this.#context.canvas.height = CANVAS_HEIGHT;
    this.#context.font = CANVAS_FONT;
    this.#context.fillStyle = WHITE_COLOR;
  }

  drawGameOnCanvas() {
    this.drawBackground();
    this.#drawActualLevel();
    this.#drawPointsToWin();
    this.#drawPlayerPoints();
    this.#drawPlayerLives();
  }

  drawRedScreen() {
    this.#context.fillStyle = RED_COLOR;
    this.#context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawBackground() {
    this.#context.drawImage(media.backgroundImage, 0, 0);
  }

  #drawActualLevel() {
    this.#context.fillStyle = BLUE_COLOR;
    this.#context.fillText('Poziom:', 0, GAME_BAR_OFFSET_Y);
    this.#context.fillStyle = GREEN_COLOR;
    this.#context.fillText(`${gameState.actualLevel}`, 60, GAME_BAR_OFFSET_Y);
  }

  #drawPointsToWin() {
    this.#context.fillStyle = BLUE_COLOR;
    this.#context.fillText('Próg zwycięstwa:', 80, GAME_BAR_OFFSET_Y);
    this.#context.fillStyle = GREEN_COLOR;
    this.#context.fillText(`${gameState.pointsToWin} pkt`, 210, GAME_BAR_OFFSET_Y);
  }

  #drawPlayerPoints() {
    this.#context.fillStyle = BLUE_COLOR;
    this.#context.fillText('Twoje punkty:', 280, GAME_BAR_OFFSET_Y);
    this.#context.fillStyle = GREEN_COLOR;
    this.#context.fillText(`${gameState.playerScore} pkt`, 390, GAME_BAR_OFFSET_Y);
  }

  #drawPlayerLives() {
    this.#context.fillStyle = BLUE_COLOR;
    this.#context.fillText('Twoje życia:', 450, GAME_BAR_OFFSET_Y);
    this.#context.fillStyle = RED_COLOR;
    this.#context.fillText(`${gameState.playerLives}`, 550, GAME_BAR_OFFSET_Y);
  }

  #handleGameMenu(e) {
    if (
      e.key === ESCAPE_KEY &&
      !this.isVisible(gameResult.element) &&
      this.isVisible(this.element)
    ) {
      if (!this.isVisible(menu.gameMenu)) {
        menu.handleOpenGameMenu();
        if (this.isVisible(settings.element)) {
          settings.closeSettings();
        }
      } else {
        menu.handleCloseGameMenu();
      }
    }
  }

  get context() {
    return this.#context;
  }
}

export const canvas = new Canvas();
