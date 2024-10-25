// Nothing fancy, just an interesting problem to solve to replicate Apple's behaviour of their calculator 

document.addEventListener("DOMContentLoaded", event => {
  const display = document.getElementById("calculator-display");
  const time = document.getElementById("time");
  const buttons = document.querySelectorAll(".calculator-button");

  let firstOperand = null;
  let secondOperand = null;
  let currentOperation = null;
  let shouldResetDisplay = null;

  // update time every second
  const updateTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    time.textContent = `${hours}:${minutes}`;
  }

  updateTime();
  setInterval(updateTime, 1000);

  // function to handle number and decimal input
  const inputNumber = (number) => {
    if (shouldResetDisplay) {
      display.textContent = number === "." ? "0." : number;
      shouldResetDisplay = false;
    } else {
      if (number === "." && display && display.textContent.includes(".")) {
        return;
      }
      if (display.textContent === "0" && number !== "."){
        display.textContent = number;
      } else {
        display.textContent += number;
      }
    }
  };

  // handle operator input 
  const handleOperator = (operator) => {
    const currentValue = parseFloat(display.textContent);
    if (currentOperation && shouldResetDisplay) {
      currentOperation = operator;
      return;
    }
    if (firstOperand === null){
      firstOperand = currentValue;
    } else if (currentOperation) {
      const result = operate(currentOperation, firstOperand, currentValue);
      display.textContent = roundResult(result);
      firstOperand = result;
    }

    currentOperation = operator;
    shouldResetDisplay = true;
  }

  const operate = (operator, a, b) => {
    switch(operator){
      case "add":
        return a + b;
      case "subtract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        return b === 0 ? "Error" : a / b;
      default:
        return b;
    }
  }

  const roundResult = (number) => {
    return Math.round(number)
  };

  const calculate = () => {
    if (currentOperation === null || shouldResetDisplay){
      return;
    }

    const secondOperandValue = parseFloat(display.textContent);
    const result = operate(currentOperation, firstOperand, secondOperandValue);
    display.textContent = roundResult(result);
    firstOperand = result;
    currentOperation = null;
    shouldResetDisplay = true;
  };

  const clear = () => {
    display.textContent = "0";
    firstOperand = 0;
    secondOperand = 0;
    currentOperation = 0;
    shouldResetDisplay = false;
  }

  const togglePosNeg = () => {
    const currentValue = parseFloat(display.textContent);
    if (currentValue === 0){
      return;
    }

    display.textContent = (currentValue * -1).toString();
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action");
      const value = button.getAttribute("data-value");

      if(value){
        // handle number of decimal input
        inputNumber(value);
      } else if (action){
        switch(action){
          case "add":
          case "subtract":
          case "multiply":
          case "divide":
              handleOperator(action);
              break;
          case "equals":
            calculate();
            break;
          case "clear":
            clear();
            break;
          case "pos-neg":
            togglePosNeg();
            break;
          case "percent":
            percentage();
            break;
          default:
            break;
        }
      }
    })
  })

});