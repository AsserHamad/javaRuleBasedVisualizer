$(document).ready(() => {
    $('#submit').click(()=>{
        const textareas = $('textarea');
        const values = {
            attributes : textareas[0].value,
            constructors : textareas[1].value,
            functions : textareas[2].value,
            main : textareas[3].value
        };
        $.post('http://localhost:3000', values, (res) => {
            console.log(res);
            $('#next').click(() => {
                $('#t_attributes').css('background-color', 'yellow');
                $("#next").off("click");
                $('#attributes').css('display', 'inline');
                attributes = res.attributes;
                constructors = res.constructors;
                functions = res.functions;
                stfunctions = functions.filter((func) => func.static);
                main = res.main;
                showAttributes(0);
            });
        });
    });
    $('#submit').click();
});

function showAttributes(count){
    if(count != attributes.length){
        const attribute = attributes[count];
        let html = `${$('#attributes').html()}
        <p class="attribute-name col-xs-4">${attribute.name} - <span class="attribute-type">${attribute.type}</span></p>`;
        $('#attributes').html(html);
        $('#next').click(() => {
            $("#next").off("click");
            showAttributes(count+1);
        });
    } else {
        $('#t_attributes').css('background-color', 'white');
        $('#t_constructors').css('background-color', 'yellow');
        $('#constructors').css('display', 'inline');
        $('#next').click(() => {
            $("#next").off("click");
            showConstructors(0);
        });
    }
}

function showConstructors(count){
    if(count != constructors.length){
        const constructor = constructors[count];
        let iter = "";
        for(let param of constructor.parameters){
            iter += `<p class="col-xs-4 constructor-parameter">${param.name} ${param.type}</p>`;
        }
        let html = `${$('#constructors').html()}
        <div class="row">${iter}</div>`;
        $('#constructors').html(html);
        $('#next').click(() => {
            $("#next").off("click");
            showConstructors(count+1);
        });
    } else {
        $('#t_constructors').css('background-color', 'white');
        $('#t_functions').css('background-color', 'yellow');
        $('#functions').css('display', 'inline');
        $('#next').click(() => {
            $("#next").off("click");
            showFunctions(0);
        });
    }
}

function showFunctions(count) {
    if (count != functions.length) {
        const func = functions[count];
        let iter = '<div class="col-xs-4 function text-left">';
        iter += `
        <span class="function-label">Name:</span> <span class="function-name">${func.name}</span><br>
            <span class="function-label">Static:</span> <span class="function-name">${func.static}</span><br>
            <span class="function-label">Returns:</span> <span class="function-name">${func.returnType}</span><br>
            <span class="function-label">Access:</span> <span class="function-name">${func.access}</span><br>
            `;
        iter += '</div>';
        let html = `${$('#functions').html()} ${iter}`;
        $('#functions').html(html);
        $('#next').click(() => {
            $("#next").off("click");
            showFunctions(count + 1);
        });
    } else {
        $('#t_functions').css('background-color', 'white');
        $('#t_main').css('background-color', 'yellow');
        $("#next").off("click");
        showMain(0);
    }
}

function showMain(count) {
    let currStatement = main.sequence[count];
    switch(currStatement.type){
        case 'declaration': declarationHandler(currStatement); setNextClick(count);break;
        case 'assignment': assignmentHandler(currStatement); setNextClick(count);break;
        case 'stfunc' : staticfunctionHandler(currStatement); setNextClick(count); break;
        case 'if': ifHandler(currStatement, count); setNextClick(count); break;
        case 'endif': count = endIfHandler(currStatement, count); console.log(`count after if: ${count}`); setNextClick(count); break;
        case 'while': whileHandler(currStatement, count); setNextClick(count); break;
        case 'endwhile': count = endWhileHandler(currStatement, count); setNextClick(count); break;
        case 'for': break;
    }
}

function setNextClick(count){
    $('#next').click(() => {
        $("#next").off("click");
        showMain(count + 1);
    });
}