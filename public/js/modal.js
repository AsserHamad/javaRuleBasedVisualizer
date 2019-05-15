let text = [{
    title: 'Attribute Rules',
    text: 'Rules for attributes should go in the format ....'
},{
    title: 'Constructor Rules',
    text: 'Rules for Constructor should go in the format ....'
},{
    title: 'Function Rules',
    text: 'Rules for Function should go in the format ....'
},{
    title: 'Main Method Rules',
    text: 'Rules for the main method should go in the format ....'
}]
$(document).ready(() => {
    $('#rule-attributes').click((event) => {
        console.log('rules click')
        changeText(0);
    });
    $('#rule-constructors').click((event) => {
        changeText(1);
    });
    $('#rule-functions').click((event) => {
        changeText(2);
    });
    $('#rule-main').click((event) => {
        changeText(3);
    });
});

function changeText(index){
    let rules = text[index];
    $('#modal-title').html(rules.title);
    $('#modal-text').html(rules.text);
    $('#modalbtn').click();
    
}