class Step{
    constructor(previousOperand, currentOperand, operation){
        this.previousOperand = previousOperand;
        this.currentOperand = currentOperand;
        this.operation = operation;
    }
}



class Calculator {



    constructor(previousOperandTextElement, currentOperandTextElement, dataLogsTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.dataLogsTextElement = dataLogsTextElement;
      this.steps = [];
      this.history = [];
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
  
    appendNumberWithPosition(number, position) {
      let step = this.getCurrentStep();
      if (isNaN(number))
      {
         if (number === '.' && step.currentOperand.includes('.')) return;
      }


      if (step.currentOperand.length >= this.maxDigitAmount) return;
      //if (number === '.' && step.currentOperand.includes('.')) return;

      let currentOperand = step.currentOperand;


      console.log(`caret pos: ${position}`);
      currentOperand = `${currentOperand.toString().substring(0, position)}${number.toString()}${currentOperand.toString().substring(position, currentOperand.length)}`;
      console.log(currentOperand);
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

      dataLogsTextElement.innerHTML += `${prev} ${currentStep.operation} ${current} = ${computation}<br>`;

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
      this.currentOperandTextElement.value =
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

    performInput(event){
        let step = this.getCurrentStep();
        let symbol = event.key;
        let position = this.currentOperandTextElement.selectionStart;
        if (isNaN(symbol))
        {
           if (symbol === ',' || symbol === '.')
           {
               if (!step.currentOperand.includes('.'))
               {
                   this.appendNumberWithPosition('.', position);
               }
           }
           else if (this.isOperation(symbol))
           {
                this.chooseOperation(symbol);
           }
           else if (symbol === 'Enter' || symbol === '=')
           {
               this.calculate();
           }
        }
        else
        {            
            this.appendNumberWithPosition(symbol, position);
        }
        event.preventDefault();
    }

    cut(event)
    {
        let currentStep = this.getCurrentStep();
        let newStep = new Step(currentStep.previousOperand, currentOperandTextElement.value, currentStep.operation);
        this.addStep(newStep);
    }
  }
  
  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  function removeAllHTMLTags(text)
  {
      return text.replace(/(<([^>]+)>)/ig, '');
  }

  const numberButtons = document.querySelectorAll('[data-number]')
  const operationButtons = document.querySelectorAll('[data-operation]')
  const equalsButton = document.querySelector('[data-equals]')
  const deleteButton = document.querySelector('[data-delete]')
  const allClearButton = document.querySelector('[data-all-clear]')
  const redoButton = document.querySelector('[data-redo]');
  const undoButton = document.querySelector('[data-undo]');
  const clearLogsButton = document.querySelector('[data-clear-logs]');
  const downloadLogsButton = document.querySelector('[data-download-logs]');
  const previousOperandTextElement = document.querySelector('[data-previous-operand]')
  const currentOperandTextElement = document.getElementById('data-current-operand')
  const dataLogsTextElement = document.querySelector('[data-logs]')

  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, dataLogsTextElement)
  
  currentOperandTextElement.addEventListener('keypress', (event) => {
      calculator.performInput(event);
      calculator.updateDisplay();
  })

  currentOperandTextElement.addEventListener('cut', (event) => {
      setTimeout(function()
      {
        calculator.cut(event)
      }, 10);
    calculator.updateDisplay();
})

  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendNumberWithPosition(button.innerText, currentOperandTextElement.selectionStart)
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

clearLogsButton.addEventListener('click', button => {
    dataLogsTextElement.innerHTML = '';
})

downloadLogsButton.addEventListener('click', button => {
    download('history.txt', removeAllHTMLTags(dataLogsTextElement.innerHTML));
})