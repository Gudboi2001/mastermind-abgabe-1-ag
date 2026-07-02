'use strict';
/** routes/games.js (Stand A) – ein Spiel, Tip abgeben. REST API v1.0.0 */
const express = require('express');
const router = express.Router();
const gameStore = require('../gameStore');
const mm = require('../mastermind');

router.post('/', (req, res) => {
  const game = gameStore.createGame();
  res.status(201).json({ gameId: game.id, codeLength: mm.CODE_LENGTH, colors: mm.COLORS });
});
router.get('/:id', (req, res) => {
  const game = gameStore.getGame(req.params.id);
  if (!game) return res.status(404).json({ error: 'Spiel nicht gefunden.' });
  res.json(game.toPublic());
});
router.post('/:id/guesses', (req, res) => {
  const game = gameStore.getGame(req.params.id);
  if (!game) return res.status(404).json({ error: 'Spiel nicht gefunden.' });
  const guess = (req.body && req.body.guess) || null;
  const valid = mm.validateGuess(guess);
  if (!valid.ok) return res.status(400).json({ error: valid.error });
  const result = game.play(guess);
  if (result.error) return res.status(409).json({ error: result.error });
  res.json(result);
});
module.exports = router;
