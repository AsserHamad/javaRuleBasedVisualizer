let handleLogic = require('./logic');

function Sequence(type, details){
    this.type = type;
    this.details = details;
};

const Main = (main, atts, consts, funcs) => {
    let sequence = handleLogic(main, [])
    return {
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