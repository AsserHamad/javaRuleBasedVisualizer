let handleLogic = require('./logic');

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
    handleLogic(main, sequence);
    console.log(JSON.stringify(sequence, null, 4));
    return {
        variables,
        sequence,
        atts,
        consts,
        funcs
    }
};

String.prototype.indexOfEnd = function(string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
}

module.exports = Main;