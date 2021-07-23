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

// window.addEventListener("load", refresh);
// TODO need to specify one-operand calculations, like sqr root, sqr etc

allOperands.forEach((operand) =>
  operand.addEventListener("click", (e) => {
    let buttonValue = e.target.innerText;
    numberInput(buttonValue);
    update();

    allOperators.forEach((operator) =>
      operator.addEventListener("click", (e) => {
        let operatorValue = e.target.innerText;
        operatorInput(operatorValue);
      })
    );
  })
);

// to get the input values
function numberInput(num) {
  const { value, incomingSecondOperand } = calculator;
  if (incomingSecondOperand === true) {
    calculator.value = num;
    calculator.incomingSecondOperand = false;
  } else {
    calculator.value = value === "0" ? num : value + num;
  }
}
function update() {
  inputDisplay.value = calculator.value;
}
function defaultDisplay() {
  calculator.value = "";
  update();
}
function output() {
  if (calculator.value == null) {
    outputDisplay.innerText = `${calculator.firstOperand} ${calculator.operator}`;
  } else {
    outputDisplay.innerText = `${calculator.firstOperand} ${calculator.operator} ${calculator.value} =`;
  }
}
function twoOperandCalculation(firstOperand, operator, secondOperand) {
  const first = parseFloat(firstOperand);
  const second = parseFloat(secondOperand);
  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "÷":
      return first / second;
  }
  return second;
}
// to accept the operator, store the 1st operand and prepare for second operand
function operatorInput(op) {
  const { firstOperand, value, operator } = calculator;
  const input = parseFloat(calculator.value);
  //   checking 1st operand and if it is okay, append it to obj
  if (firstOperand === null && !isNaN(input)) {
    calculator.firstOperand = input;
    calculator.incomingSecondOperand = true;
  } else if (operator) {
    const result = twoOperandCalculation(firstOperand, operator, value);
    calculator.value = result;
    calculator.firstOperand = result;
  }
  calculator.incomingSecondOperand = true;
  calculator.operator = op;
  console.log(calculator);
  defaultDisplay();
  output();
}
