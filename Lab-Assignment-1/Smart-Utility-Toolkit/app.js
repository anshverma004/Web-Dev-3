const isEven = require("./modules/isEven");
const logger = require("./modules/logger");

logger.log("Testing isEven module...");

const testNumbers = [4, 7, 12, 19, 0];

testNumbers.forEach((num) => {
  const check = isEven(num);
  logger.log(`Is ${num} even? -> ${check}`);
});
