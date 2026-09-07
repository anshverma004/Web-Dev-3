const crypto = require("crypto");

function rollDice() {
  return crypto.randomInt(1, 7);
}

const singleRoll = rollDice();
console.log(`Dice Rolled: ${singleRoll}`);

console.log("\nSimulating 5 consecutive dice rolls:");
for (let i = 1; i <= 5; i++) {
  console.log(`Roll ${i}: ${rollDice()}`);
}
