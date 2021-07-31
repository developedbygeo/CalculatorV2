// displays
const outputDisplay = document.querySelector(".output-value");
const inputDisplay = document.querySelector("#input-value");
// buttons
const additionButton = document.querySelector(".addition-button");
const subtractionButton = document.querySelector(".subtraction-button");
const multiplicationButton = document.querySelector(".multiplication-button");
const divisionButton = document.querySelector(".division-button");
const plusMinusButton = document.querySelector(".buttonplusminus");
const backspaceButton = document.querySelector(".backspace-button");
const equalButton = document.querySelector(".equal-button");
const dotButton = document.querySelector(".buttonpoint");
const allOperands = document.querySelectorAll(".operand");
const allOperators = document.querySelectorAll(".operator");

// TODO Fix bug with square root and then two-op calculation

// calculator stores the current values and calculations take place based on its properties
const calculator = {
  value: "0",
  firstOperand: null,
  incomingSecondOperand: false,
  operator: null,
  incomingDecimal: true,
};
// the past calculator is mainly there for the outputDisplay and outputLiveDisplay
const pastCalculator = {
  firstOperand: null,
  operator: null,
  secondOperand: null,
};

// Event Listeners

window.addEventListener("load", clearC);

document.addEventListener("keypress", (e) => {
  const pressedKey = e.key;
  const operandsRegex = new RegExp(/[0-9]/);
  const operatorsRegex = new RegExp(/[+\-\*\.\/]/);
  if (operandsRegex.test(pressedKey) == true) {
    allOperands.forEach((operand) => {
      if (operand.innerText == pressedKey) {
        operand.click();
      }
    });
  } else if (operatorsRegex.test(pressedKey) == true) {
    switch (pressedKey) {
      case ".":
        dotButton.click();
        break;
      case "+":
        additionButton.click();
        break;
      case "-":
        subtractionButton.click();
        break;
      case "*":
        multiplicationButton.click();
        break;
      case "/":
        divisionButton.click();
        break;
    }
  } else if (pressedKey == "Enter") {
    equalButton.click();
  } else if (pressedKey == "Delete") {
    backspaceButton.click();
  }
});

allOperands.forEach((operand) =>
  operand.addEventListener("click", (e) => {
    toggleDecimal();
    const operandValue = e.target.innerText;
    inputValues(operandValue);
    display();
    if (operand.classList.contains("buttonpoint")) {
      const decimal = e.target.innerText;
      inputDecimal(decimal);
      checkDecimalExists();
    }
    outputLiveDisplay();
  })
);
allOperators.forEach((operator) =>
  operator.addEventListener("click", (e) => {
    const operatorValue = e.target.innerText;
    switch (operatorValue) {
      case "÷":
      case "×":
      case "-":
      case "+":
      case "％":
      case "=":
        inputOperatorTwoOperands(operatorValue);
        checkDecimalExists();
        calculator.incomingDecimal = true;
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
  })
);

backspaceButton.addEventListener("click", () => {
  if (calculator.operator == "=") {
    return;
  } else {
    backspace();
    checkDecimalExists();
  }
});
plusMinusButton.addEventListener("click", () => {
  if (calculator.operator == "=") {
    return;
  } else {
    plusMinus();
    outputLiveDisplay();
    checkDecimalExists();
  }
});

// INPUT Functions

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
// checks whether a decimal exists and sets the incomingDecimal value accordingly
function inputDecimal(dot) {
  if (calculator.incomingSecondOperand == true) {
    calculator.value = "0.";
    display();
    calculator.incomingSecondOperand = false;
    calculator.incomingDecimal = false;
    return;
  }
  if (!calculator.value.includes(dot)) {
    calculator.incomingDecimal = true;
    calculator.value += dot;
  } else if (calculator.firstOperand && !calculator.value.includes(dot)) {
    calculator.incomingDecimal = true;
  }
  toggleDecimal();
}
// handles the operator input for one-operand operations and allows for up to 4 decimal places
// if result is infinity it errors out
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
        10000
    ) / 10000;
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
    pastCalculator.operator = null;
  }
}
// handles operator input for two-operand operations
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
    // this does not allow for the equal operator to be used without a previous proper operator in place.
    if (operator == "=" && pastCalculator.secondOperand == null) {
      pastCalculator.operator = "";
      outputDisplay.innerText = "Error";
      calculator.firstOperand = null;
      calculator.value = "";
      inputDisplay.value = "";
    } else {
      // if operator exists, copies it to the backup obj and calculates result, rounded to 2 decimals
      pastCalculator.operator = calculator.operator;
      const xsecondOperand = parseFloat(value);
      pastCalculator.secondOperand = xsecondOperand;
      const result =
        Math.round(
          (calculationTwoOperands(firstOperand, xsecondOperand, operator) +
            Number.EPSILON) *
            10000
        ) / 10000;
      calculator.value = String(result);
      // countering dividing by zero
      if (calculator.value == "NaN") {
        clearC();
        outputDisplay.innerText = "Error";
      } else {
        outputLiveDisplay();
        calculator.firstOperand = result;
        pastCalculator.firstOperand = result;
        display();
      }
    }
  }
  pastCalculator.secondOperand = null;
  calculator.incomingSecondOperand = true;
  calculator.operator = op;
  // used to bypass operator change on equal
  if (op !== "=") {
    pastCalculator.operator = op;
  }
}

// CALCULATION Functions

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
    case "％":
      return ((firstOperand / secondOperand) * 100) / 100;
  }
  return secondOperand;
}

// DISPLAY Functions

function display() {
  inputDisplay.value = calculator.value;
}
// handles the outputDisplay and differentiates between one-operand and two-operand operations
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

// ADDITIONAL Functions

// checks if decimal exists and toggles the incomingDecicmal value accordingly
function checkDecimalExists() {
  const decimal = ".";
  const strValue = String(calculator.value);
  if (strValue.indexOf(decimal) < 0) {
    calculator.incomingDecimal = true;
  } else {
    calculator.incomingDecimal = false;
  }
  toggleDecimal();
}
// disables or enables decimal button based on the key value
function toggleDecimal() {
  if (calculator.incomingDecimal == true) {
    dotButton.disabled = false;
  } else {
    dotButton.disabled = true;
  }
}
// clears current entry
function clearEntryCE() {
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

// clears all entries
function clearC() {
  calculator.value = pastCalculator.secondOperand = "0";
  calculator.firstOperand = pastCalculator.firstOperand = null;
  calculator.operator = pastCalculator.operator = null;
  calculator.incomingSecondOperand = false;
  inputDisplay.value = "";
  outputLiveDisplay();
}
// clears the calculator.value's last digit
function backspace() {
  const liveValue = calculator.value;
  const editedValue = liveValue.slice(0, -1);
  calculator.value = editedValue;
  display();
  outputLiveDisplay();
}
// multiplies by -1 to toggle plus or minus sign before .value
function plusMinus() {
  calculator.value = parseFloat(calculator.value * -1);
  display();
}
