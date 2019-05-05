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
            $('textarea')[0].css('background-color', 'yellow');
            $('#next').click(() => {
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
        $('#next').click(() => {
            $("#next").off("click");
            showConstructors(res, 0);
        });
    }
}

// {{#each constructors}}
// <div class="row">
//     {{#each this.parameters}}
//         <p class="col-xs-4 constructor-parameter">{{this.name}} {{this.type}}</p>
//     {{/each}}
// </div>
// {{/each}}