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
// values
let a = "";
let b = "";

const calculator = {
  value: "0",
  firstOperand: null,
  secondOperand: null,
  incomingSecondOperand: false,
  operator: null,
};

// window.addEventListener("load", refresh);

allOperands.forEach((operand) =>
  operand.addEventListener("click", (e) => {
    let buttonValue = e.target.innerText;
    numberInput(buttonValue);
    update();
    console.log(calculator);

    allOperators.forEach((operator) =>
      operator.addEventListener("click", (e) => {
        let operatorValue = e.target.innerText;
        operatorInput(operatorValue);
        console.log(calculator);
      })
    );
    // console.log(buttonValue);
    // console.log(e.target.value);
    // getOperand(buttonValue);
    // a += buttonValue;
    // inputDisplay.value = parseFloat(a);
    // console.log(a);
  })
);

// to get the input values
function numberInput(num) {
  const { value } = calculator;
  calculator.value = value === "0" ? num : value + num;
}
function update() {
  inputDisplay.value = calculator.value;
}
function defaultDisplay() {
  calculator.value = "";
  update();
}
function output() {
  if (calculator.secondOperand == null) {
    outputDisplay.innerText = `${calculator.firstOperand} ${calculator.operator}`;
  } else {
    outputDisplay.innerText = `${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand} '='`;
  }
}
// to accept the operator, store the 1st operand and prepare for second operand
function operatorInput(op) {
  const { firstOperand, value, operator } = calculator;
  const input = parseFloat(calculator.value);
  //   checking 1st operand and if it is okay, append it to obj
  if (firstOperand === null && !isNaN(input)) {
    calculator.firstOperand = input;
  }
  calculator.incomingSecondOperand = true;
  calculator.operator = op;
  defaultDisplay();
  output();
}
