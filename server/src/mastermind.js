'use strict';
/**
 * mastermind.js
 * Kern-Spiellogik von Mastermind (Arbeitspaket A).
 * Reine Logik ohne HTTP/Storage -> gut testbar und wiederverwendbar.
 */

// Die sechs erlaubten Farben laut Aufgabenstellung.
const COLORS = ['rot', 'orange', 'gelb', 'grün', 'blau', 'violet'];
const CODE_LENGTH = 4;

/**
 * Erzeugt einen zufälligen, geordneten Farbcode der Länge CODE_LENGTH.
 * Farben dürfen mehrfach vorkommen (klassische Mastermind-Variante).
 * @returns {string[]} z.B. ['rot','blau','rot','gelb']
 */
function generateSecret() {
  const secret = [];
  for (let i = 0; i < CODE_LENGTH; i++) {
    const idx = Math.floor(Math.random() * COLORS.length);
    secret.push(COLORS[idx]);
  }
  return secret;
}

/**
 * Prüft, ob ein Tip syntaktisch gültig ist.
 * @param {any} guess
 * @returns {{ok:boolean, error?:string}}
 */
function validateGuess(guess) {
  if (!Array.isArray(guess)) {
    return { ok: false, error: 'Tip muss ein Array von Farben sein.' };
  }
  if (guess.length !== CODE_LENGTH) {
    return { ok: false, error: `Tip muss genau ${CODE_LENGTH} Farben enthalten.` };
  }
  for (const c of guess) {
    if (typeof c !== 'string' || !COLORS.includes(c)) {
      return { ok: false, error: `Ungültige Farbe: "${c}". Erlaubt: ${COLORS.join(', ')}.` };
    }
  }
  return { ok: true };
}

/**
 * Wertet einen Tip gegen den geheimen Code aus.
 * black  = richtige Farbe an richtiger Position
 * white  = richtige Farbe an falscher Position
 * Behandelt korrekt Mehrfachfarben (jede Position wird nur einmal gezählt).
 * @param {string[]} secret
 * @param {string[]} guess
 * @returns {{black:number, white:number, solved:boolean}}
 */
function evaluateGuess(secret, guess) {
  let black = 0;
  // Zähle verbleibende Farben für die White-Berechnung.
  const secretRest = {};
  const guessRest = {};

  for (let i = 0; i < CODE_LENGTH; i++) {
    if (secret[i] === guess[i]) {
      black++;
    } else {
      secretRest[secret[i]] = (secretRest[secret[i]] || 0) + 1;
      guessRest[guess[i]] = (guessRest[guess[i]] || 0) + 1;
    }
  }

  let white = 0;
  for (const color of Object.keys(guessRest)) {
    if (secretRest[color]) {
      white += Math.min(guessRest[color], secretRest[color]);
    }
  }

  return { black, white, solved: black === CODE_LENGTH };
}

module.exports = {
  COLORS,
  CODE_LENGTH,
  generateSecret,
  validateGuess,
  evaluateGuess,
};
