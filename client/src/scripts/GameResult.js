import { Common, HIDE, SHOW } from './Common';
import { game } from './Game';
import { gameState } from './GameState';
import { menu } from './Menu';
import { User } from './User';

import axios from '../utils/axios';

const BACK_TO_MAIN_MENU_BUTTON = 'js-back-to-main-menu-button-result-screen';
const PLAY_AGAIN_BUTTON = 'playAgainButton';
const PLAY_NEW_LEVEL_BUTTON = 'playNewLevelButton';
const PLAY_NEXT_LEVEL_BUTTON = 'playNextLevelButton';
const RESULT_BUTTON_CLASS = 'result__button';
const RESULT_ERROR_CLASS = 'result__error';
const RESULT_BUTTON_ID = 'js-result-button';
const RESULT_ID = 'js-result';
const RESULT_INFO_ID = 'js-result-info';
const RESULT_ICON_DEFEAT_CLASS = 'fa-face-frown';
const RESULT_ICON_ID = 'js-result-icon';
const RESULT_ICON_WIN_CLASS = 'fa-face-smile';

class GameResult extends Common {
  #backToMainMenuButton;
  #resultIcon;
  #resultInfo;

  constructor() {
    super(RESULT_ID);
    this.#bindToResultElements();
  }

  #bindToResultElements() {
    this.#backToMainMenuButton = this.bindToElement(BACK_TO_MAIN_MENU_BUTTON);
    this.#resultIcon = this.bindToElement(RESULT_ICON_ID);
    this.#resultInfo = this.bindToElement(RESULT_INFO_ID);
    this.#backToMainMenuButton.addEventListener('click', () => this.#backToMainMenu());
  }

  openResult() {
    this.changeVisibility(this.element, SHOW);
  }

  #clearResult() {
    this.#resultInfo.innerText = '';
    this.#resultIcon.classList.remove(RESULT_ICON_DEFEAT_CLASS, RESULT_ICON_WIN_CLASS);
    const resultButtons = document.querySelectorAll(`#${RESULT_BUTTON_ID}`);
    if (resultButtons) {
      resultButtons.forEach((button) => button.remove());
    }
  }

  handlePlayerDefeat() {
    this.#clearResult();
    this.#resultInfo.innerText = 'Przegrana! Spróbujesz ponownie?';
    this.#resultIcon.classList.add(RESULT_ICON_DEFEAT_CLASS);
    this.#generateResultButton(PLAY_AGAIN_BUTTON, 'Rozpocznij poziom od nowa');
  }

  handlePlayerWin() {
    this.#clearResult();
    if (gameState.actualLevel < User.userData.gameLevel) {
      this.#resultInfo.innerText = 'Wygrana!';
      this.#resultIcon.classList.add(RESULT_ICON_WIN_CLASS);
      this.#generateResultButton(
        PLAY_NEXT_LEVEL_BUTTON,
        `Graj dalej - poziom: ${gameState.actualLevel + 1}`
      );
    } else {
      this.#resultInfo.innerText = 'Wygrana! Odblokowałeś kolejny poziom!';
      this.#resultIcon.classList.add(RESULT_ICON_WIN_CLASS);
      this.#handlePlayerUnlockNewLevel();
    }
  }

  #backToMainMenu() {
    this.changeVisibility(this.element, HIDE);
    menu.handleBackToMainMenu();
  }

  #handlePlayAgain() {
    game.resetGame();
    game.resumeGame();
    this.changeVisibility(this.element, HIDE);
  }

  #handlePlayNextLevel(level) {
    game.resetGame();
    game.setGameState(level);
    game.resumeGame();
    this.changeVisibility(this.element, HIDE);
  }

  #generateResultButton(buttonType, text) {
    const button = document.createElement('button');
    button.id = RESULT_BUTTON_ID;
    button.classList.add(RESULT_BUTTON_CLASS);
    button.innerText = text;
    if (buttonType === PLAY_AGAIN_BUTTON) {
      button.addEventListener('click', () => this.#handlePlayAgain());
    } else if (buttonType === PLAY_NEXT_LEVEL_BUTTON) {
      button.addEventListener('click', () => this.#handlePlayNextLevel(gameState.actualLevel + 1));
    } else if (buttonType === PLAY_NEW_LEVEL_BUTTON) {
      button.addEventListener('click', () => this.#handlePlayNextLevel(User.userData.gameLevel));
    }
    this.#backToMainMenuButton.parentNode.insertBefore(button, this.#backToMainMenuButton);
  }

  #setServerErrors(errors) {
    errors.forEach((error) => {
      const errorMessage = Object.values(error).toString();

      if (errorMessage) {
        const error = document.createElement('span');
        error.classList.add(RESULT_ERROR_CLASS);
        error.innerText = `Błąd serwera: ${errorMessage}.`;
        this.#backToMainMenuButton.parentNode.insertBefore(error, this.#backToMainMenuButton);
      }
    });
  }

  #handlePlayerUnlockNewLevel() {
    const { gameLevel } = User.userData;

    axios
      .patch(
        '/update',
        { gameLevel: gameLevel + 1 },
        {
          headers: {
            ...axios.headers,
            authorization: localStorage.getItem('jwt')
              ? `Bearer ${localStorage.getItem('jwt')}`
              : '',
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          User.userData = res.data;
          this.#generateResultButton(
            PLAY_NEW_LEVEL_BUTTON,
            `Graj dalej - poziom: ${User.userData.gameLevel}`
          );
        }
      })
      .catch((err) => {
        this.#setServerErrors(err.response.data);
      });
  }
}

export const gameResult = new GameResult();
