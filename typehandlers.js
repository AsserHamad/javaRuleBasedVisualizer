const identifiers = [{
    name: 'int',
    regex: '[0-9]+',
}]

const inthandler = function(line, variables){
    const name = line[1];
    const value = line[3];
    let duplicate = variableExists(name, variables);
    if (duplicate) 
        return duplicate;
    if(!/^[0-9]+$/.test(value)){
        return {
            error: {
                message: "Incorrect value for int"
            }
        }
    } else {
        return {
            name: name,
            value: value
        }
    };
}

let handlers = {int: inthandler};

//Helper Functions
function variableExists(varName, variables){
    for(let variable of variables){
        if(variable.name == varName)
            return {
              error: {
                message: 'duplicate variable'
              }
            };
    }
    return false;

}

module.exports = handlers;