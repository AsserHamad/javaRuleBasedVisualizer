function construct(name, call){
    let parameters = call.match(/\([a-zA-Z0-9" \.+-=/,\(\)]*\)$/)[0];
    parameters = listOfParameters(parameters.substring(1, parameters.length-1));
    for(let i = 0; i < parameters.length; i++)
        parameters[i] = evaluateValue(parameters[i]);
    let tempVars = variables;
    let constr = constructors.filter((constr) => {
        let params = constr.parameters;
        let bool = true;
        if(parameters.length != params.length)
            return false;
        for(let i = 0; i < params.length; i++){
            bool &= sameType(params[i].type, parameters[i]);
        }
        return bool;
    })[0];
    variables = [];
    for(let i = 0; i < constr.parameters.length; i++){
        let param = constr.parameters[i];
        variables.push(new Variable(param.name, param.type, parameters[i]));
    }
    for(let i = 0; i < constr.parameters.length; i++){
        let param = constr.parameters[i];
        variables.push(new Variable(`this.${param.name}`, param.type, null));
    }
    runConstructor(constr, 0);
    let obj = new Variable(name, 'Test', {});
    let st = `<div id="${name}_vars">`;
    for(let variable of variables){
        if(variable.name.match(/this\.[a-zA-Z0-9]+/)){
            variable.name = variable.name.replace(/ *this\./, '');
            obj.value[variable.name] = variable.value;
            st += `<h5>${variable.name}: ${obj.value[variable.name]}`
        }
    }
    st += '</div>'
    tempVars.push(obj);
    emptyTempVariables();
    variables = tempVars;

    $('#data_objects').html($('#data_objects').html() + 
        `<div class="object" id=${obj.name}>
            <h1>Test Object</h1>
            <h3>name: ${obj.name}</h3>
            ${st}
        </div>`
    )
}

function runConstructor(constr, count){
    let currStatement = constr.code[count];
    if(!currStatement)
        return '';
    switch(currStatement.type){
        case 'declaration': declarationHandler(currStatement); break;
        case 'assignment': assignmentHandler(currStatement); break;
        case 'stfunc' : staticfunctionHandler(currStatement); break;
        case 'if': ifHandler(currStatement, count); setNextClick(count); break;
        case 'endif': count = endIfHandler(currStatement, count); break;
        case 'while': whileHandler(currStatement, count); break;
        case 'endwhile': count = endWhileHandler(currStatement, count); break;
        case 'for': break;
    }
    return runFunction(constr, count+1);
}

function listOfParameters(statement){
    let parameters = [];
    let counter = 0;
    for(let i = 0; i < statement.length; i++){
        if(statement[i] == ',' && counter == 0){
            let parameter = statement.substring(0, i+1);
            statement = statement.replace(parameter, '');
            parameter = parameter.substring(0, parameter.length-1);
            parameters.push(parameter);
            i = 0;
        } else if(statement[i] == '('){
            counter++;
        } else if(statement[i] == ')'){
            counter--;
        }
    }
    parameters.push(statement);
    return parameters;
}