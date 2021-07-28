const outputDisplay = document.querySelector(".output-value");
const inputDisplay = document.querySelector("#input-value");
// buttons
const percentageButton = document.querySelector(".percentage-button");
const plusMinusButton = document.querySelector(".buttonplusminus");
const ceButton = document.querySelector(".ce-button");
const cButton = document.querySelector(".c-button");
const backspaceButton = document.querySelector(".backspace-button");
const divideByXButton = document.querySelector(".divide-by-x-button");
const squareButton = document.querySelector(".sqr-button");
const squareRootButton = document.querySelector(".sqr-root-button");
const divisionButton = document.querySelector(".division-button");
const multiplicationButton = document.querySelector(".multiplication-button");
const subtractionButton = document.querySelector(".subtraction-button");
const additionButton = document.querySelector(".addition-button");
const equalButton = document.querySelector(".equal-button");
const allOperands = document.querySelectorAll(".operand");
const allOperators = document.querySelectorAll(".operator");

// TODO fix double dot in operator.value

const calculator = {
  value: "0",
  firstOperand: null,
  incomingSecondOperand: false,
  operator: null,
};
const pastCalculator = {
  firstOperand: null,
  operator: null,
  secondOperand: null,
};
window.addEventListener("load", clearC);

allOperands.forEach((operand) =>
  operand.addEventListener("click", (e) => {
    operandValue = e.target.innerText;
    inputValues(operandValue);
    display();
    if (operand.classList.contains("buttonpoint")) {
      const decimal = e.target.innerText;
      inputDecimal(decimal);
    }
    console.log(calculator);
    console.log(pastCalculator);
  })
);
allOperators.forEach((operator) =>
  operator.addEventListener("click", (e) => {
    const operatorValue = e.target.innerText;
    console.log(operatorValue);
    switch (operatorValue) {
      case "÷":
      case "×":
      case "-":
      case "+":
      case "%":
      case "=":
        inputOperatorTwoOperands(operatorValue);
        break;
      case "CE":
        if (calculator.operator == "=") {
          break;
        } else {
          clearEntryCE();
          break;
        }
      case "C":
        clearC();
        break;
      case "⅟ₓ":
      case "x²":
      case "²√ₓ":
        inputOneOperatorOneOperand(operatorValue);
    }
    console.log(calculator);
    console.log(pastCalculator);
  })
);

backspaceButton.addEventListener("click", () => {
  if (calculator.operator == "=") {
    return;
  } else {
    backspace();
  }
});
plusMinusButton.addEventListener("click", () => {
  if (calculator.operator == "=") {
    return;
  } else {
    plusMinus();
    outputLiveDisplay();
  }
});

function display() {
  inputDisplay.value = calculator.value;
}
// updates value or appends it to value str
function inputValues(num) {
  const { incomingSecondOperand, value } = calculator;
  if (incomingSecondOperand === true) {
    calculator.value = num;
    calculator.incomingSecondOperand = false;
  } else {
    calculator.value = value === "0" ? num : value + num;
  }
}
function inputDecimal(dot) {
  if (calculator.incomingSecondOperand === true) {
    calculator.value = "0.";
    calculator.incomingSecondOperand = false;
    return;
  }
  if (!calculator.value.includes(dot)) {
    calculator.value += dot;
  }
}

