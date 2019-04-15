function Attribute(name, type, value) {
    this.name = name;
    this.type = type;
    this.value = value;
}

let attributes = [];

const Attributes = (atts) => {
    attributes = [];
    getAttributes(atts);
    return attributes;
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