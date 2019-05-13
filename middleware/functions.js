let handleLogic = require('./logic');

function Parameter(name, type) {
    this.name = name;
    this.type = type;
}

function Function(name, access, parameters, returnType, static, code) {
    this.name = name;
    this.access = access;
    this.parameters = parameters;
    this.returnType = returnType;
    this.static = static;
    this.code = code;
}

let functions = [];

const Functions = (funcs) => {
    functions = [];
    getFunctions(funcs);
    return functions;
}
function getFunctions(funcs) {
    //Get Functions
    let indices = indicesOfFunctions(funcs);
    if (indices != null)
        for (let index of indices) {
            let substr = funcs.substring(index, funcs.length);
            let brackets = [];
            let end = -1;
            //To ensure at least one bracket exists
            let i = 0;
            while (true) {
                if (substr.charAt(i) == '{') {
                    brackets.push('{');
                    i++;
                    index = i;
                    break;
                }
                i++;
            }
            let constr = substr.substring(0, i - 1);
            let funcElements = dissectFunctionConstructor(constr);
            while (i < substr.length) {
                if (substr.charAt(i) == '{') {
                    brackets.push('{');
                } else if (substr.charAt(i) == '}') {
                    brackets.pop();
                }
                if (brackets.length == 0) {
                    end = i;
                    break;
                }
                i++;
            }
            let code = (index != end) ? substr.substring(index, end) : '';
            functions.push(new Function(
                    funcElements.name,
                    funcElements.access,
                    funcElements.parameters,
                    funcElements.returnType,
                    funcElements.static,
                    handleLogic(code, [])
                ));
        }
}


//Function Stuff
function indicesOfFunctions(string) {
    let indices = string.match(/(public|private|default|protected) +(static +)?(int|String|double|float|void)([])? +[a-zA-Z_][a-zA-Z0-9]*/g);
    if (indices != null)
        for (let i = 0; i < indices.length; i++) {
            indices[i] = string.indexOf(indices[i]);
        }
    return indices;
}

//public static void main(String[] args)
function dissectFunctionConstructor(string) {
    let phrases = string.match(/(public|private|default|protected) +(static +)?(int|String|double|float|void)([])? +[a-zA-Z_][a-zA-Z0-9]*/)[0].split(' ');
    let access = 'public',
        static = false,
        returnType, name;
    let parameters = getParameters(string);
    phrases.map((phrase) => {
        (phrase.match(/public|private|default|protected/i)) ? access = phrase: null;
        (phrase.match(/static/i)) ? static = true: null;
        (phrase.match(/int|String|double|float|void/i)) ? returnType = phrase: null;
    })
    name = phrases[phrases.length - 1];
    return {
        access,
        static,
        returnType,
        name,
        parameters
    }

}

function getParameters(string) {
    let params = string.match(/\(.*\)/)[0];
    params = params.match(/[a-zA-Z ,_0-9]+/g);
    if(params == null)
        return [];
    else
        params = params[0];
    let returnParams = [];
    params = params.split(',');
    params.map((param) => {
        param = param.match(/[a-zA-Z]+ [a-zA-Z_0-9]/)[0];
        param = param.split(' ');
        returnParams.push(new Parameter(param[0], param[1]));
    });
    return returnParams;
}

module.exports = Functions;