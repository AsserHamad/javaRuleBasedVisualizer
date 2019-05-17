function ifHandler(statement, count){
    let condition = evaluateValue(statement.condition);
    let block = (condition) ? statement.block.slice() : (statement.else) ? statement.else.slice() : null;
    if(block == null)
        return;
    
    let rand = Math.floor(Math.random()*10000);
    let red = getRandomInt(200), green = getRandomInt(200), blue = getRandomInt(200);
    $('#ifs').html($('#ifs').html() + 
        `<div class="row if" id="${rand}" style="background-color: rgb(${red}, ${green}, ${blue});">
            <p class="statement">If Condition in place</p>
            <p class="subtitle">condition <b>${statement.condition}</b> was <b>${condition}</b></p>

        </div>`
    );
    $('#statement').html("");
    $('#subtitle').html("");
    block.push({
        type: 'endif',
        variables: variables.slice(),
        else: !condition,
        rand,
        count
    });
    insertArrayAt(main.sequence, count+1, block);
}

function endIfHandler(statement, count){
    $(`#${statement.rand}`).remove();
    $('#statement').html("If condition ended");
    $('#subtitle').html("");
    main.sequence.splice(statement.count + 1, count-statement.count)
    variables = variables.filter((variable) => {
        for(let vari of statement.variables){
            if(variable.name == vari.name)
                return true;
        }
        $(`#_${variable.name}`).remove();
        return false;
    });

    return statement.count;
}