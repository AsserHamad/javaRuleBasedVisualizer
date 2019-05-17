function whileHandler(statement){
    let condition = evaluateValue(statement.condition);
    let block = (condition) ? statement.block.slice() : null;
    if(block == null)
        return;
    
    let rand = Math.floor(Math.random()*10000);
    let red = getRandomInt(200), green = getRandomInt(200), blue = getRandomInt(200);
    $('#ifs').html($('#ifs').html() + 
        `<div class="row while" id="${rand}" style="background-color: rgb(${red}, ${green}, ${blue});">
            <p class="statement">While loop in place</p>
            <p class="subtitle"><b>${condition}</b></p>

        </div>`
    );
    $('#statement').html("");
    $('#subtitle').html("");
    block.push({
        type: 'endwhile',
        condition,
        variables: variables.slice(),
        rand,
        count
    });
    insertArrayAt(main.sequence, count+1, block);
}

//TODO: Break statement
function endWhileHandler(statement, count){
    let condition = evaluateValue(statement.condition);
    if(condition){
        $('#statement').html("While condition still true!");
        $('#subtitle').html("");
        return statement.count;
    }
    $(`#${statement.rand}`).remove();
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