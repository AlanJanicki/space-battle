import { Common, HIDE, SHOW } from './Common';
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH } from './Canvas';
import { form } from './Form';
import { game } from './Game';
import { levelSelect } from './LevelSelect';
import { ELEMENTS_LOADED_EVENT, loader } from './Loader';
import { media } from './Media';
import { modal } from './Modal';
import { settings } from './Settings';
import { User } from './User';

import { debounce } from '../utils/debounce';

const BACK_TO_MAIN_MENU_BUTTON_ID = 'js-back-to-main-menu-button';
const DELETE_ACCOUNT_BUTTON_ID = 'js-delete-account-button';
const GAME_MENU_ID = 'js-game-menu';
const MAIN_MENU_ID = 'js-main-menu';
const MENU_USER_LOGGED_IN_ID = 'js-menu-user-logged-in';
const MENU_USER_LOGGED_OUT_ID = 'js-menu-user-logged-out';
const LOGIN_BUTTON_ID = 'js-login-button';
const LOGOUT_BUTTON_ID = 'js-logout-button';
const OPEN_GAME_MENU_BUTTON_ACTIVE_CLASS = 'menu__button--open-game-menu--active';
const OPEN_GAME_MENU_BUTTON_ID = 'js-open-game-menu-button';
const PLAY_BUTTON_ID = 'js-play-button';
const REGISTER_BUTTON_ID = 'js-register-button';
const RESET_GAME_BUTTON_ID = 'js-reset-game-button';
const RESUME_GAME_BUTTON_ID = 'js-resume-game-button';
const SETTINGS_BUTTON_ID = 'js-settings-button';
const SETTINGS_GAME_MENU_BUTTON_ID = 'js-settings-in-game-button';
const SCALE_VALUE = '--scale-value';

class Menu extends Common {
  #gameMenu;
  #loginButton;
  #menuUserLoggedIn;
  #menuUserLoggedOut;
  #openGameMenuButton;
  #playButton;

  constructor() {
    super(MAIN_MENU_ID);
    this.#bindToMenuElements();
    this.handleUserLoggedIn();
    this.#resizeGameWindow();
    window.addEventListener(
      'resize',
      debounce(() => {
        this.#resizeGameWindow();
      }, 1000)
    );
  }

  #bindToMenuElements() {
    const backToMainMenuButton = this.bindToElement(BACK_TO_MAIN_MENU_BUTTON_ID);
    const deleteAccountButton = this.bindToElement(DELETE_ACCOUNT_BUTTON_ID);
    this.#gameMenu = this.bindToElement(GAME_MENU_ID);
    this.#loginButton = this.bindToElement(LOGIN_BUTTON_ID);
    const logoutButton = this.bindToElement(LOGOUT_BUTTON_ID);
    this.#menuUserLoggedIn = this.bindToElement(MENU_USER_LOGGED_IN_ID);
    this.#menuUserLoggedOut = this.bindToElement(MENU_USER_LOGGED_OUT_ID);
    this.#openGameMenuButton = this.bindToElement(OPEN_GAME_MENU_BUTTON_ID);
    this.#playButton = this.bindToElement(PLAY_BUTTON_ID);
    const registerButton = this.bindToElement(REGISTER_BUTTON_ID);
    const resetGameButton = this.bindToElement(RESET_GAME_BUTTON_ID);
    const resumeGameButton = this.bindToElement(RESUME_GAME_BUTTON_ID);
    const settingsButton = this.bindToElement(SETTINGS_BUTTON_ID);
    const settingsGameMenuButton = this.bindToElement(SETTINGS_GAME_MENU_BUTTON_ID);

