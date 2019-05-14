
//Logic
function handleLogic(statement, sequence){
    console.log(statement, sequence);
    //Declarations
    if(statement.match(/^ *(int|String|double|float|Test) [a-zA-Z0-9_]+ = [a-zA-Z0-9_ .\(\)]+;/i)){
        let declaration = statement.match(/(int|String|double|float|Test) [a-zA-Z0-9_]+ = [a-zA-Z0-9_ .\(\)]+;/i)[0];
        sequence.push({
            type: 'declaration',
            declaration
        });
        statement = statement.replace(declaration, '');
    }
    //Assignments
    else if(statement.match(/^ *[a-zA-Z0-9._]+ = [a-zA-Z0-9_ +-/*"'.\(\)]+;/i)){
        let assignment = statement.match(/[a-zA-Z0-9._]+ = [a-zA-Z0-9_ +-/*"'.\(\)]+;/i)[0]
        sequence.push({
            type: 'assignment',
            assignment
        })
        statement = statement.replace(assignment, '');
    }
    //If Conditions
    else if(statement.match(/^ *if\([a-zA-Z0-9.+-=\(\) !]*\)/i)){
        let _if = statement.match(/if\([a-zA-Z0-9.+-=\(\) !]*\)/i)[0];
        let condition = _if.substring(3, _if.length-1);
        let startIndex = statement.indexOfEnd(_if), counter = 0, endIndex;
        for(let i = startIndex; i < statement.length; i++){
            if(statement[i] == '{')
                counter++;
            else if(statement[i] == '}')
                counter--;
            if(counter == 0){
                endIndex = i;
                break;
            }
        }
        let block = statement.substring(startIndex+1, endIndex);
        block = handleLogic(block, []);
        statement = statement.replace(statement.substring(0, endIndex+1), '');
        let obj = {
            type: 'if',
            condition,
            block
        };
        //Else Condition
        if(statement.match(/^ *else */i)){
            console.log('ELSE!!!!');
            let _else = statement.match(/else */i)[0];
            let _startIndex = statement.indexOfEnd(_else), _counter = 0, _endIndex;
            for(let i = _startIndex; i < statement.length; i++){
                if(statement[i] == '{')
                    _counter++;
                else if(statement[i] == '}')
                    _counter--;
                if(_counter == 0){
                    _endIndex = i;
                    break;
                }
            }
            let block = statement.substring(_startIndex+1, _endIndex);
            e_block = handleLogic(block, []);
            obj['else'] = e_block;
            statement = statement.replace(statement.substring(0, _endIndex+1), '');
        }
        sequence.push(obj);
    }
    //While loop
    else if(statement.match(/^ *while\([a-zA-Z0-9.+-=\(\) !]*\)/i)){
        let _while = statement.match(/while\([a-zA-Z0-9.+-=\(\) !]*\)/i)[0];
        let condition = _while.substring(6, _while.length-1);
        let startIndex = statement.indexOfEnd(_while), counter = 0, endIndex;
        for(let i = startIndex; i < statement.length; i++){
            if(statement[i] == '{')
                counter++;
            else if(statement[i] == '}')
                counter--;
            if(counter == 0){
                endIndex = i;
                break;
            }
        }
        let block = statement.substring(startIndex+1, endIndex);
        block = handleLogic(block, []);
        sequence.push({
            type: 'while',
            condition,
            block
        });
        statement = statement.replace(statement.substring(0, endIndex+1), '');
    }
    //For loop
    else if(statement.match(/^ *for\([a-zA-Z0-9.+-=\(\) ;!]*\)/i)){
        let _for = statement.match(/for\([a-zA-Z0-9.+-=\(\) !]*\)/i)[0];
        let condition = _for.substring(4, _for.length-1).split(';');
        let init = condition[0], cond = condition[1], incr = condition[2];
        let startIndex = statement.indexOfEnd(_for), counter = 0, endIndex;
        for(let i = startIndex; i < statement.length; i++){
            if(statement[i] == '{')
                counter++;
            else if(statement[i] == '}')
                counter--;
            if(counter == 0){
                endIndex = i;
                break;
            }
        }
        let block = statement.substring(startIndex+1, endIndex);
        block = handleLogic(block, []);
        sequence.push({
            type: 'for',
            init,
            cond,
            incr,
            block
        });
        statement = statement.replace(statement.substring(0, endIndex+1), '');
    }
    //Return statement
    else if(statement.match(/^ *return [a-zA-Z0-9_ .\(\)]+;/i)){
        console.log('RETURN')
        let ret = statement.match(/return [a-zA-Z0-9_ .\(\)]+;/i)[0];
        sequence.push({
            type: 'return',
            return: ret
        });
        statement = statement.replace(ret, '');
    }

    if(statement.match(/^\s*$/)){
        return sequence;
    }
    else
        return handleLogic(statement, sequence);
}

module.exports = handleLogic;