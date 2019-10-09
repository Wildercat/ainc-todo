var app = document.getElementById('app');
var LIST = [];
var STATE = 0;
var state_list = ['All', 'Active', 'Done'];

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
function find(qry_uuid) {
    for (idx in LIST) {
        if (qry_uuid == LIST[idx].uuid) {
            return idx;
        }
    }
}
function delBtnClick(e) {
    LIST.splice(find(e.target.dataset.uuid), 1);
    stateManager();
}
function checkBoxTick(e) {
    LIST[find(e.target.dataset.uuid)].done = !LIST[find(e.target.dataset.uuid)].done;
    stateManager();
}
function makeItemHtml(obj) {
    let grp_Div = mkTag('div', 'row input-group mb-3');

    // prepend section
    let prep = mkTag('div', 'input-group-prepend col-2');
    let tick_Text = mkTag('div', 'input-group-text');
    let tick = mkTag('input');
    tick.setAttribute('type', 'checkbox');
    if (obj.done) {
        tick.setAttribute('checked', true);
    }
    tick.setAttribute('data-uuid', obj.uuid);
    tick.addEventListener('change', checkBoxTick);

    tick_Text.appendChild(tick);
    prep.appendChild(tick_Text);
    grp_Div.appendChild(prep);

    let txt = mkTag('span', 'input-group-text col', obj.title);
    if (obj.done) {
        txt.setAttribute('style', 'text-decoration: line-through');
        txt.setAttribute('class', 'input-group-text col text-muted')
    }
    grp_Div.appendChild(txt);

    let appnd = mkTag('div', 'input-group-append col-2');
    let delBtn = mkTag('button', 'btn btn-outline-secondary', 'x');
    delBtn.setAttribute('type', 'button');
    delBtn.setAttribute('title', 'Delete');
    delBtn.setAttribute('data-uuid', obj.uuid); // custom html attribute
    delBtn.addEventListener('click', delBtnClick);

    appnd.appendChild(delBtn);
    grp_Div.appendChild(appnd);

    return grp_Div;
}
function returnContDiv() {
    return document.getElementById('todo_content');
}
function popTodoItems() {
    let cont_div = returnContDiv();
    cont_div.innerHTML = '';
    if (STATE != 1) {
        for (list_item of LIST) {
            if (list_item.done) {
                let item_html = makeItemHtml(list_item);
                cont_div.prepend(item_html);
            }
        }
    }
    if (STATE != 2) {
        for (list_item of LIST) {
            if (!list_item.done) {
                let item_html = makeItemHtml(list_item);
                cont_div.prepend(item_html);
            }
        }
    }
}

function storeList() {
    localStorage.setItem('list', JSON.stringify(LIST));
}

function stateManager() {
    popTodoItems();
    storeList();
    // console.log(LIST);
}
function submitClick(e) {
    let input_box = document.getElementById('inputBox');
    LIST.push(new Todo(input_box.value))
    input_box.value = '';
    input_box.focus();
    stateManager();
}

function allDoneClick() {
    for (list_item of LIST) {
        list_item.done = true;
    }
    stateManager();
}
function allNotDoneClick() {
    for (list_item of LIST) {
        list_item.done = false;
    }
    stateManager();
}

function allDelClick() {
    for (let idx =0; idx < LIST.length; idx++) {
        if (LIST[idx].done) {
            console.log(idx);
            console.log('array before removing:');
            console.log(LIST);
            LIST.splice(idx, 1);
            console.log('array after removing:');
            console.log(LIST);
            idx = -1;
        }
    }
    stateManager();
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
    inField.setAttribute('placeholder', 'Add New Item');
    inField.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('inputBtn').click();
        }
    });
    // input group append div
    let inAppendDiv = mkTag('div', 'input-group-append');
    // submit button
    let submitBtn = mkTag('button', 'btn btn-primary', 'Add')
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
function makeModeChangeRow() {
    let row = mkTag('div', 'row py-3');
    row.setAttribute('role', 'group');

    let all_btn = mkTag('button', 'btn btn-outline-secondary col', 'Show All');
    all_btn.addEventListener('click', () => { STATE = 0; stateManager() });
    let active_btn = mkTag('button', 'btn btn-outline-secondary col', 'Active');
    active_btn.addEventListener('click', () => { STATE = 1; stateManager() });
    let done_btn = mkTag('button', 'btn btn-outline-secondary col', 'Completed');
    done_btn.addEventListener('click', () => { STATE = 2; stateManager() });

    row.appendChild(all_btn);
    row.appendChild(active_btn);
    row.appendChild(done_btn);

    return row;
}
function makeBulkEditRow() {
    let row = mkTag('div', 'row py-3');
    row.setAttribute('role', 'group');

    let all_done = mkTag('button', 'btn btn-outline-secondary col', 'Check All');
    all_done.addEventListener('click', allDoneClick);

    let all_not_done = mkTag('button', 'btn btn-outline-secondary col', 'Un-check All');
    all_not_done.addEventListener('click', allNotDoneClick);

    let all_del = mkTag('button', 'btn btn-outline-secondary col', 'Clear Checked');
    all_del.addEventListener('click', allDelClick);

    row.appendChild(all_done);

    row.appendChild(all_not_done);

    row.appendChild(all_del);

    return row;
}

function init() {
    LIST = localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
    let lrgCol = mkTag('div', 'col-11 col-md-7');
    lrgCol.setAttribute('id', 'appCol');
    //---------------------
    lrgCol.appendChild(makeInputHtml());
    //-------------------------------------
    lrgCol.appendChild(makeModeChangeRow());
    //--------------------------------------
    let content_div = mkTag('div', 'row');
    let content_col = mkTag('div', 'col');
    content_col.setAttribute('id', 'todo_content');

    content_div.appendChild(content_col);
    lrgCol.appendChild(content_div);
    //---------------------------------------
    lrgCol.appendChild(makeBulkEditRow());

    app.appendChild(lrgCol);

    popTodoItems();
}

init();

