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
            $('#next').click(() => {
                $('#t_attributes').css('background-color', 'yellow');
                $("#next").off("click");
                $('#attributes').css('display', 'inline');
                showAttributes(res, 0);
            });
        });
    });
});

function showAttributes(res, count){
    const attributes = res.attributes;
    if(count != attributes.length){
        const attribute = attributes[count];
        let html = `${$('#attributes').html()}
        <p class="attribute-name col-xs-4">${attribute.name} - <span class="attribute-type">${attribute.type}</span></p>`;
        $('#attributes').html(html);
        $('#next').click(() => {
            $("#next").off("click");
            showAttributes(res, count+1);
        });
    } else {
        $('#t_attributes').css('background-color', 'white');
        $('#t_constructors').css('background-color', 'yellow');
        $('#constructors').css('display', 'inline');
        $('#next').click(() => {
            $("#next").off("click");
            showConstructors(res, 0);
        });
    }
}

function showConstructors(res, count){
    let constructors = res.constructors;
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
            showConstructors(res, count+1);
        });
    } else {
        $('#t_constructors').css('background-color', 'white');
        $('#t_functions').css('background-color', 'yellow');
        $('#functions').css('display', 'inline');
        $('#next').click(() => {
            $("#next").off("click");
            showFunctions(res, 0);
        });
    }
}


function showFunctions(res, count) {
    let functions = res.functions;
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
            showFunctions(res, count + 1);
        });
    } else {
        $('#t_constructors').css('background-color', 'white');
        $('#t_functions').css('background-color', 'yellow');
        $('#next').click(() => {
            $("#next").off("click");
            showVariables(res, 0);
        });
    }
}

function showVariables(res, count) {
    // let variables = res.variables;
    // if (count != variables.length) {
    //     const constructor = constructors[count];
    //     let iter = "";
    //     for (let param of constructor.parameters) {
    //         iter += `<p class="col-xs-4 constructor-parameter">${param.name} ${param.type}</p>`;
    //     }
    //     let html = `${$('#constructors').html()}
    //     <div class="row">${iter}</div>`;
    //     $('#constructors').html(html);
    //     $('#next').click(() => {
    //         $("#next").off("click");
    //         showConstructors(res, count + 1);
    //     });
    // } else {
    //     $('#t_constructors').css('background-color', 'white');
    //     $('#t_functions').css('background-color', 'yellow');
    //     $('#functions').css('display', 'inline');
    //     $('#next').click(() => {
    //         $("#next").off("click");
    //         showFunctions(res, 0);
    //     });
    // }
}

// {{#each functions}}
// <div class="col-xs-4 function text-left">
    // <span class="function-label">Name:</span> <span class="function-name">{{this.name}}</span><br>
    // <span class="function-label">Static:</span> <span class="function-name">{{this.static}}</span><br>
    // <span class="function-label">Returns:</span> <span class="function-name">{{this.returnType}}</span><br>
    // <span class="function-label">Access:</span> <span class="function-name">{{this.access}}</span><br>
// </div>
// {{/each}}