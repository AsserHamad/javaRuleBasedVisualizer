function declarationHandler(statement){
    let declaration = statement.declaration;
    declaration = declaration.split(' ');
    let type = declaration[0], name = declaration[1], value = "";
    for(let i = 3; i < declaration.length; i++){
        value += declaration[i];
    }
    value = statement.declaration.replace(`${type} ${name} = `, '');
    console.log(`value ${value}`)
    let variable;
    switch(type){
        case 'int': value = evaluateValue(value); checkMinMax(); variable = new Variable(name, type, value); addNumber(variable); break;
        case 'float': value = evaluateValue(value); checkMinMax(); variable = new Variable(name, type, value); addNumber(variable); break;
        case 'boolean': value = evaluateValue(value); variable = new Variable(name, type, value); addBoolean(variable); break;
        case 'String': value = value.substring(1, value.length-2); variable = new Variable(name, type, value); addString(variable); break;
    }

    $('#statement').html(statement.declaration);
    $('#subtitle').html(`Declaration of a new variable <span id="name">${name}</span> with value <span id="value">${value}</span>`)
}

function addNumber(variable){
    variables.push(variable);
    $('#data_numbers').html(
        $('#data_numbers').html() + `
        <div class="row">
            <div class="col-xs-2 text-right"><h4>${variable.name}</h4></div>
            <div class="col-xs-10">
                <div class="myProgress">
                    <div class="myBar" id="${variable.name}">${variable.value}</div>
                </div>
            </div>
        </div>`);
    let red = getRandomInt(200), green = getRandomInt(200), blue = getRandomInt(200);
    $(`#${variable.name}`).css('background-color', `rgba(${red},${green},${blue})`);

    let vars = variables.filter((variable) => variable.type == 'int' || variable.type == 'float');
    for(let variable of vars)
        moveBars(variable.name, variable.value);
}

function addString(variable){
    variables.push(variable);
    $('#data_strings').html(
        $('#data_strings').html() + `
        <div class="row center-block">
            <div class="col-xs-2 text-right center-block"><h4>${variable.name}</h4></div>
            <div class="col-xs-10 text-left center-block">
                <h5>${variable.value}</h5>
            </div>
        </div>`);
}

function addBoolean(variable){
    variables.push(variable);
    $('#data_bools').html(
        $('#data_bools').html() + `
        <div class="row center-block">
            <div class="col-xs-2 text-right center-block"><h4>${variable.name}</h4></div>
            <div class="col-xs-10 text-left center-block">
                <h5>${variable.value}</h5>
            </div>
        </div>`);
}