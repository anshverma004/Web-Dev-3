const args = process.argv.slice(2);

if (args.length < 3) {
  console.log("Usage: node calculator.js <operation> <num1> <num2>");
  console.log("Supported operations: add, sub, mult, div");
  process.exit(1);
}

const operation = args[0].toLowerCase();
const num1 = parseFloat(args[1]);
const num2 = parseFloat(args[2]);

if (isNaN(num1) || isNaN(num2)) {
  console.log("Error: Both arguments must be valid numbers.");
  process.exit(1);
}

let result;

switch (operation) {
  case "add":
    result = num1 + num2;
    break;
  case "sub":
    result = num1 - num2;
    break;
  case "mult":
    result = num1 * num2;
    break;
  case "div":
    if (num2 === 0) {
      console.log("Error: Division by zero is not allowed.");
      process.exit(1);
    }
    result = num1 / num2;
    break;
  default:
    console.log(
      `Error: Unknown operation '${operation}'. Use add, sub, mult, or div.`,
    );
    process.exit(1);
}

console.log(`Result: ${result}`);
