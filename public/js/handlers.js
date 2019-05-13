let variables =  bars = [];
let min = max = 0;

// HANDLERS
function declarationHandler(statement){
    let declaration = statement.declaration;
    declaration = declaration.split(' ');
    let type = declaration[0], name = declaration[1], value = declaration[3].substring(0, declaration[3].length-1);
    switch(type){
        case 'int': value = parseInt(value); checkMinMax(value); break;
        case 'double': value = parseDouble(value); checkMinMax(value); break;
        case 'float': value = parseDouble(value); checkMinMax(value); break;
        case 'String': value = value.substring(1, value.length-2); break;
    }

    $('#data').html(
        $('#data').html() + `<div id="${name}" data-value="${value}" style="width:200px;height:40px"></div>`
    )
    console.log(`value: ${value}`)
    let ldbar = {
        // ldbar: new ldBar(`#${name}`, {
        //         "stroke": '#f00',
        //         "min": min,
        //         "max": max,
        //         "value": value
        //     }),
        ldbar: new ldBar(document.querySelector(`#${name}`)),
        name: name
    };
    bars.push(ldbar);
    ldbar.ldbar.set(value);
    $('#statement').html(statement.declaration);
    $('#subtitle').html(`Declaration of a new variable <span id="name">${name}</span> with value <span id="value">${value}</span>`)
}
function assignmentHandler(statement){
    let assignment = statement.assignment;
    assignment = assignment.split(' ');
    let name = assignment[0], value = assignment[2].substring(0, assignment[2].length-1);
    let variable = variables.filter((variable) => (variable.name == name))[0];
    switch(variable.type){
        case 'int': value = parseInt(value); checkMinMax(value); break;
        case 'double': value = parseDouble(value); checkMinMax(value); break;
        case 'float': value = parseDouble(value); checkMinMax(value); break;
        case 'String': value = value.substring(1, value.length-2); break;
    }
    // let b = document.querySelector(`#${name}`);
    let b = bars.filter((bar) => bar.name == name)[0].ldbar;
    b.set(30);
    // setInterval(function() {
    //   b.set(Math.round(Math.random() * 100));
    // }, 1500);
    console.log(b);

    $('#statement').html(statement.assignment);
    $('#subtitle').html(`Assigning variable <span id="name">${name}</span> with value <span id="value">${value}</span>`);
}

function checkMinMax(num){
    max = (num > max) ? num : max;
    min = (num < min) ? num : min;
    console.log(`min: ${min}, max: ${max}`)
}
