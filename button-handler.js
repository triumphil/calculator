let resultStr = document.querySelector(".result-string");
let operators = Array.from(document.querySelectorAll(".operator")).map(element => {
    return element.innerText;
})

let mathFunctions = {
    "+" : function (x, y) { return parseInt(x) + parseInt(y) },
    "-" : function (x, y) { return parseInt(x) - parseInt(y) },
    "×" : function (x, y) { return parseInt(x) * parseInt(y) },
    "÷" : function (x, y) { return parseInt(x) / parseInt(y) }
}
    
function evaluateResultStr(str){
    let strOperands = str.match(/\d+/g);
    let strOperators = str.match(/\D/g);
    
    for (let i; strOperators.length>0; ){
        if (strOperators.includes("×") || strOperators.includes("÷")){
            i = strOperators.findIndex(op => op === "×" || op === "÷")
        }
        else if (strOperators.includes("+") || strOperators.includes("-")){
            i = strOperators.findIndex(op => op === "+" || op === "-")
        }
        let result = mathFunctions[strOperators[i]](strOperands[i],strOperands[i+1]);
        strOperators = strOperators.slice(0,i).concat(strOperators.slice(i+1))
        strOperands = strOperands.slice(0,i).concat(`${result}`).concat(strOperands.slice(i+2))
        resultStr.innerText = result
    }
}

function buttonController(event){
    if (!isNaN(event.target.innerText)){
        if (resultStr.innerText === "0"){
            resultStr.innerText = event.target.innerText;
        }
        else {
            resultStr.innerText += event.target.innerText;
        }
    }
    else if (event.target.innerText === document.querySelector(".clear").innerText) {
        resultStr.innerText = "0";
    }
    else if (event.target.innerText === document.querySelector(".back").innerText) {
        resultStr.innerText = resultStr.innerText.slice(0,-1);
        if (resultStr.innerText === "") {
            resultStr.innerText = "0"
        }
    }
    else if (operators.includes(event.target.innerText)){ 
        if (resultStr.innerText === "0"){
            return;
        }
        if (operators.includes(resultStr.innerText.slice(-1))){
            return
        }
        resultStr.innerText += event.target.innerText;
    }
    else if (event.target.innerText === "="){ 
        evaluateResultStr(resultStr.innerText);
    }
}

document.querySelector(".buttons").addEventListener("click",(event)=>{
    buttonController(event)
});