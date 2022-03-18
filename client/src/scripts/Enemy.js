import { CANVAS_WIDTH } from './Canvas';
import { game } from './Game';
import { gameState } from './GameState';
import { media } from './Media';
import { SHIP_WIDTH } from './Ship';
import { Sprite } from './Sprite';

const ENEMY_INIT_OFFSET_X = SHIP_WIDTH / 2;
const ENEMY_INIT_OFFSET_Y = 15;
const ENEMY_INIT_SPRITE_NUMBER = 0;
export const ENEMY_HEIGHT = 32;
export const ENEMY_BIG_HEIGHT = 64;
export const ENEMY_WIDTH = 32;
export const ENEMY_BIG_WIDTH = 64;
export const EXPLOSION_HEIGHT = 64;
export const EXPLOSION_BIG_HEIGHT = 128;
export const EXPLOSION_WIDTH = 64;
export const EXPLOSION_BIG_WIDTH = 128;

export class Enemy extends Sprite {
  static #initOffsetY = ENEMY_INIT_OFFSET_X;
  static #initOffsetX = ENEMY_INIT_OFFSET_Y;
  #isBig;
  #isExploded = false;
  #isShot = false;
  #lives;

  constructor(spriteImage, width, height, numberOfSprite, offset, isBig, lives) {
    super(spriteImage, width, height, numberOfSprite, offset);
    this.#isBig = isBig;
    this.#lives = lives;
  }

  draw() {
    super.draw();
  }

  animate() {
    this.numberOfSprite++;

    if (this.#isBig && this.#lives > 0) {
      if (this.numberOfSprite > 7) {
        this.numberOfSprite = 0;
      }
    } else if (this.#lives > 0) {
      if (this.numberOfSprite > 4) {
        this.numberOfSprite = 0;
      }
    } else {
      if (this.numberOfSprite > 16) {
        this.numberOfSprite = 0;
        this.#isExploded = true;
      }
    }

    this.offset = { ...this.offset, y: this.offset.y + gameState.enemySpeed };
  }

  static generateEnemies() {
    const randomNumber = Math.floor(Math.random() * 11 + 1);
    let isBig = Boolean(randomNumber % 2);

    const enemy = new Enemy(
      isBig ? media.enemyBigSprite : media.enemySprite,
      isBig ? ENEMY_BIG_WIDTH : ENEMY_WIDTH,
      isBig ? ENEMY_BIG_HEIGHT : ENEMY_HEIGHT,
      ENEMY_INIT_SPRITE_NUMBER,
      {
        x: this.#initOffsetY,
        y: this.#initOffsetX,
      },
      isBig,
      isBig ? 3 : 1
    );

    isBig
      ? (this.#initOffsetY = Math.floor(
          Math.random() * (CANVAS_WIDTH - ENEMY_BIG_WIDTH * 1.5 - ENEMY_INIT_OFFSET_X) +
            ENEMY_INIT_OFFSET_X
        ))
      : (this.#initOffsetY = Math.floor(
          Math.random() * (CANVAS_WIDTH - ENEMY_WIDTH * 1.5 - ENEMY_INIT_OFFSET_X) +
            ENEMY_INIT_OFFSET_X
        ));

    game.enemies.push(enemy);
  }

  get isBig() {
    return this.#isBig;
  }

  get isExploded() {
    return this.#isExploded;
  }

  get lives() {
    return this.#lives;
  }

  set isShot(state) {
    this.#isShot = state;
  }

  set lives(amount) {
    this.#lives = amount;
  }
}
