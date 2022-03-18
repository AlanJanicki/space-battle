import { canvas } from './Canvas';

export class Sprite {
  #spriteImage;
  #height;
  #numberOfSprite;
  #offset;
  #width;

  constructor(spriteImage, width, height, numberOfSprite, offset) {
    this.#spriteImage = spriteImage;
    this.#width = width;
    this.#height = height;
    this.#numberOfSprite = numberOfSprite;
    this.#offset = offset;
  }

  draw() {
    canvas.context.drawImage(
      this.#spriteImage,
      this.#numberOfSprite * this.#width,
      0,
      this.#width,
      this.#height,
      this.#offset.x,
      this.#offset.y,
      this.#width,
      this.#height
    );
  }

  get numberOfSprite() {
    return this.#numberOfSprite;
  }

  get offset() {
    return this.#offset;
  }

  get height() {
    return this.#height;
  }

  get width() {
    return this.#width;
  }

  set numberOfSprite(number) {
    this.#numberOfSprite = number;
  }

  set offset(offset) {
    this.#offset = offset;
  }

  set spriteImage(src) {
    this.#spriteImage = src;
  }

  set height(height) {
    this.#height = height;
  }

  set width(width) {
    this.#width = width;
  }
}
