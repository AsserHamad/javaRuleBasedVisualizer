let variables =  bars = [];
let min = max = 0;

function Variable(name, type, value) {
    this.name = name;
    this.type = type;
    this.value = value;
}

function moveBars(name, value){
    checkMinMax();
    let id = setInterval(frame, 5);
    let width = Math.floor($(`#${name}`).width() / $(`#${name}`).parent().width() * 100);
    let targetWidth = Math.floor((value/max)*100);
    function frame() {
        if (width > targetWidth) {
            width--;
            $(`#${name}`).width(`${width}%`);
        } else if (width < targetWidth) {
            width++; 
            $(`#${name}`).width(`${width}%`);
        } else clearInterval(id);
    }
}

function checkMinMax(){
    max = 0;
    let vars = variables.filter((variable) => variable.type == 'int' || variable.type == 'float');
    for(let variable of vars)
        max = (variable.value > max) ? variable.value : max;
    console.log(`max: ${max}`,)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function evaluateValue(argument){
    console.log(`argument coming in ${argument}`)
    //Integer
    if(argument.match(/^[0-9]+$/)){
        return parseInt(argument.match(/^[0-9]+$/)[0]);
    }
    //Float
    else if(argument.match(/^[0-9]+\.[0-9]+$/)){
        return parseFloat(argument.match(/^[0-9]+\.[0-9]+$/)[0]);
    }
    //Boolean
    else if(argument.match(/^true|false$/)){
        return argument.match(/^true|false$/)[0] == 'true';
    }
    //String
    else if(argument.match(/^"[a-zA-Z0-9+=-_ '\/\\]"/)){
        return argument.substring(1, value.length-2);
    }
    //Variable
    else if(argument.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)){
        for(let variable of variables){
            if(variable.name == argument.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)[0])
                return variable.value;
        }
    }
    //TODO: Functions
    //Operation
    else {
        let arguments = argument.split(/ *\+|-|\*|\/|==|>=|<=|!= */);
        console.log(argument)
        for(let i = 0; i < argument.slength; i++){
            arguments[i] = evaluateValue(arguments[i]);
        }
        let operands = argument.match(/\+|-|\*|\/|==|>=|<=|!=/g);
        console.log('argument: ', argument, arguments, operands)
        let total;
        for(let i = 0; i < operands.length; i++){
            if(i == 0) total = evaluateValue(arguments[i]);
            switch(operands[i]){
                case '+': total += evaluateValue(arguments[i+1]); break;
                case '-': total -= evaluateValue(arguments[i+1]); break;
                case '*': total *= evaluateValue(arguments[i+1]); break;
                case '/': total /= evaluateValue(arguments[i+1]); break;
                case '==': total = total == evaluateValue(arguments[i+1]); break;
                case '!=': total = total != evaluateValue(arguments[i+1]); break;
                case '>=': total = total >= evaluateValue(arguments[i+1]); break;
                case '<=': total = total <= evaluateValue(arguments[i+1]); break;
            }
        }
        return total;
    }
}