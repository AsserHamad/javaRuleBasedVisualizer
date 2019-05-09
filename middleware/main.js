let variables = [],
    attributes = [],
    constructors = [],
    functions = [],
    sequence = [];

function Variable(name, type, value) {
    this.name = name;
    this.type = type;
    this.value = value;
}

function Sequence(type, details){
    this.type = type;
    this.details = details;
};

const Main = (main, atts, consts, funcs) => {
    attributes = atts, constructors = consts, functions = funcs;
    handleLogic(main);
    let ifs = main.match(/if\(.+\){.*}/g);
    let whiles = main.match(/while\(.+\){.*}/g);
    let fors = main.match(/for\(.+\){.*}/g);
    let lines = main.split(';');
    
    // let count = 0;
    // for (let line of lines) {
    //     count++;
    //     switch (getTypeOfQuery(line)){
    //         case 'declaration': declarationHandler(line); break;
    //         case 'func': functionHandler(line); break;
    //         case 'staticFunc': staticFunctionHandler(line);break;
    //         case 'assignment': assignmentHandler(line); break;
    //     }
    // }
    return {
        variables
    }
};

function handleLogic(statement){
    let ifs = statement.match(/if\([a-zA-Z0-9+-=\(\) !]*\)/g);
    for(let _if of ifs){
        console.log('---------------------------------------IF-----------------------------------------')
        console.log(_if);
        let condition = _if.substring(3, _if.length-1);
        console.log('condition', condition);
        let startIndex = statement.indexOfEnd(_if), counter = 0, endIndex;
        for(let i = startIndex; i < statement.length; i++){
            if(statement[i] == '{')
                counter++;
            else if(statement[i] == '}')
                counter--;
            if(counter == 0){
                endIndex = i;
                break;
            }
        }
        console.log('start index', startIndex, ' endIndex', endIndex);
        let block = statement.substring(startIndex+1, endIndex);
        console.log('block', block);
        console.log(statement.replace(`${_if}{${block}}`, `[if,${condition},${block}]`));
    }
}

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
            console.log('new variable', variable);
        }
    }
}

function functionHandler(line) {
    console.log('function called');
}

function staticFunctionHandler(line) {
    console.log('static function called');
}

function assignmentHandler(line) {
    console.log('assignment called');
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

String.prototype.indexOfEnd = function(string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
}

module.exports = Main;