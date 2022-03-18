import { Common, HIDE, SHOW } from './Common';
import { media } from './Media';

export const ELEMENTS_LOADED_EVENT = 'elementsLoaded';
const LOADING_ID = 'js-loading';
const LOADED_ELEMENTS_ID = 'js-loaded-elements';
const TOTAL_ELEMENTS = 'js-total-elements';

import backgroundMusic from '../sounds/music-background.mp3';
import gameDefeatSound from '../sounds/game-defeat.mp3';
import gameWinSound from '../sounds/game-win.mp3';
import hitEnemySound from '../sounds/hit-enemy-sound.wav';
import hitPlayerSound from '../sounds/hit-player-sound.wav';
import shotSound from '../sounds/shot-sound.mp3';

import backgroundImg from '../images/background.jpg';
import enemySprite from '../images/enemy.png';
import enemyBigSprite from '../images/enemy-big.png';
import explosionSprite from '../images/explosion.png';
import explosionBigSprite from '../images/explosion-big.png';
import missileImg from '../images/missile.png';
import shipSprite from '../images/ship.png';

class Loader extends Common {
  #isLoadingComplete;
  #loadedElements;
  #loadedElementsAmount;
  #totalElements;
  #totalElementsAmount;

  constructor() {
    super(LOADING_ID);
    this.#bindToLoaderElements();
    this.#resetLoaderStatus();
  }

  #bindToLoaderElements() {
    this.#loadedElements = this.bindToElement(LOADED_ELEMENTS_ID);
    this.#totalElements = this.bindToElement(TOTAL_ELEMENTS);
  }

  #loadImg(src) {
    this.changeVisibility(this.element, SHOW);
    this.#isLoadingComplete = false;
    this.#totalElementsAmount++;
    this.#totalElements.innerText = this.#totalElementsAmount;

    const img = new Image();
    img.src = src;
    img.addEventListener('load', (e) => this.#handleElementLoaded(e));
    return img;
  }

  #loadSound(src) {
    this.changeVisibility(this.element, SHOW);
    this.#isLoadingComplete = false;
    this.#totalElementsAmount++;
    this.#totalElements.innerText = this.#totalElementsAmount;

    const audio = new Audio();
    audio.src = src;
    audio.load();
    audio.addEventListener('canplaythrough', (e) => this.#handleElementLoaded(e));
    return audio;
  }

  #handleElementLoaded(e) {
    e.target.removeEventListener(e.type, this.#handleElementLoaded);
    this.#loadedElementsAmount++;
    this.#loadedElements.innerText = this.#loadedElementsAmount;

    if (this.#loadedElementsAmount === this.#totalElementsAmount) {
      this.#resetLoaderStatus();
      this.changeVisibility(this.element, HIDE);
      window.dispatchEvent(new CustomEvent(ELEMENTS_LOADED_EVENT));
    }
  }

  #resetLoaderStatus() {
    this.#isLoadingComplete = true;
    this.#loadedElementsAmount = 0;
    this.#totalElementsAmount = 0;
  }

  loadGameElements() {
    if (
      media.backgroundMusic &&
      media.gameDefeatSound &&
      media.gameWinSound &&
      media.hitEnemySound &&
      media.hitPlayerSound &&
      media.shotSound &&
      media.backgroundImage &&
      media.enemySprite &&
      media.enemyBigSprite &&
      media.explosionSprite &&
      media.explosionBigSprite &&
      media.missileImg &&
      media.shipSprite
    ) {
      window.dispatchEvent(new CustomEvent(ELEMENTS_LOADED_EVENT));
    } else {
      if (!media.backgroundMusic) media.backgroundMusic = this.#loadSound(backgroundMusic);
      if (!media.gameDefeatSound) media.gameDefeatSound = this.#loadSound(gameDefeatSound);
      if (!media.gameWinSound) media.gameWinSound = this.#loadSound(gameWinSound);
      if (!media.hitEnemySound) media.hitEnemySound = this.#loadSound(hitEnemySound);
      if (!media.hitPlayerSound) media.hitPlayerSound = this.#loadSound(hitPlayerSound);
      if (!media.shotSound) media.shotSound = this.#loadSound(shotSound);
      if (!media.backgroundImage) media.backgroundImage = this.#loadImg(backgroundImg);
      if (!media.enemySprite) media.enemySprite = this.#loadImg(enemySprite);
      if (!media.enemyBigSprite) media.enemyBigSprite = this.#loadImg(enemyBigSprite);
      if (!media.explosionSprite) media.explosionSprite = this.#loadImg(explosionSprite);
      if (!media.explosionBigSprite) media.explosionBigSprite = this.#loadImg(explosionBigSprite);
      if (!media.missileImg) media.missileImg = this.#loadImg(missileImg);
      if (!media.shipSprite) media.shipSprite = this.#loadImg(shipSprite);
    }
  }
}

export const loader = new Loader();