function inputOneOperatorOneOperand(op) {
  calculator.incomingSecondOperand = false;
  const { firstOperand, value, operator } = calculator;
  const input = parseFloat(value);
  calculator.firstOperand = value;
  pastCalculator.firstOperand = value;
  pastCalculator.secondOperand = null;
  calculator.operator = pastCalculator.operator = op;
  const result =
    Math.round(
      (calculationOneOperand(calculator.firstOperand, calculator.operator) +
        Number.EPSILON) *
        100000000000000
    ) / 100000000000000;
  if (result == Infinity) {
    calculator.value = "0";
    pastCalculator.firstOperand = null;
    outputDisplay.innerText = "Error";
  } else {
    calculator.value = String(result);
    display();
    outputLiveDisplay();
    calculator.firstOperand = null;
    calculator.value = result;
    pastCalculator.firstOperand = result;
    calculator.operator = null;
  }
  // pastCalculator.operator = null;
}
function calculationOneOperand(firstOperand, operator) {
  parseFloat(firstOperand);
  switch (operator) {
    case "⅟ₓ":
      return parseFloat(1 / firstOperand);
    case "x²":
      return parseFloat(Math.pow(firstOperand, 2));
    case "²√ₓ":
      return parseFloat(Math.sqrt(firstOperand));
  }
}
function inputOperatorTwoOperands(op) {
  const { firstOperand, value, operator } = calculator;
  const input = parseFloat(value);
  if (operator && calculator.incomingSecondOperand) {
    calculator.operator = op;
    pastCalculator.operator = op;
    outputLiveDisplay();
    return;
  }
  if (firstOperand === null && !isNaN(input)) {
    calculator.firstOperand = input;
    pastCalculator.firstOperand = input;
    outputLiveDisplay();
  } else if (operator) {
    // if operator exists, copies it to the backup obj and calculates result, rounded to 2 decimals
    pastCalculator.operator = calculator.operator;
    const xsecondOperand = parseFloat(value);
    pastCalculator.secondOperand = xsecondOperand;
    const result =
      Math.round(
        (calculationTwoOperands(firstOperand, xsecondOperand, operator) +
          Number.EPSILON) *
          100
      ) / 100;
    calculator.value = String(result);
    outputLiveDisplay();
    calculator.firstOperand = result;
    pastCalculator.firstOperand = result;
    display();
  }
  pastCalculator.secondOperand = null;
  calculator.incomingSecondOperand = true;
  calculator.operator = op;
  // used to bypass operator change on equal
  if (op !== "=") {
    pastCalculator.operator = op;
  }
  console.log(calculator);
}
function calculationTwoOperands(firstOperand, secondOperand, operator) {
  parseFloat(secondOperand);
  switch (operator) {
    case "+":
      return firstOperand + secondOperand;
      break;
    case "-":
      return firstOperand - secondOperand;
      break;
    case "×":
      return firstOperand * secondOperand;
      break;
    case "÷":
      return firstOperand / secondOperand;
      break;
    case "%":
      return ((firstOperand / secondOperand) * 100) / 100;
  }
  return secondOperand;
}
function clearEntryCE() {
  // clears current entry
  if (calculator.firstOperand && calculator.value) {
    calculator.value = "";
    pastCalculator.firstOperand = calculator.firstOperand;
  } else if (calculator.firstOperand === null && calculator.value) {
    calculator.value = "";
    pastCalculator.firstOperand = "";
  }
  outputLiveDisplay();
  display();
}

function clearC() {
  // clears all entries
  calculator.value = pastCalculator.secondOperand = "0";
  calculator.firstOperand = pastCalculator.firstOperand = null;
  calculator.operator = pastCalculator.operator = null;
  calculator.incomingSecondOperand = false;
  inputDisplay.value = "";
  outputLiveDisplay();
}
function backspace() {
  const liveValue = calculator.value;
  const editedValue = liveValue.slice(0, -1);
  calculator.value = editedValue;
  display();
  outputLiveDisplay();
}
function plusMinus() {
  // multiplies by -1 to toggle plus or minus sign before .value
  calculator.value = parseFloat(calculator.value * -1);
  display();
}

function outputLiveDisplay() {
  if (
    pastCalculator.firstOperand &&
    pastCalculator.operator === null &&
    pastCalculator.secondOperand === null
  ) {
    outputDisplay.innerText = `${pastCalculator.firstOperand}`;
  } else if (
    pastCalculator.firstOperand &&
    pastCalculator.operator &&
    pastCalculator.secondOperand === null
  ) {
    if (pastCalculator.operator == "⅟ₓ") {
      outputDisplay.innerText = `1/(${pastCalculator.firstOperand})`;
    } else if (pastCalculator.operator == "x²") {
      outputDisplay.innerText = `sqr(${pastCalculator.firstOperand})`;
    } else if (pastCalculator.operator == "²√ₓ") {
      outputDisplay.innerText = `√(${pastCalculator.firstOperand})`;
    } else {
      outputDisplay.innerText = `${pastCalculator.firstOperand} ${pastCalculator.operator}`;
    }
  } else if (
    pastCalculator.firstOperand &&
    pastCalculator.operator &&
    pastCalculator.secondOperand
  ) {
    outputDisplay.innerText = `${pastCalculator.firstOperand} ${pastCalculator.operator} ${pastCalculator.secondOperand} =`;
  } else {
    outputDisplay.innerText = "";
  }
}
