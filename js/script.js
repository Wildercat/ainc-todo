var app = document.getElementById('app');
var LIST = [];

function mkTag(tag, clss, cont) {
    let html = document.createElement(tag);
    html.setAttribute('class', clss);
    // html.setAttribute('id', id);
    // html.setAttribute('style', style);
    html.textContent = cont;
    return html;
}
function createUUID() { //ripped straight from the internet
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

class Todo {
    constructor(title) {
        this.uuid = createUUID();
        this.title = title;
        this.done = false;
    }

}
function makeItemHtml(obj) {
    let grp_Div = mkTag('div', 'row input-group mb-3');

    // prepend section
    let prep = mkTag('div', 'input-group-prepend col-2');
    let tick_Text = mkTag('div', 'input-group-text');
    let tick = mkTag('input');
    tick.setAttribute('type', 'checkbox');

    tick_Text.appendChild(tick);
    prep.appendChild(tick_Text);
    grp_Div.appendChild(prep);

    let txt = mkTag('span', 'input-group-text col', obj.title);
    grp_Div.appendChild(txt);

    let appnd = mkTag('div','input-group-append col-2');
    let delBtn = mkTag('button', 'btn btn-outline-secondary', 'x');
    delBtn.setAttribute('type', 'button');
    delBtn.setAttribute('title', 'Delete');
    
    appnd.appendChild(delBtn);
    grp_Div.appendChild(appnd);
    
    return grp_Div;
}
function returnContDiv() {
    return document.getElementById('todo_content');
}
function popTodoItems() {
    let cont_div = returnContDiv();
    for (list_item of LIST) {
        let item_html = makeItemHtml(list_item);
        cont_div.prepend(item_html);
    }
}
function storeList() {
    localStorage.setItem('list', JSON.stringify(LIST));
}
function submitClick(e) {
    let cont_div = returnContDiv();
    let input_box = document.getElementById('inputBox');
    cont_div.innerHTML = '';
    LIST.push(new Todo(input_box.value))
    input_box.value = '';
    input_box.focus();
    popTodoItems();
    storeList();
    
}

// html creation --------
function makeInputHtml() {
    // --- make html objects ---
    let row = mkTag('div', 'row py-3');
    //input group div
    let inGrp = mkTag('div', 'input-group');
    // text field input tag
    let inField = mkTag('input', 'form-control');
    inField.setAttribute('id', 'inputBox');
    inField.setAttribute('type', 'text');
    inField.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('inputBtn').click();
        }
    });
    // input group append div
    let inAppendDiv = mkTag('div', 'input-group-append');
    // submit button
    let submitBtn = mkTag('button', 'btn btn-outline-secondary', 'Add')
    submitBtn.setAttribute('type', 'button');
    submitBtn.setAttribute('id', 'inputBtn');
    submitBtn.addEventListener('click', submitClick);

    // --- append back out ---
    inAppendDiv.appendChild(submitBtn);

    inGrp.appendChild(inField);
    inGrp.appendChild(inAppendDiv);
    row.appendChild(inGrp);
    return row;

}

function init() {
    LIST = localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')): [];
    let lrgCol = mkTag('div', 'col-11 col-md-7');
    lrgCol.setAttribute('id', 'appCol');
    lrgCol.appendChild(makeInputHtml());
    
    let content_div = mkTag('div', 'row');
    let content_col = mkTag('div', 'col');
    content_col.setAttribute('id', 'todo_content');

    content_div.appendChild(content_col);
    lrgCol.appendChild(content_div);
    
    app.appendChild(lrgCol);
}

init();



popTodoItems();

