function assignmentHandler(statement){
    let assignment = statement.assignment;
    assignment = assignment.split(' ');
    let name = assignment[0], value = "";
    for(let i = 2; i < assignment.length; i++){
        value += assignment[i];
    }
    let variable = variables.filter((variable) => (variable.name == name))[0];
    value = evaluateValue(value);
    checkMinMax();
    variables[variables.indexOf(variable)].value = value;
    
    let vars = variables.filter((variable) => variable.type == 'int' || variable.type == 'float');
    $(`#${name}`).html(value);
    for(let variable of vars)
        moveBars(variable.name, variable.value);

    $('#statement').html(statement.assignment);
    $('#subtitle').html(`Assigning variable <span id="name">${name}</span> with value <span id="value">${value}</span>`);
}