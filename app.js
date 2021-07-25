const outputDisplay = document.querySelector(".output-value");
const inputDisplay = document.querySelector("#input-value");
// buttons
const percentageButton = document.querySelector(".percentage-button");
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
window.addEventListener("load", outputLiveDisplay);

allOperands.forEach((operand) =>
  operand.addEventListener("click", (e) => {
    operandValue = e.target.innerText;
    inputValues(operandValue);
    display();
    if (operand.classList.contains("buttonpoint")) {
      const decimal = e.target.innerText;
      inputDecimal(decimal);
    }
  })
);
allOperators.forEach((operator) =>
  operator.addEventListener("click", (e) => {
    const operatorValue = e.target.innerText;
    inputOperator(operatorValue);
  })
);

function display() {
  inputDisplay.value = calculator.value;
}
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
  if (!calculator.value.includes(dot)) {
    calculator.value += dot;
  }
}
function inputOperator(op) {
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
    // pastCalculator.firstOperand = input;
    // outputDisplay.innerText = `${pastCalculator.firstOperand}`;
  } else if (operator) {
    // pastCalculator.operator = operator;
    // fullOutputDisplay();
    pastCalculator.operator = calculator.operator;
    const xsecondOperand = parseFloat(value);
    pastCalculator.secondOperand = xsecondOperand;
    // pastCalculator.secondOperand = xsecondOperand;
    // fullOutputDisplay();
    // updatePastCalculator();
    const result = calculationTwoOperands(
      firstOperand,
      xsecondOperand,
      operator
    );
    calculator.value = String(result);
    // pastCalculator.firstOperand = calculator.value;
    outputLiveDisplay();
    calculator.firstOperand = result;
    pastCalculator.firstOperand = result;
    display();
  }
  calculator.incomingSecondOperand = true;
  // TODO this works
  calculator.operator = op;
  if (op != "=") {
    pastCalculator.operator = op;
  }
  // outputLiveDisplay();
  // pastCalculator.operator = calculator.operator;
  // }
  // pastCalculator.firstOperand = calculator.firstOperand;
  // pastCalculator.secondOperand = null;
  // fullOutputDisplay();

  // fullOutputDisplay();
  // updatePastCalculator();
  console.log(calculator);
}
// function updatePastCalculator() {
//   calculator.firstOperand = pastCalculator.firstOperand;
//   calculator.operator = pastCalculator.operator;
//   calculator.value = pastCalculator.secondOperand;
// }
// function resetOutputValues() {
//   pastCalculator.firstOperand = calculator.value;
//   pastCalculator.operator = null;
//   pastCalculator.secondOperand = null;
// }
// function fullOutputDisplay() {
//   if (
//     pastCalculator.firstOperand &&
//     pastCalculator.operator === null &&
//     pastCalculator.secondOperand === null
//   ) {
//     outputDisplay.innerText = `${pastCalculator.firstOperand}`;
//   } else if (
//     pastCalculator.firstOperand &&
//     pastCalculator.operator &&
//     pastCalculator.secondOperand === null
//   ) {
//     outputDisplay.innerText = `${pastCalculator.firstOperand} ${pastCalculator.operator}`;
//   } else {
//     outputDisplay.innerText = `${pastCalculator.firstOperand} ${pastCalculator.operator} ${pastCalculator.secondOperand} =`;
//   }
// }
function calculationTwoOperands(firstOperand, secondOperand, operator) {
  parseFloat(secondOperand);
  if (operator === "+") {
    return firstOperand + secondOperand;
  } else if (operator === "-") {
    return firstOperand - secondOperand;
  } else if (operator === "×") {
    return firstOperand * secondOperand;
  } else if (operator === "÷") {
    return firstOperand / secondOperand;
  }
  return secondOperand;
}
function reset() {
  calculator.value = "0";
  calculator.firstOperand = null;
  calculator.operator = null;
  calculator.incomingSecondOperand = false;
}
function outputLiveDisplay() {
  // TODO could run on interval
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
    outputDisplay.innerText = `${pastCalculator.firstOperand} ${pastCalculator.operator}`;
  } else if (
    pastCalculator.firstOperand &&
    pastCalculator.operator &&
    pastCalculator.secondOperand
  ) {
    outputDisplay.innerText = `${pastCalculator.firstOperand} ${pastCalculator.operator} ${pastCalculator.secondOperand} =`;
  }
}
