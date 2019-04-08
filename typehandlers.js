const identifierss = {
    int: '^[0-9]+$',
    double: '^[0-9]+(\.[0-9]+)?$',
    float: '^[0-9]+(\.[0-9]+)?$',
    String: '^"([0-9a-zA-Z]*[-!$%^&*#%^()_+|~=`@{}:";<>?,./]*)*"$',
    boolean: '^true|false$'
};

const handler = function(type, name, value, variables){
    let duplicate = variableExists(name, variables);
    if (duplicate) 
        return duplicate;
    let match = new RegExp(identifierss[type], 'i');
    console.log(`testing ${match} with ${value}`)
    if(!match.test(value)){
        return {
            error: {
                message: `Incorrect value for ${type}`
            }
        }
    } else {
        //Remove Quotes
        if(type == 'String')
            value = value.slice(1, value.length-1);
        
        return {
            name: name,
            value: value,
            type: type
        }
    };
}

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

module.exports = handler;