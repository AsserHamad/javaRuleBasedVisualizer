const identifiers = require('../identifiers');

module.exports = {
    //example arr = ["a", ">", "b"]
    getValueOfBoolean : (arr, variables) => {
        let value = false;
        for (let i = 0; i < arr.length; i+=2) {
            let currentVal = variableExists(arr[i]);
            //Variable exists, get its value
            if(currentVal)
                currentVal = currentVal.value;
            else
                currentVal = arr[i];
            //TODO: Add functions
            if(i !== 0){
                switch(arr[i-1]){
                    case '>': value = value > getProperFormat(type, currentVal); break;
                    case '<': value = value < getProperFormat(type, currentVal); break;
                    case '>=': value = value >= getProperFormat(type, currentVal); break;
                    case '<=': value = value <= getProperFormat(type, currentVal); break;
                    case '!=': value = value != getProperFormat(type, currentVal); break;
                    case '==': value = value == getProperFormat(type, currentVal); break;
                }
            } else {
                value = getProperFormat(type, currentVal);
            }
        }
        return value;
    }

}
