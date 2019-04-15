let variables = [],
    attributes = [],
    constructors = [],
    functions = [];

function Variable(name, type, value) {
    this.name = name;
    this.type = type;
    this.value = value;
}

const Main = (main, atts, consts, funcs) => {
    attributes = atts, constructors = consts, functions = funcs;
    let lines = main.split(';');
    console.log(lines);
    let count = 0;
    for (let line of lines) {
        count++;
        switch (getTypeOfQuery(line)){
            case 'declaration': declarationHandler(line); break;
            case 'func': functionHandler(line); break;
            case 'staticFunc': staticFunctionHandler(line);break;
            case 'assignment': assignmentHandler(line); break;
        }
    }
    return {
        variables
    }
};

//int x = 1;
//TODO: Split by space with no quotes around it
function declarationHandler(line){
    let snips = line.split(/\s+/);
    if(snips.length > 3){
        if(snips[3] == 'new'){
            console.log(snips);
            let params = snips[4].match(/\([a-zA-Z0-9", ._]*\)/)[0];
            params = params.substring(1, params.length-1).split(',');
            let types = params.map((param) => getParamType(param));
            for(let constructor of constructors){
                if (constructor.parameters.length == params.length){
                    let same = true;
                    for(let i = 0; i < constructor.parameters.length; i++){
                        if(types[i] != constructor.parameters[i].type)
                            same = false;
                    }
                    if(same){
                        variables.push(
                            new Variable(
                                snips[1],
                                snips[0],
                                null
                            )
                        )
                    }
                }
            }
            console.log('params', params, 'types', types);
        } else {
            let value = fuseValues(snips, 3);
            let variable = new Variable(snips[1], snips[0], value);
            variables.push(variable);
            // console.log('new variable', variable);
        }
    }
}

function functionHandler(line) {

}

function staticFunctionHandler(line) {

}

function assignmentHandler(line) {

}

function getTypeOfQuery(line){
    // int x = 0; | int x;
    if(line.match(/(int|String|double|float|Test) +[a-zA-Z0-9]+( += +[a-zA-Z0-9"]+)?/))
        return 'declaration';
    // test.sum(1, 2);
    if (line.match(/[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+\([a-zA-Z0-9, _]*\)/))
        return 'func';
    // sum(1, 2);
    if (line.match(/[a-zA-Z0-9_]+\([a-zA-Z0-9, _]*\)/))
        return 'staticFunc';
    // x = 1;
    if (line.match(/[a-zA-Z0-9]+( += +[a-zA-Z0-9" ]+)?/))
        return 'assignment';
}

//TODO: Try to get rid of this function
function fuseValues(array, begin){
    let val = "";
    for(var i = begin; i < array.length; i++){
        val = val+= array[i];
    }
    return val;
}

function getParamType(param){
    if(param.match(/"[a-zA-Z0-9_ '/?!@#$%^&*/(/)]+"/))
        return 'String';
    if(param.match(/[0-9]+\.[0-9]+/))
        return 'double';
    if(param.match(/[0-9]+/))
        return 'int';
    if(param.match(/[a-zA-Z_][a-zA-Z0-9_]*/))
        return 'variable';
}

module.exports = Main;