'use strict';
/** gameStore.js (Stand A) – Verwaltung des Spiels. */
const crypto = require('crypto');
const mm = require('./mastermind');

class Game {
  constructor() {
    this.id = crypto.randomUUID();
    this.secret = mm.generateSecret();
    this.attempts = 0;
    this.history = [];
    this.solved = false;
  }
  play(guess) {
    if (this.solved) return { error: 'Spiel bereits gewonnen.' };
    const r = mm.evaluateGuess(this.secret, guess);
    this.attempts++;
    this.history.push({ guess, black: r.black, white: r.white });
    return { gameId: this.id, attempts: this.attempts, black: r.black, white: r.white, solved: r.solved };
  }
  toPublic() {
    return { gameId: this.id, attempts: this.attempts, solved: this.solved, history: this.history };
  }
}
class GameStore {
  constructor() { this.games = new Map(); }
  createGame() { const g = new Game(); this.games.set(g.id, g); return g; }
  getGame(id) { return this.games.get(id) || null; }
}
module.exports = new GameStore();
module.exports.Game = Game;
