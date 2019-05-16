function functionHandler(statement){
    console.log('func', statement);
    // let declaration = statement.declaration;
    // declaration = declaration.split(' ');
    // let type = declaration[0], name = declaration[1], value = "";
    // for(let i = 3; i < declaration.length; i++){
    //     value += declaration[i];
    // }
    // value = value.substring(0, value.length-1);
    // console.log(`value ${value}`)
    // let variable;
    // switch(type){
    //     case 'int': value = evaluateValue(value); checkMinMax(); variable = new Variable(name, type, value); addNumber(variable); break;
    //     case 'float': value = evaluateValue(value); checkMinMax(); variable = new Variable(name, type, value); addNumber(variable); break;
    //     case 'boolean': value = evaluateValue(value); variable = new Variable(name, type, value); addBoolean(variable); break;
    //     case 'String': value = value.substring(1, value.length-2); variable = new Variable(name, type, value); addString(variable); break;
    // }

    // $('#statement').html(statement.declaration);
    // $('#subtitle').html(`Declaration of a new variable <span id="name">${name}</span> with value <span id="value">${value}</span>`)
}



//------------------------------------- STATIC ------------------------------------------------//
function staticfunctionHandler(statement){
    let call = statement.call
    let operands = call.match(/\([a-zA-Z0-9" \.+-=/,\(\)]*\)$/)[0];
    let funcs = stfunctions.filter((func) => func.name == call.replace(operands, ''));
    operands = listOfOperands(operands.substring(1, operands.length-1));
    for(let i = 0; i < operands.length; i++)
        operands[i] = evaluateValue(operands[i]);
    let func = funcs.filter((func) => {
        let params = func.parameters;
        let bool = true;
        if(operands.length != params.length)
            return false;
        for(let i = 0; i < params.length; i++){
            bool &= sameType(params[i].type, operands[i]);
        }
        return bool;
    })[0];
    console.log(func, operands);

    $('#statement').html(statement.call);
    $('#subtitle').html(`Calling the static function <span id="name">${func.name}</span>`)
    return 1;
}

function listOfOperands(statement){
    let operands = [];
    let counter = 0;
    for(let i = 0; i < statement.length; i++){
        if(statement[i] == ',' && counter == 0){
            let operand = statement.substring(0, i+1);
            statement = statement.replace(operand, '');
            operand = operand.substring(0, operand.length-1);
            operands.push(operand);
            i = 0;
        } else if(statement[i] == '('){
            counter++;
        } else if(statement[i] == ')'){
            counter--;
        }
    }
    operands.push(statement);
    return operands;
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