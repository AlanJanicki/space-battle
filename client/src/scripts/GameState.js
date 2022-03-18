export const INIT_ENEMY_INTERVAL = 2000;
export const INIT_ENEMY_SPEED = 0.5;

class GameState {
  #actualLevel;
  #enemyInterval;
  #enemySpeed;
  #playerLives = 3;
  #playerScore = 0;
  #pointsToWin;
  #shotInterval = 800;

  resetPlayerStats() {
    this.#playerLives = 3;
    this.#playerScore = 0;
  }

  get actualLevel() {
    return this.#actualLevel;
  }

  get enemyInterval() {
    return this.#enemyInterval;
  }

  get enemySpeed() {
    return this.#enemySpeed;
  }

  get playerLives() {
    return this.#playerLives;
  }

  get playerScore() {
    return this.#playerScore;
  }

  get pointsToWin() {
    return this.#pointsToWin;
  }

  get shotInterval() {
    return this.#shotInterval;
  }

  set actualLevel(level) {
    this.#actualLevel = level;
  }

  set enemyInterval(interval) {
    this.#enemyInterval = interval;
  }

  set enemySpeed(speed) {
    this.#enemySpeed = speed;
  }

  set playerLives(lives) {
    this.#playerLives = lives;
  }

  set playerScore(score) {
    this.#playerScore = score;
  }

  set pointsToWin(points) {
    this.#pointsToWin = points;
  }
}

export const gameState = new GameState();
