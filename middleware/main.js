let handleLogic = require('./logic');

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
    return {
        sequence: handleLogic(main, []),
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