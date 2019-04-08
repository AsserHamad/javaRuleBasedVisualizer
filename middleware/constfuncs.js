function Variable(name, type, value){
    this.name = name;
    this.type = type;
    this.value = value;
}

let regexAttributes = {
    declare : '[a-zA-Z0-9]+\s+[a-zA-Z0-9]+(\s+=\s+[a-zA-Z0-9]+)?;',
    assign : '[a-zA-Z0-9]+(\s+=\s+[a-zA-Z0-9]+)?;'
};

let attributes = [];

const constfuncs = (cf) => {
    getAttributes(cf);
    console.log('attributes', attributes);
    getFunctions(cf);
}

function getAttributes(cf){
    //Get Properties and Attributes
    let lines = cf.match(/\s*[a-zA-Z0-9]+\s+[a-zA-Z0-9]+(\s+=\s+[a-zA-Z0-9"]+)?;/g);
    for (let line of lines) {
        line = line.substr(0, line.length - 1);
        line = line.replace(/\r|\n/g, '');
        line = line.split(' ');
        let type = line[0],
            name = line[1],
            value = (line.length > 2) ? line[3] : null;
        let variable = new Variable(name, type, value);
        console.log(`variable`, variable)
        attributes.push(variable);
    }
}

function getFunctions(cf){
    console.log('getting indices woo')
    //Get Functions
    let indices = indicesOf(cf, 'public|private|default|protected');
    console.log('indices', indices);
}

function indicesOf(string, regex) {
    let indices = [];
    let i = 0;
    regex = new RegExp(regex);
    console.log('regex', regex);
    while(true){
        let index = string.indexOf(regex, i);
        if(i != 0)
            indices.push(index);
        else
            break;
        i = index + 1;
    }

    return indices;
}

module.exports = constfuncs;