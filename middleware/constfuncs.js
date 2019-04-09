function Variable(name, type, value){
    this.name = name;
    this.type = type;
    this.value = value;
}

function Parameter(name, type){
    this.name = name;
    this.type = type;
}

function Function(name, access, parameters, returnType, static, code){
    this.name = name;
    this.access = access;
    this.parameters = parameters;
    this.returnType = returnType;
    this.static = static;
    this.code = code;
}

let attributes = [];
let functions = [];

const constfuncs = (cf) => {
    cf = cf.replace(/\r|\n/g, '');
    getAttributes(cf);
    console.log('Attributes List: ', attributes);
    getFunctions(cf);
    console.log('Functions List: ', functions);
    //getConstructors(cf);
}

function getAttributes(cf){
    //Get Properties and Attributes
    let lines = cf.match(/\s*((public|protected|default|private)\s+)?(int|String|double|float)\s+[a-zA-Z0-9]+(\s+=\s+[a-zA-Z0-9"]+)?;/g);
    if(lines != null)
        for (let line of lines) {
            line = line.substr(0, line.length - 1);
            line = line.split(' ');
            let type = line[0],
                name = line[1],
                value = (line.length > 2) ? line[3] : null;
            let variable = new Variable(name, type, value);
            console.log(`New Variable`, variable)
            attributes.push(variable);
        }
}

function getFunctions(cf){
    console.log('////////////////////////Getting Function Indices////////////////////////')
    //Get Functions
    let indices = indicesOfFunctions(cf);
    console.log('Indices of function starts: ', indices);
    if(indices != null)
        for(let index of indices){
            let substr = cf.substr(index, cf.length);
            console.log('-Substr-', substr);
            
            let brackets = [];
            let end = -1;
            //To ensure at least one bracket exists
            let i = 0;
            while(true){
                if(substr.charAt(i) == '{'){
                    brackets.push('{');
                    i++;
                    index = i;
                    break;
                }
                i++;
            }
            let constr = substr.substr(0, i-1);
            let funcElements = dissectFunctionConstructor(constr);
            while(i < substr.length){
                if(substr.charAt(i) == '{'){
                    brackets.push('{');
                }
                else if(substr.charAt(i) == '}'){
                    brackets.pop();
                }
                if(brackets.length == 0){
                    end = i;
                    break;
                }
                i++;
            }
            let code = (index != end) ? substr.substr(index, end-1) : '';
            // let func = new Function(funcElements.name, funcElements.access, , funcElements.returnType, funcElements.static, code)
        }
}

//Function Stuff
function indicesOfFunctions(string) {
    let indices = string.match(/(public|private|default|protected) +(static +)?(int|String|double|float|void)([])? +[a-zA-Z_][a-zA-Z0-9]*/g);
    if(indices != null)
        for(let i = 0; i < indices.length; i++){
            indices[i] = string.indexOf(indices[i]);
        }
    return indices;
}

//public static void main(String[] args)
function dissectFunctionConstructor(string){
    let phrases = string.match(/(public|private|default|protected) +(static +)?(int|String|double|float|void)([])? +[a-zA-Z_][a-zA-Z0-9]*/)[0].split(' ');
    let access = 'public', static = false, returnType, name;
    let parameters = getParameters(string);
    phrases.map((phrase) => {
        (phrase.match(/public|private|default|protected/i)) ? access = phrase : null;
        (phrase.match(/static/i)) ? static = true : null;
        (phrase.match(/int|String|double|float|void/i)) ? returnType = phrase : returnType;
    })
    name = phrases[phrases.length-1];
    console.log(`access: ${access}, static: ${static}, returnType: ${returnType}, name: ${name}`);

    return {
        access,
        static,
        returnType,
        name,
        parameters
    }

}

function getParameters(string){
    let params = string.match(/\(.+\)/)[0];
    params = params.match(/[a-zA-Z _0-9]+/)[0];
    let returnParams = [];
    params = params.split(',');
    params.map((param) => {
        param = param.split(' ');
        returnParams.push({
            type: param[0],
            name: param[1]
        })
    });
    return returnParams;
}

//Constructor Work
function indicesOfConstructors(string){
    let indices = string.match(/\s+(public|private|default|protected) +[a-zA-Z_][a-zA-Z0-9]*/g);
    if(indices != null)
        for(let i = 0; i < indices.length; i++){
            indices[i] = string.indexOf(indices[i]);
        }
        return indices;
}

module.exports = constfuncs;