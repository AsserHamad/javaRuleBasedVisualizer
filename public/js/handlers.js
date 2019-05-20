let variables =  bars = attributes = constructors = functions = stfunctions = main = [];
// let attributes = constructors = functions = stfunctions = main = []; 
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

function sameType(type, argument){
    switch(type){
        case 'int': return Number.isInteger(argument); break;
        case 'float': return typeof argument == 'number'; break;
        case 'String': return typeof argument == 'string'; break;
        case 'boolean': return typeof argument == 'boolean'; break;
        //TODO: Add test and Array
    }
}

function checkMinMax(){
    max = 0;
    let vars = variables.filter((variable) => variable.type == 'int' || variable.type == 'float');
    for(let variable of vars)
        max = (variable.value > max) ? variable.value : max;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function evaluateValue(argument){
    // console.log(argument);
    argument = evaluateParenthesisFirst(argument) + '';
    //Integer
    if(argument.match(/^ *[0-9]+ *$/)){
        return parseInt(argument.match(/[0-9]+/)[0]);
    }
    //Float
    else if(argument.match(/^ *[0-9]+\.[0-9]+ *$/)){
        return parseFloat(argument.match(/[0-9]+\.[0-9]+/)[0]);
    }
    //Boolean
    else if(argument.match(/^ *(true|false) *$/)){
        return argument.match(/true|false/)[0] == 'true';
    }
    //String
    else if(argument.match(/^ *"[a-zA-Z0-9+=-_ '\/\\]+" */)){
        return argument.match(/"[a-zA-Z0-9+=-_ '\/\\]+"/)[0].substring(1, argument.length-2);
    }
    //Attribute
    else if(argument.match(/^ *[a-zA-Z_]\.[a-zA-Z_0-9]* *$/)){
        argument = argument.split('.');
        let name = argument[0];
        for(let variable of variables){
            if(variable.name == name){
                console.log(argument, name, variable)
                return variable.value[argument[1]];
            }
        }
    }
    //Variable
    else if(argument.match(/^ *[a-zA-Z_][a-zA-Z_0-9]* *$/)){
        for(let variable of variables){
            if(variable.name == argument.match(/[a-zA-Z_][a-zA-Z_0-9]*/)[0])
                return variable.value;
        }
    }
    //Static Functions
    else if(argument.match(/^ *[a-zA-Z_][a-zA-Z_0-9]*\([a-zA-Z0-9" \.+-=/,\(\)]*\) *$/)){
        return staticfunctionHandler({type: 'stfunc', call: argument.match(/[a-zA-Z_][a-zA-Z_0-9]*\([a-zA-Z0-9" \.+-=/,\(\)]*\)/)[0]});
    }
    //Operation
    //TODO: Add modulus
    else {
        let arguments = argument.split(/ *\+|-|\*|\/|>=|<=|==|>|<|!=|\|\||&& */i);
        for(let i = 0; i < argument.slength; i++){
            arguments[i] = evaluateValue(arguments[i]);
        }
        let operands = argument.match(/\+|-|\*|\/|>=|<=|==|>|<|!=|\\|\||&&/i);
        console.log('arguments', arguments,'operands', operands)
        let total;
        for(let i = 0; i < operands.length; i++){
            if(i == 0) total = evaluateValue(arguments[i]);
            switch(operands[i]){
                case '+': total += evaluateValue(arguments[i+1]); break;
                case '-': total -= evaluateValue(arguments[i+1]); break;
                case '*': total *= evaluateValue(arguments[i+1]); break;
                case '/': total /= evaluateValue(arguments[i+1]); break;
                case '>=': total = total >= evaluateValue(arguments[i+1]); break;
                case '<=': total = total <= evaluateValue(arguments[i+1]); break;
                case '>': total = total > evaluateValue(arguments[i+1]); break;
                case '<': total = total < evaluateValue(arguments[i+1]); break;
                case '==': total = total == evaluateValue(arguments[i+1]); break;
                case '!=': total = total != evaluateValue(arguments[i+1]); break;
                case '&&': total = total && evaluateValue(arguments[i+1]); break;
                case '||': total = total || evaluateValue(arguments[i+1]); break;
            }
        }
        return total;
    }
}

function evaluateParenthesisFirst(argument){
    if(typeof argument != 'string' || !argument.match(/(^\()| \(/))
    return argument;
    
    let index = argument.search(/(^\()| \(/i);
    if(argument[index] == ' ')
        index++;
    
    count = 0;
    statement = "";
    for(let i = index; i < argument.length; i++){
        
        if(argument[i] == '('){
            count++;
        }
        else
        if(argument[i] == ')'){
            count--;
        }

        if(count == 0){
            statement = argument.substring(index+1, i);
            argument = argument.replace(argument.substring(index, i+1), evaluateValue(statement));
            argument = evaluateParenthesisFirst(argument);
            break;
        }
    }
    return argument;
}

function insertArrayAt(array, index, arrayToInsert) {
    Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
}