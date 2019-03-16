const express = require('express');
const router = express.Router();
const Errors = require('../errors/Errors');
const handlers = require('../typehandlers');
const variables = [];

const identifiers = [{
    name: 'int',
    regex: '^[0-9]+$',
}, {
    name: 'double',
    regex: '^[0-9]+(\\.[0-9]+)?$'
}, {
    name: 'float',
    regex: '^[0-9]+(\\.[0-9]+)?$'
}, {
    name: 'String',
    regex: '^[_a-zA-Z]\w*$'
}]

router.get('/', (req, res, next) => {
    // res.render('index', {
    //       variables: variables,
    //       error: error
    // });
    res.send("hi");
});

router.post('/', (req, res, next) => {
    const code = req.body.code;
    let lines = code.replace(/\r?\n|\r/i, '').split(';');
    console.log(lines);
    let count = 0;
    let error = "";
    for (let line of lines) {
        count++;
        line = line.split(/\s+/g);

        //Creating new variable
        if (identifier(line[0])) {
            if (line[2] == '=') {
                let result = handlers[line[0]](line, variables);
                if (result.error) {
                    console.log(result.error.message);
                    error = result.error.message;
                    break;
                } else
                    changeVariable(result);
                console.log(`Variables is now ${variables}`);
                //TODO: show user their changes
            } else {
                console.log(`Syntax error in line ${count}`);
                error = `Syntax error in line ${count}`;
                break;
            }
        }

        //Reassigning variable

    }
    res.json({
        variables,
        error
    });
})

// Helper Functions
function identifier(type) {
    for (let identifier of identifiers) {
        if (type == identifier.name)
            return true;
    }
    return false;
}

function changeVariable(newVar) {
    let changed = false;
    for (let i = 0; i < variables.length; i++) {
        if (variables[i].name == newVar.name) {
            variables[i].value = newVar.value;
            changed = true;
        }
    }
    if (!changed)
        variables.push(newVar);
    console.log(`added `, newVar);
}

module.exports = router;