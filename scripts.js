class Step{
    constructor(previousOperand, currentOperand, operation){
        this.previousOperand = previousOperand;
        this.currentOperand = currentOperand;
        this.operation = operation;
    }
}



class Calculator {



    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.steps = [];
      this.pointer = -1;
      this.maxDigitAmount = 15;
      this.clear()
    } 
  
    addStep(step){
        this.steps.push(step);
        this.pointer++;
    }

    getCurrentStep(){
        return this.steps[this.pointer];
    }

    clear() {
        this.clearUndo();
        this.addStep(new Step('', '', undefined));
    }
  
    delete() {
        let step = this.getCurrentStep();
        let currentOperand = step.currentOperand;
        currentOperand = currentOperand.toString().slice(0, -1);
        this.clearUndo();
        this.addStep(new Step(step.previousOperand, currentOperand, step.operation));
    }
  
    appendNumber(number) {
      let step = this.getCurrentStep();

      if (step.currentOperand.length >= this.maxDigitAmount) return;
      if (number === '.' && step.currentOperand.includes('.')) return;

      let currentOperand = step.currentOperand;
      currentOperand = currentOperand.toString() + number.toString()
      this.addStep(new Step(step.previousOperand, currentOperand, step.operation));
      this.clearUndo();
    }
  
    chooseOperation(operation) {
        this.clearUndo();
      let step = this.getCurrentStep();
      
      if (step.currentOperand === '') return
      if (step.previousOperand !== '') {
        this.compute()
      }

      this.addStep(new Step(step.currentOperand, '', operation))
    }
  
    compute() {
        
      let computation 
      let currentStep = this.getCurrentStep();

      const prev = parseFloat(currentStep.previousOperand)
      const current = parseFloat(currentStep.currentOperand)

      if (isNaN(prev) || isNaN(current)) return '';

      switch (currentStep.operation) {
        case '+':
          computation = prev + current
          break
        case '-':
          computation = prev - current
          break
        case '*':
          computation = prev * current
          break
        case '÷':
          computation = prev / current
          break
        default:
          return '';
      }
      return computation;
    }

    calculate()
    {
        this.clearUndo();
        let computation = this.compute();
        this.addStep(new Step('', computation, undefined));
    }

    isOperation(operation){
        return operation === '+' || operation === '-' || operation === '/' || operation === '*' || operation === '÷';
    }

    getDisplayNumber(number) { 
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('ru', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() {
      let currentStep = this.getCurrentStep();
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(currentStep.currentOperand)
      if (currentStep.operation != null) {
        this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(currentStep.previousOperand)} ${currentStep.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }

    redo(){
        if (this.pointer < this.steps.length - 1 && this.isInUndo)
        {
            this.pointer++;
            this.compute();
        }
    }

    undo(){
        if (this.pointer > 0)
        {
            this.isInUndo = true;
            this.pointer--;
            this.compute();
        }
    }

    clearUndo()
    {
        if (this.isInUndo)
        {
            this.isInUndo = false;
            if (this.pointer < this.steps.length)
            {
                this.steps.splice(this.pointer + 1, this.steps.length);
            }
        }
    }
  }
  
  
  const numberButtons = document.querySelectorAll('[data-number]')
  const operationButtons = document.querySelectorAll('[data-operation]')
  const equalsButton = document.querySelector('[data-equals]')
  const deleteButton = document.querySelector('[data-delete]')
  const allClearButton = document.querySelector('[data-all-clear]')
  const redoButton = document.querySelector('[data-redo]');
  const undoButton = document.querySelector('[data-undo]');
  const previousOperandTextElement = document.querySelector('[data-previous-operand]')
  const currentOperandTextElement = document.querySelector('[data-current-operand]')
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
  
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
    })
  })
  
  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
    })
  })
  
  equalsButton.addEventListener('click', button => {
    calculator.calculate()
    calculator.updateDisplay()
  })
  
  allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
  })
  
  deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
  })

  redoButton.addEventListener('click', button => {
      calculator.redo();
      calculator.updateDisplay();
  })

  undoButton.addEventListener('click', button => {
    calculator.undo();
    calculator.updateDisplay();
})