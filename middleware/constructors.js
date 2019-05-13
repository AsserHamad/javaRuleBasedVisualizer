let handleLogic = require('./logic');

function Parameter(name, type) {
    this.name = name;
    this.type = type;
}

function Constructor(name, access, parameters, code) {
    this.name = name;
    this.access = access;
    this.parameters = parameters;
    this.code = code;
}

let constructors = [];

const Constructors = (consts) => {
    constructors = [];
    getConstructors(consts);
    return constructors;
}

//Constructor Work
function indicesOfConstructors(string) {
    let indices = string.match(/\s*(public|private|default|protected) +[a-zA-Z_]+[a-zA-Z0-9]*\([a-zA-Z, ]*\)/g);
    if (indices != null)
        for (let i = 0; i < indices.length; i++) {
            indices[i] = string.indexOf(indices[i]);
        }
    return indices;
}

function getConstructors(consts) {
    //Get Constructors
    let indices = indicesOfConstructors(consts);
    if (indices != null)
        for (let index of indices) {
            let substr = consts.substring(index, consts.length);
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
            let constrElements = dissectConstructor(constr);
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
            let code = (index != end) ? substr.substring(index, end - 1) : '';
            constructors.push(new Constructor(
                constrElements.name,
                constrElements.access,
                constrElements.parameters,
                code
            ));
        }
}

//public static void main(String[] args)
function dissectConstructor(string) {
    let phrases = string.match(/(public|private|default|protected) +[a-zA-Z_][a-zA-Z0-9]*/)[0].split(' ');
    let access = 'public',
        name;
    let parameters = getParameters(string);
    phrases.map((phrase) => {
        (phrase.match(/public|private|default|protected/i)) ? access = phrase: null;
    })
    name = phrases[phrases.length - 1];
    return {
        access,
        name,
        parameters
    }

}

function getParameters(string) {
    let params = string.match(/\(.*\)/)[0];
    params = params.match(/[a-zA-Z ,_0-9]+/g)[0];
    let returnParams = [];
    params = params.split(',');
    params.map((param) => {
        param = param.match(/[a-zA-Z]+ [a-zA-Z_0-9]/)[0];
        param = param.split(' ');
        returnParams.push(new Parameter(param[1], param[0]));
    });
    return returnParams;
}

module.exports = Constructors;