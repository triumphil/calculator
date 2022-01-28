// TODO(spmartinelli) : add support for neg numbers
(function (){
    class Token {
        constructor(type, value) {
            this.type = type;
            this.value = value;
        }
    }

    let resultStr = document.querySelector(".result-string");
    let operators = Array.from(document.querySelectorAll(".operator")).map(element => {
        return element.innerText;
    })
    let tokens = [];
    let runningTotal = 0;
    // token = {type: symbol/number, value: string}

    let mathFunctions = {
        "+" : function (x, y) { return parseFloat(x) + parseFloat(y) },
        "-" : function (x, y) { return parseFloat(x) - parseFloat(y) },
        "×" : function (x, y) { return parseFloat(x) * parseFloat(y) },
        "÷" : function (x, y) { return parseFloat(x) / parseFloat(y) }
    }
        
    function evaluateResultStr(str) {
        let strOperands = str.match(/\d+/g);
        let strOperators = str.match(/\D/g);
        
        for (let i; strOperators.length>0; ) {
            if (strOperators.includes("×") || strOperators.includes("÷")) {
                i = strOperators.findIndex(op => op === "×" || op === "÷")
            } else if (strOperators.includes("+") || strOperators.includes("-")) {
                i = strOperators.findIndex(op => op === "+" || op === "-")
            }
            let result = mathFunctions[strOperators[i]](strOperands[i],strOperands[i+1]);
            runningTotal += result;
            strOperators = strOperators.slice(0,i).concat(strOperators.slice(i+1))
            strOperands = strOperands.slice(0,i).concat(`${result}`).concat(strOperands.slice(i+2))
            resultStr.innerText = result
        }
    }

    function buttonController(event) {
        let inputChar = event.target.innerText;
        if (!isNaN(inputChar)) {
            if (resultStr.innerText === "0") {
                resultStr.innerText = inputChar;
            } else {
                resultStr.innerText += inputChar;
            }
        } else if (inputChar === document.querySelector(".clear").innerText) {
            resultStr.innerText = "0";
        } else if (inputChar === document.querySelector(".back").innerText) {
            resultStr.innerText = resultStr.innerText.slice(0,-1);
            if (resultStr.innerText === "") {
                resultStr.innerText = "0"
            }
        } else if (operators.includes(inputChar)) { 
            if (operators.includes(resultStr.innerText.slice(-1))) {
                resultStr.innerText = resultStr.innerText.replace(resultStr.innerText.slice(-1), inputChar)
            } else {
                resultStr.innerText += inputChar;
            }
        } else if (inputChar === "=") { 
            evaluateResultStr(resultStr.innerText);
        }
    }

    function handleButtonClick(value){  
        console.log("handle click top level ", tokens)
        if (isNaN(parseInt(value))) {
            console.log("symbol here, ", value)
            handleSymbol(value);
        } else {
            console.log("number here ",value)
            handleNumber(value);
        }
        reRender();
    }

    function handleNumber(value){
        if (!tokens.length) {
            tokens.push(new Token("number",value));
        } else {
            if (tokens[tokens.length - 1].type == "number") {
                if (tokens.map(t => t.value).join("") == "0") {
                    tokens[tokens.length - 1] = new Token("number", value);
                } else {
                    console.log("here")
                    tokens[tokens.length - 1].value += value;
                }
            } else {
                tokens.push(new Token("number", value));
            }
        }
    }

    function handleSymbol(value){
        if (operators.includes(value)) {
            if (value == "-") {
                if (!tokens.length || tokens[tokens.length - 1].type == "symbol") {
                    tokens.push(new Token("number", value));
                } else {
                    tokens.push(new Token("symbol", value));
                }
            } else {
                if (tokens.length) {
                    if (tokens[tokens.length - 1].type == "number" && tokens[tokens.length - 1].value != "-" ) {
                        tokens.push(new Token("symbol", value));
                    } else {
                        if (tokens[tokens.length - 1].type == "symbol") {
                            tokens[tokens.length - 1] = new Token("symbol", value);
                        }
                    }
                } 
            }
        } else if (value == "=") {
            evaluateTokens();
        }
    }

    function reRender(){
        resultStr.innerText = runningTotal || tokens.map(t => t.value).join("");
    }

    function evaluateTokens() {
        let operands = tokens.filter(t => t.type == "number").map(t => t.value);
        let operators = tokens.filter(t => t.type == "symbol").map(t => t.value);
        console.log("operands: ",operands);
        console.log("operators: ", operators);
        
        for (let i; operators.length>0; ) {
            if (operators.includes("×") || operators.includes("÷")) {
                i = operators.findIndex(op => op === "×" || op === "÷")
            } else if (operators.includes("+") || operators.includes("-")) {
                i = operators.findIndex(op => op === "+" || op === "-")
            }
            let result = mathFunctions[operators[i]](operands[i],operands[i+1]);
            runningTotal = result;
            console.log("result: ",result)
            operators = operators.slice(0,i).concat(operators.slice(i+1))
            operands = operands.slice(0,i).concat(`${result}`).concat(operands.slice(i+2))
        }
        tokens = [new Token("number", runningTotal)];
        runningTotal = null;
    }

    document.querySelector(".buttons").addEventListener("click",(event)=>{
        handleButtonClick(event.target.innerText)
    });
})();