import { CANVAS_WIDTH } from './Canvas';
import { media } from './Media';
import { Sprite } from './Sprite';

const SHIP_HEIGHT = 64;
export const SHIP_INIT_OFFSET_Y = 416;
export const SHIP_SPRITE_EMPTY_ZONE_SIZE = 10;
const SHIP_INIT_SPRITE_NUMBER = 0;
export const SHIP_WIDTH = 64;
const SHIP_INIT_OFFSET_X = 320 - SHIP_WIDTH / 2;

export class Ship extends Sprite {
  constructor() {
    super(media.shipSprite, SHIP_WIDTH, SHIP_HEIGHT, SHIP_INIT_SPRITE_NUMBER, {
      x: SHIP_INIT_OFFSET_X,
      y: SHIP_INIT_OFFSET_Y,
    });
  }

  draw() {
    super.draw();
  }

  animate() {
    this.numberOfSprite++;

    if (this.numberOfSprite > 7) {
      this.numberOfSprite = 0;
    }
  }

  moveRight() {
    if (this.offset.x > CANVAS_WIDTH - SHIP_WIDTH) {
      return;
    }
    this.offset = { ...this.offset, x: this.offset.x + 10 };
  }

  moveLeft() {
    if (this.offset.x < 0) {
      return;
    }
    this.offset = { ...this.offset, x: this.offset.x - 10 };
  }

  resetPosition() {
    this.offset = { ...this.offset, x: SHIP_INIT_OFFSET_X };
  }
}