    this.#loginButton.addEventListener('click', this.#handleLogin);
    registerButton.addEventListener('click', this.#handleRegister);
    this.#playButton.addEventListener('click', () => this.#handlePlay());
    settingsButton.addEventListener('click', () => this.#handleSettings());
    deleteAccountButton.addEventListener('click', () => this.#handleDeleteAccount());
    logoutButton.addEventListener('click', () => {
      this.handleUserLoggedOut();
    });
    this.#openGameMenuButton.addEventListener('click', () => this.handleOpenGameMenu());
    resumeGameButton.addEventListener('click', () => this.handleCloseGameMenu());
    settingsGameMenuButton.addEventListener('click', () => this.#handleSettingsInGame());
    resetGameButton.addEventListener('click', () => this.#handleResetGame());
    backToMainMenuButton.addEventListener('click', () => this.handleBackToMainMenu());
  }

  #resizeGameWindow() {
    let scale;
    scale = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
    if (scale > 2) scale = 2;
    document.documentElement.style.setProperty(SCALE_VALUE, scale);
  }

  handleUserLoggedIn() {
    User.isUserTokenValid();
    if (User.userData) {
      this.changeVisibility(this.#menuUserLoggedOut, HIDE);
      loader.loadGameElements();
      window.addEventListener(ELEMENTS_LOADED_EVENT, () => this.showMenuUserLoggedIn());
    } else {
      this.changeVisibility(this.#menuUserLoggedIn, HIDE);
    }
  }

  handleUserLoggedOut() {
    User.removeUserData();
    this.#showMenuUserLoggedOut();
    media.stopBackgroundMusic();
  }

  showMenuUserLoggedIn() {
    this.changeVisibility(this.element, SHOW);
    this.changeVisibility(this.#menuUserLoggedIn, SHOW);
    this.#playButton.innerText = `Graj, ${User.userData.name}!`;
  }

  #showMenuUserLoggedOut() {
    this.changeVisibility(this.element, SHOW);
    this.changeVisibility(this.#menuUserLoggedIn, HIDE);
    this.changeVisibility(this.#menuUserLoggedOut, SHOW);
    this.#playButton.innerText = ``;
  }

  showOpenGameMenuButton() {
    this.changeVisibility(this.#openGameMenuButton, SHOW);
  }

  hideOpenGameMenuButton() {
    this.changeVisibility(this.#openGameMenuButton, HIDE);
  }

  #handleLogin() {
    modal.openModal();
    form.openLoginForm();
  }

  #handleRegister() {
    modal.openModal();
    form.openRegisterForm();
  }

  #handlePlay() {
    this.changeVisibility(this.element, HIDE);
    levelSelect.openLevelSelect();
  }

  #handleDeleteAccount() {
    modal.openModal();
    form.openDeleteAccountForm();
    this.changeVisibility(this.element, HIDE);
  }

  #handleSettings() {
    modal.openModal();
    settings.openSettings();
    if (this.isVisible(this.element)) {
      this.changeVisibility(this.element, HIDE);
    }
  }

  #openGameMenu() {
    modal.openModal();
    this.changeVisibility(this.#gameMenu, SHOW);
    this.#openGameMenuButton.classList.add(OPEN_GAME_MENU_BUTTON_ACTIVE_CLASS);
  }

  #closeGameMenu() {
    this.changeVisibility(this.#gameMenu, HIDE);
    modal.closeModal();
  }

  handleOpenGameMenu() {
    game.pauseGame();
    this.#openGameMenu();
  }

  handleCloseGameMenu() {
    this.#closeGameMenu();
    game.resumeGame();
    this.#openGameMenuButton.classList.remove(OPEN_GAME_MENU_BUTTON_ACTIVE_CLASS);
  }

  #handleResetGame() {
    game.resetGame();
    this.#closeGameMenu();
    game.resumeGame();
    this.#openGameMenuButton.classList.remove(OPEN_GAME_MENU_BUTTON_ACTIVE_CLASS);
  }

  #handleSettingsInGame() {
    this.#closeGameMenu();
    this.#handleSettings();
  }

  handleBackToMainMenu() {
    game.resetGame();
    canvas.closeCanvas();
    this.#closeGameMenu();
    levelSelect.closeLevelSelect();
    this.#openGameMenuButton.classList.remove(OPEN_GAME_MENU_BUTTON_ACTIVE_CLASS);
    this.showMenuUserLoggedIn();
  }

  get loginButton() {
    return this.#loginButton;
  }

  get gameMenu() {
    return this.#gameMenu;
  }
}

export const menu = new Menu();
