const express = require('express');
const router = express.Router();
const Errors = require('../errors/Errors');
const handler = require('../typehandlers');
const identifiers = require('../identifiers');
const constfuncs = require('../middleware/constfuncs');

let variables = [];

router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Java Visualizer'
    });
});

router.post('/', (req, res, next) => {
    const code = req.body.main;
    const cf = req.body.constfuncs;

    constfuncs(cf);

    let lines = code.replace(/\r?\n|\r/i, '');
    lines = lines.split(';');
    // lines = typeOfQuery(lines);
    console.log(lines);
    let count = 0;
    let error = "";
    for (let line of lines) {
        count++;
        //0 = Initiate new Variable, 1 = Reassign Variable
        const type = typeOfLine(line);
        
        //Creating new variable
        if(type == 0){
            line = line.split(/\s/);
            if (identifiers.includes(line[0])) {
                console.log(`Creating new variable`, line);
                if (line[2] == '=') {
                    const type = line[0];
                    const name = line[1];
                    let value = (type == 'boolean') ? 
                        getValueOfBoolean(line.slice(3, line.length)) :
                        getValueOfOperands(type, line.slice(3, line.length));
                    let result = handler(type, name, value, variables);
                    if (result.error) {
                        error = result.error.message;
                        break;
                    } else
                        changeVariable(result);
                } else {
                    error = `Syntax error in line ${count}`;
                    break;
                }
            }
        }
        
        //Reassigning variable
        else if(type == 1){
            console.log('reassigning variables', line.slice(2, line.length));
            line = line.split(/\s/);
            let variable = variableExists(line[0]);
            if(variable){
                let value = (type == 'boolean') ? 
                    getValueOfBoolean(line.slice(2, line.length)) :
                    getValueOfOperands(variable.type, line.slice(2, line.length));
            }
        }
            
        }
        res.render('index', {
            variables,
            error,
        title: 'Java Visualizer'
        });
})


// Helper Functions
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

function variableExists(varName) {
    for(let vari of variables){
        if (vari.name == varName)
            return vari;
    }
    return false;
}

function getProperFormat(value, type){
    switch(type){
        case 'String': return value + ''; break;
        case 'int' : return parseInt(value); break;
        case 'float' : return parseFloat(value); break;
        case 'double' : return parseFloat(value); break;
        case 'boolean' : return (value == 'true') ? true : false; break;
    }
}

function getValueOfOperands(type, arr){
    let value = (type == 'String') ? '' : 0;
    console.log(`value = ${value}`, `type = ${type}`);
    
    for (let i = 0; i < arr.length; i+=2) {
        let currentVal = variableExists(arr[i]);
        //Variable exists, get its value
        if(currentVal)
            currentVal = currentVal.value;
        else
            currentVal = arr[i];
        console.log(`currentVal = ${currentVal}`)
        //TODO: Add functions
        if(i !== 0){
            switch(arr[i-1]){
                case '+': value += getProperFormat(currentVal, type); break;
                case '-': value -= getProperFormat(currentVal, type); break;
                case '*': value *= getProperFormat(currentVal, type); break;
                case '/': value /= getProperFormat(currentVal, type); break;
                case '%': value %= getProperFormat(currentVal, type); break;
            }
        } else {
            console.log(`${value} += ${getProperFormat(currentVal, type)}`)
            value += getProperFormat(currentVal, type);
        }
        console.log('value', value);
    }
    return value;
}

//example arr = ["a", ">", "b"]
function getValueOfBoolean(arr) {
    console.log('getting val of bool')
    let value = true;
    for (let i = 0; i < arr.length; i+=2) {
        let currentVal = variableExists(arr[i]);
        let type; 
        
        //Variable exists, get its value
        if(currentVal){
            type = currentVal.type;
            currentVal = currentVal.value;
        }
        else{
            currentVal = arr[i];

        }
        //TODO: Add functions
        console.log(`currentval = ${currentVal}`, `i = ${i}`);
        if(i !== 0){
            switch(arr[i-1]){
                case '>': value = getProperFormat(arr[i-2], type) > getProperFormat(currentVal, type) && value; break;
                case '<': value = getProperFormat(arr[i-2], type) < getProperFormat(currentVal, type) && value; break;
                case '>=': value = getProperFormat(arr[i-2], type) >= getProperFormat(currentVal, type) && value; break;
                case '<=': value = getProperFormat(arr[i-2], type) <= getProperFormat(currentVal, type) && value; break;
                case '!=': value = getProperFormat(arr[i-2], type) != getProperFormat(currentVal, type) && value; break;
                case '==': value = getProperFormat(arr[i-2], type) == getProperFormat(currentVal, type) && value; break;
            }
        } else {
            value = getProperFormat(currentVal, type);
        }
        console.log('value', value);
    }
    return value;
}



function typeOfLine(line) {
    //Initiating Variable
    if(line.match(/[a-zA-Z]+ [a-zA-Z]+ =/)){
        return 0;
    }
    else
    //Reassigning Variable
    if(line.match(/[a-zA-Z]+ =/)){
        return 1;
    }
}

module.exports = router;