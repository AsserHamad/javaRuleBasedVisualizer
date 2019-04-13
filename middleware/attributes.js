function Attribute(name, type, value) {
    this.name = name;
    this.type = type;
    this.value = value;
}

let attributes = [];

const Attributes = (atts) => {
    console.log('//////////ATTRIBUTES//////////');
    getAttributes(atts);
    console.log('Attributes List: ', attributes);
}

function getAttributes(atts) {
    //Get Properties and Attributes
    let lines = atts.split(';');
    for (let line of lines) {
        if(!line.match(/^\s*$/)){
            line = line.split(/\s+/);
            let type = line[0],
                name = line[1],
                value = (line.length > 2) ? line[3] : null;
            let attribute = new Attribute(name, type, value);
            attributes.push(attribute);
        }
    }
}

module.exports = Attributes;