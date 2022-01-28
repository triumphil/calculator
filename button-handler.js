(function (){
    class Token {
        constructor(type, value) {
            this.type = type;
            this.value = value;
        }
    }

    let resultStr = document.querySelector(".result-string");
    let tokens = [];
    let runningTotal = 0;
    let mathFunctions = {
        "+" : function (x, y) { return parseFloat(x) + parseFloat(y) },
        "-" : function (x, y) { return parseFloat(x) - parseFloat(y) },
        "×" : function (x, y) { return parseFloat(x) * parseFloat(y) },
        "÷" : function (x, y) { return parseFloat(x) / parseFloat(y) }
    }

    function handleButtonClick(value){  
        if (isNaN(parseInt(value))) {
            handleSymbol(value);
        } else {
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
                    tokens[tokens.length - 1].value += value;
                }
            } else {
                tokens.push(new Token("number", value));
            }
        }
    }

    function handleSymbol(value){
        switch (value) {
            case "-":
                if (!tokens.length || tokens[tokens.length - 1].type == "symbol") {
                    tokens.push(new Token("number", value));
                } else {
                    if (tokens[tokens.length - 1].type == "number" && tokens[tokens.length - 1].value != "-") {
                        tokens.push(new Token("symbol", value));
                    }
                }
                break;
            case "+":
            case "×":
            case "÷":
                if (tokens.length) {
                    if (tokens[tokens.length - 1].type == "number") {
                        if (tokens[tokens.length - 1].value != "-") {
                            tokens.push(new Token("symbol", value));
                        } 
                    } else {
                        if (tokens[tokens.length - 1].type == "symbol") {
                            tokens[tokens.length - 1] = new Token("symbol", value);
                        }
                    }
                }
                break;
            case "C":
                tokens = [];
                break;
            case "←":
                tokens = tokens.map((t,i) => { 
                    if (i == tokens.length - 1) {
                        t.value = t.value.slice(0,-1);
                    }
                    return t;
                }).filter(t => t.value.length);
                break;
            case "=":
                evaluateTokens();
                break;
            
        }
    }

    function reRender(){
        resultStr.innerText = tokens.map(t => t.value).join("") || "0";
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
            console.log(`Performing the [${operators[i]}] operation on the following operands: [${operands[i]}, ${operands[i+1]}]`)
            runningTotal = mathFunctions[operators[i]](operands[i],operands[i+1]);
            operators = operators.slice(0,i).concat(operators.slice(i+1))
            operands = operands.slice(0,i).concat(`${runningTotal}`).concat(operands.slice(i+2))
        }
        tokens = [new Token("number", runningTotal.toString())];
        runningTotal = 0;
    }

    document.querySelector(".buttons").addEventListener("click",(event)=>{
        handleButtonClick(event.target.innerText)
    });
})();