import { Common } from './Common';
import { modal } from './Modal';

class Media extends Common {
  #backgroundImage;
  #backgroundMusic;
  #enemySprite;
  #enemyBigSprite;
  #explosionSprite;
  #explosionBigSprite;
  #gameDefeatSound;
  #gameWinSound;
  #hitEnemySound;
  #hitPlayerSound;
  #isMusicAllowed = true;
  #isSoundAllowed = true;
  #missileImg;
  #musicVolume = 0.5;
  #shipSprite;
  #shotSound;
  #soundVolume = 0.2;

  constructor() {
    super();
  }

  increaseMusicVolume() {
    this.#musicVolume += 0.1;
    if (this.#musicVolume > 1) this.#musicVolume = 1;
    this.#backgroundMusic.volume = this.#musicVolume;
  }

  decreaseMusicVolume() {
    this.#musicVolume -= 0.1;
    if (this.#musicVolume < 0.11) this.#musicVolume = 0;
    this.#backgroundMusic.volume = this.#musicVolume;
  }

  increaseSoundVolume() {
    this.#soundVolume += 0.1;
    if (this.#soundVolume > 1) this.#soundVolume = 1;
    this.#hitEnemySound.volume = this.#soundVolume;
    this.#hitPlayerSound.volume = this.#soundVolume;
    this.#shotSound.volume = this.#soundVolume;
  }

  decreaseSoundVolume() {
    this.#soundVolume -= 0.1;
    if (this.#soundVolume < 0.11) this.#soundVolume = 0;
    this.#hitEnemySound.volume = this.#soundVolume;
    this.#hitPlayerSound.volume = this.#soundVolume;
    this.#shotSound.volume = this.#soundVolume;
  }

  playBackgroundMusic() {
    if (this.#isMusicAllowed && !this.isVisible(modal.element)) {
      this.#backgroundMusic.loop = true;
      this.#backgroundMusic.play();
    }
  }

  stopBackgroundMusic() {
    this.#backgroundMusic.pause();
  }

  playGameWinSound() {
    if (this.#isSoundAllowed) {
      this.#gameWinSound.play();
    }
  }

  playGameDefeatSound() {
    if (this.#isSoundAllowed) {
      this.#gameDefeatSound.play();
    }
  }

  playHitEnemySound() {
    if (this.#isSoundAllowed) {
      this.#hitEnemySound.pause();
      this.#hitEnemySound.currentTime = 0;
      this.#hitEnemySound.play();
    }
  }

  playHitPlayerSound() {
    if (this.#isSoundAllowed) {
      this.hitPlayerSound.pause();
      this.hitPlayerSound.currentTime = 0;
      this.#hitPlayerSound.play();
    }
  }

  playShotSound() {
    if (this.#isSoundAllowed) {
      this.#shotSound.pause();
      this.#shotSound.currentTime = 0;
      this.#shotSound.play();
    }
  }

  toggleBackgroundMusic() {
    if (this.#isMusicAllowed) {
      this.#isMusicAllowed = false;
      this.stopBackgroundMusic();
    } else {
      this.#isMusicAllowed = true;
      this.playBackgroundMusic();
    }
  }

  toggleSound() {
    if (this.#isSoundAllowed) {
      this.#isSoundAllowed = false;
    } else {
      this.#isSoundAllowed = true;
    }
  }

  get backgroundImage() {
    return this.#backgroundImage;
  }

  get backgroundMusic() {
    return this.#backgroundMusic;
  }

  get enemySprite() {
    return this.#enemySprite;
  }

  get enemyBigSprite() {
    return this.#enemyBigSprite;
  }

  get explosionSprite() {
    return this.#explosionSprite;
  }

  get explosionBigSprite() {
    return this.#explosionBigSprite;
  }

  get gameDefeatSound() {
    return this.#gameDefeatSound;
  }

  get gameWinSound() {
    return this.#gameWinSound;
  }

  get hitEnemySound() {
    return this.#hitEnemySound;
  }

  get hitPlayerSound() {
    return this.#hitPlayerSound;
  }

  get missileImg() {
    return this.#missileImg;
  }

  get musicVolume() {
    return this.#musicVolume;
  }

  get shipSprite() {
    return this.#shipSprite;
  }

  get shotSound() {
    return this.#shotSound;
  }

  get soundVolume() {
    return this.#soundVolume;
  }

  set backgroundImage(src) {
    this.#backgroundImage = src;
  }

  set backgroundMusic(src) {
    this.#backgroundMusic = src;
    this.#backgroundMusic.volume = this.#musicVolume;
  }

  set enemySprite(src) {
    this.#enemySprite = src;
  }

  set enemyBigSprite(src) {
    this.#enemyBigSprite = src;
  }

  set explosionSprite(src) {
    this.#explosionSprite = src;
  }

  set explosionBigSprite(src) {
    this.#explosionBigSprite = src;
  }

  set gameDefeatSound(src) {
    this.#gameDefeatSound = src;
  }

  set gameWinSound(src) {
    this.#gameWinSound = src;
  }

  set hitEnemySound(src) {
    this.#hitEnemySound = src;
    this.#hitEnemySound.volume = this.#soundVolume;
  }

  set hitPlayerSound(src) {
    this.#hitPlayerSound = src;
    this.#hitPlayerSound.volume = this.#soundVolume;
  }

  set missileImg(src) {
    this.#missileImg = src;
  }

  set shipSprite(src) {
    this.#shipSprite = src;
  }

  set shotSound(src) {
    this.#shotSound = src;
    this.#shotSound.volume = this.#soundVolume;
  }
}

export const media = new Media();
