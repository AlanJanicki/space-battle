import { Common, HIDE, SHOW } from './Common';
import { canvas } from './Canvas';
import { game } from './Game';
import { menu } from './Menu';
import { User } from './User';

const BACK_TO_MENU_BUTTON_ID = 'js-level-select-back-button';
const LEVEL_SELECT_CLASS = 'level-select__level';
const LEVEL_SELECT_ID = 'js-level-select';
const LEVELS_ID = 'js-level-select-levels';

class LevelSelect extends Common {
  constructor() {
    super(LEVEL_SELECT_ID);
    this.#bindToLevelSelectElements();
  }

  #bindToLevelSelectElements() {
    const backToMenuButton = this.bindToElement(BACK_TO_MENU_BUTTON_ID);

    backToMenuButton.addEventListener('click', () => this.#backToMenu());
  }

  openLevelSelect() {
    this.changeVisibility(this.element, SHOW);
    this.#generateLevels();
  }

  closeLevelSelect() {
    this.changeVisibility(this.element, HIDE);
  }

  #backToMenu() {
    this.changeVisibility(this.element, HIDE);
    this.changeVisibility(menu.element, SHOW);
  }

  #generateLevels() {
    const { gameLevel } = User.userData;
    const levels = document.getElementById(LEVELS_ID);

    while (levels.firstChild) {
      levels.removeChild(levels.firstChild);
    }

    for (let i = 0; i < gameLevel; i++) {
      const level = document.createElement('button');
      level.classList.add(LEVEL_SELECT_CLASS);
      level.innerText = i + 1;
      level.addEventListener('click', () => this.#playLevel(i + 1));
      levels.appendChild(level);
    }
  }

  #playLevel(level) {
    if (this.isVisible(canvas.element)) {
      return;
    }
    game.playGame(level);
  }
}

export const levelSelect = new LevelSelect();
