import { canvas, CANVAS_HEIGHT, GAME_BAR_OFFSET_Y } from './Canvas';
import { Common } from './Common';
import {
  Enemy,
  ENEMY_HEIGHT,
  ENEMY_BIG_HEIGHT,
  ENEMY_WIDTH,
  ENEMY_BIG_WIDTH,
  EXPLOSION_BIG_HEIGHT,
  EXPLOSION_HEIGHT,
  EXPLOSION_BIG_WIDTH,
  EXPLOSION_WIDTH,
} from './Enemy';
import { gameResult } from './GameResult';
import { gameState, INIT_ENEMY_INTERVAL, INIT_ENEMY_SPEED } from './GameState';
import { media } from './Media';
import { Missile } from './Missile';
import { Ship, SHIP_SPRITE_EMPTY_ZONE_SIZE } from './Ship';

const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const SPACE_KEY = ' ';

class Game extends Common {
  #enemies = [];
  #gameLoop;
  #gameLoopPrevTimeStamp = 0;
  #missiles = [];
  #playerMovesLeft = false;
  #playerMovesRight = false;
  #ship;

  constructor() {
    super();
    window.addEventListener('keydown', (e) => this.#handlePlayerPressKey(e));
    window.addEventListener('keyup', (e) => this.#handlePlayerReleaseKey(e));
  }

  playGame(level) {
    this.setGameState(level);
    canvas.openCanvas();
    this.#ship = new Ship();
    media.playBackgroundMusic();
    this.#runGameLoop();
  }

  pauseGame() {
    media.stopBackgroundMusic();
    window.cancelAnimationFrame(this.#gameLoop);
  }

  resumeGame() {
    media.playBackgroundMusic();
    this.#runGameLoop();
  }

  resetGame() {
    this.#enemies = [];
    this.#missiles = [];
    this.#ship.resetPosition();
    this.#gameLoopPrevTimeStamp = 0;
    gameState.resetPlayerStats();
  }

  setGameState(level) {
    gameState.actualLevel = level;
    gameState.enemyInterval = INIT_ENEMY_INTERVAL / (level / 2);
    gameState.enemySpeed = INIT_ENEMY_SPEED + level / 10;
    gameState.pointsToWin = level * 25;
  }

  #runGameLoop() {
    if (this.#enemies.length === 0) {
      Enemy.generateEnemies();
    }
    canvas.drawGameOnCanvas();
    this.#drawGameElementsOnCanvas();
    this.#handleUserPressKeys();
    this.#handleGameStatus();
  }

  #drawGameElementsOnCanvas() {
    this.#drawEnemies();
    this.#drawShip();
    this.#drawMissiles();
  }

  #drawEnemies() {
    this.#enemies.forEach((enemy) => {
      enemy.draw();
      enemy.animate();
    });
  }

  #drawShip() {
    this.#ship.draw();
    this.#ship.animate();
  }

  #drawMissiles() {
    this.#missiles.forEach((missile) => {
      missile.draw();
      missile.animate();
    });
  }

  #handlePlayerPressKey(e) {
    if (this.isVisible(canvas.element)) {
      if (e.key === ARROW_LEFT_KEY) {
        this.#playerMovesLeft = true;
      }
      if (e.key === ARROW_RIGHT_KEY) {
        this.#playerMovesRight = true;
      }
      if (e.key === SPACE_KEY) {
        if (!this.isVisible(gameResult.element)) {
          Missile.generateMissiles();
          media.playShotSound();
        }
      }
    }
  }

  #handlePlayerReleaseKey(e) {
    if (this.isVisible(canvas.element)) {
      if (e.key === ARROW_LEFT_KEY) {
        this.#playerMovesLeft = false;
      }
      if (e.key === ARROW_RIGHT_KEY) {
        this.#playerMovesRight = false;
      }
    }
  }

  #handleUserPressKeys() {
    if (this.#playerMovesLeft) {
      this.#ship.moveLeft();
    }
    if (this.#playerMovesRight) {
      this.#ship.moveRight();
    }
  }

  #handleGameStatus() {
    this.#handleEnemyHit();
    this.#handlePlayerShoot();
    this.#removeExplodedEnemy();
    this.#handleGameEnd();
  }

  #handleEnemyHit() {
    this.#enemies.forEach((enemy) => {
      if (
        enemy.offset.y + enemy.height > CANVAS_HEIGHT ||
        (enemy.offset.x >= this.#ship.offset.x &&
          enemy.offset.x <= this.#ship.offset.x + this.#ship.width &&
          enemy.offset.y + enemy.height >=
            CANVAS_HEIGHT - this.#ship.height + SHIP_SPRITE_EMPTY_ZONE_SIZE) ||
        (enemy.isBig &&
          enemy.offset.x <= this.#ship.offset.x &&
          enemy.offset.x >= this.#ship.offset.x - this.#ship.width &&
          enemy.offset.y + enemy.height >=
            CANVAS_HEIGHT - this.#ship.height + SHIP_SPRITE_EMPTY_ZONE_SIZE) ||
        (!enemy.isBig &&
          enemy.offset.x <= this.#ship.offset.x &&
          enemy.offset.x >= this.#ship.offset.x - enemy.width &&
          enemy.offset.y + enemy.height >=
            CANVAS_HEIGHT - this.#ship.height + SHIP_SPRITE_EMPTY_ZONE_SIZE)
      ) {
        media.playHitEnemySound();
        canvas.drawRedScreen();
        const enemyIndex = this.#enemies.indexOf(enemy);
        this.#enemies.splice(enemyIndex, 1);
        gameState.playerLives--;
      }
    });
  }

  #handlePlayerShoot() {
    this.#missiles.forEach((missile) => {
      if (missile.offset.y < GAME_BAR_OFFSET_Y) {
        const missileIndex = this.#missiles.indexOf(missile);
        this.#missiles.splice(missileIndex, 1);
      }

      this.#enemies.forEach((enemy) => {
        if (
          missile.offset.x + missile.width > enemy.offset.x &&
          missile.offset.x + missile.width < enemy.offset.x + enemy.width &&
          missile.offset.y < enemy.offset.y + enemy.height / 2
        ) {
          if (enemy.lives > 0) {
            const missileIndex = this.#missiles.indexOf(missile);
            this.#missiles.splice(missileIndex, 1);
          }

          enemy.isShot = true;
          enemy.lives--;

          if (enemy.lives === 0) {
            media.playHitEnemySound();
            enemy.numberOfSprite = 0;

            if (enemy.isBig) {
              this.#setEnemyExplosion(
                enemy,
                media.explosionBigSprite,
                EXPLOSION_BIG_WIDTH,
                EXPLOSION_BIG_HEIGHT,
                ENEMY_BIG_WIDTH,
                ENEMY_BIG_HEIGHT
              );
              gameState.playerScore += 3;
            } else {
              this.#setEnemyExplosion(
                enemy,
                media.explosionSprite,
                EXPLOSION_WIDTH,
                EXPLOSION_HEIGHT,
                ENEMY_WIDTH,
                ENEMY_HEIGHT
              );
              gameState.playerScore++;
            }
          }
        }
      });
    });
  }

  #setEnemyExplosion(
    enemy,
    explosionSprite,
    explosionWidth,
    explosionHeight,
    enemyWidth,
    enemyHeight
  ) {
    enemy.spriteImage = explosionSprite;
    enemy.width = explosionWidth;
    enemy.height = explosionHeight;
    enemy.offset = {
      x: enemy.offset.x - enemyWidth / 2,
      y: enemy.offset.y - enemyHeight / 2,
    };
  }

  #removeExplodedEnemy() {
    this.#enemies.forEach((enemy) => {
      if (enemy.isExploded) {
        const enemyIndex = this.#enemies.indexOf(enemy);
        this.#enemies.splice(enemyIndex, 1);
      }
    });
  }

  #handleGameEnd() {
    if (gameState.playerLives === 0) {
      this.pauseGame();
      canvas.drawBackground();
      gameResult.openResult();
      gameResult.handlePlayerDefeat();
      media.playGameDefeatSound();
    } else if (gameState.playerScore >= gameState.pointsToWin) {
      this.pauseGame();
      gameResult.openResult();
      gameResult.handlePlayerWin();
      media.playGameWinSound();
    } else {
      this.#gameLoop = window.requestAnimationFrame((timeStamp) => {
        if (this.#gameLoopPrevTimeStamp === 0) {
          this.#gameLoopPrevTimeStamp = timeStamp;
        }
        if (timeStamp - this.#gameLoopPrevTimeStamp > gameState.enemyInterval) {
          this.#gameLoopPrevTimeStamp = timeStamp;
          Enemy.generateEnemies();
        }
        this.#runGameLoop();
      });
    }
  }

  get enemies() {
    return this.#enemies;
  }

  get missiles() {
    return this.#missiles;
  }

  get ship() {
    return this.#ship;
  }
}

export const game = new Game();
