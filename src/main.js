// General variables defining
const body = document.body;
const viewSection = document.querySelector(".view-section");  
const textInput = document.querySelector('#text-input'); 
const addTaskButton = document.querySelector('#add-button'); 
const prioritySelector = document.querySelector('#priority-selector'); 
const counter = document.querySelector('#counter'); 
const sortButton = document.querySelector('#sort-button'); 
const clearButton = document.getElementById("clear");

let myTodo = [];

addTaskButton.addEventListener('click', createSkeletonToMyTodo);
addTaskButton.addEventListener('click', appendDataToTasksDiv);
addTaskButton.addEventListener('click', appendTaskToMyTodo);
addTaskButton.addEventListener('click', appendToLocalStorage);
addTaskButton.addEventListener('click',CounterFunction);
sortButton.addEventListener('click', sortMyTodo);
clearButton.addEventListener('click', clearAll);
window.addEventListener('load', onReload);
// if (checkButton) {checkButton.addEventListener('click', checkTask)};



function clearAll() {
    myTodo = [];
    viewSection.textContent = '';
    localStorage.clear();
    CounterFunction();
    textInput.value = ''
}

function onReload() {
    if (JSON.parse(localStorage.getItem('my-todo')) < 1) return;
    const objectsOfMyToDo = JSON.parse(localStorage.getItem('my-todo'));
    for (let i = 0; i < objectsOfMyToDo.length; i++) {
        createSkeletonToMyTodo();
        let valuesOfMyToDoObject = Object.values(objectsOfMyToDo[i]);
        prioritySelector.value = valuesOfMyToDoObject[0];
        textInput.value = valuesOfMyToDoObject[2];
        appendDataToTasksDiv();
        let datesDivs = document.querySelectorAll(".todo-created-at")
        let dateInMilliseconds = Number(valuesOfMyToDoObject[1]);
        let sqlDate = (new Date(dateInMilliseconds)).toLocaleString("en-GB").split(',').join(' ');
        datesDivs[datesDivs.length - 1].textContent = sqlDate;
        
    }
    myTodo = JSON.parse(localStorage.getItem('my-todo'))
    CounterFunction();
}

function CounterFunction() {
    counter.textContent = viewSection.childElementCount;
}

function createSkeletonToMyTodo() {
    if (textInput.value === '' && localStorage.length === 0 ||
    textInput.value === '' &&  localStorage.length > 0 && myTodo.length > 0) return; // doesn't work when local storage is empty

    const todoContainer = document.createElement('div') // todo container
    todoContainer.classList.add("todo-container");

    const todoPriorityContainer = document.createElement('div') // priority container
    todoPriorityContainer.classList.add("todo-priority");

    const todoDateContainer = document.createElement('div') // date container
    todoDateContainer.classList.add("todo-created-at");
    
    const todoInputContainer = document.createElement('div') // text container
    todoInputContainer.classList.add("todo-text");

    const removeButton = document.createElement('a');
    removeButton.setAttribute("id", "remove-button");
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.addEventListener('click', removeTask);

    const checkButton = document.createElement('button');
    checkButton.setAttribute("id", "check-button");
    checkButton.innerHTML = '<i class="fas fa-check"></i>';
    checkButton.addEventListener('click', checkTask);

    todoContainer.append(todoPriorityContainer,
                         todoDateContainer,
                         todoInputContainer,
                         removeButton,
                         checkButton);

    viewSection.appendChild(todoContainer);
}

function appendDataToTasksDiv() {
    if (textInput.value === '' &&  localStorage.length > 0 && myTodo.length > 0) return;

    let prioritiesDivs = document.querySelectorAll(".todo-priority");
    prioritiesDivs[prioritiesDivs.length - 1].textContent = prioritySelector.value;
    
    let textDivs = document.querySelectorAll(".todo-text")
    textDivs[textDivs.length - 1].textContent = textInput.value;
    
    textInput.value = '';

    if ((localStorage.length === 0 && myTodo.length === 0)
        || (localStorage.length > 0 && myTodo.length > 0)) {
    let datesDivs = document.querySelectorAll(".todo-created-at")
    let taskDate = new Date();
    let dateForUser = taskDate.toLocaleString("en-GB");
    datesDivs[datesDivs.length - 1].textContent = dateForUser;
    };
}

function appendTaskToMyTodo() {
    let lastDiv = viewSection.lastChild;
    const dateForUser = (lastDiv.querySelector(".todo-created-at").textContent);
    const [first, second] = dateForUser.split(',').map(item => item.trim());
    const [day, month, year] = first.split('/');
    const [hours, minutes, seconds] = second.split(':');
    const dateForMyToDo = new Date(year, month - 1, day, hours, minutes, seconds);
    let taskInfo = {
        "priority": `${lastDiv.querySelector(".todo-priority").textContent}`,
        "date": `${dateForMyToDo.getTime()}`,
        "text": `${lastDiv.querySelector(".todo-text").textContent}`
    };
    myTodo.push(taskInfo);
}

function appendToLocalStorage() {
    localStorage.setItem('my-todo', JSON.stringify(myTodo));
}

function sortMyTodo() {
    const taskDiv = Array.prototype.slice.call(document.querySelectorAll('.todo-container'));
    let i = 0;
    while (i < taskDiv.length - 1) {
        if (taskDiv[i].firstChild.textContent < taskDiv[i + 1].firstChild.textContent) { 
            taskDiv[i].before(taskDiv[i + 1]);
            temp = taskDiv[i] 
            taskDiv[i] = taskDiv[i + 1] 
            taskDiv[i+ 1] = temp 
            i = -1;
        } 
        i++;
    };
    myTodo = myTodo.sort(function (a, b) {return b.priority - a.priority});
    localStorage.setItem('my-todo', JSON.stringify(myTodo));
};

function removeTask(e) {
    let task = e.target.parentNode;
    const confirmMessage = confirm("Hey Champ! are you sure you want to delete the task?");
    if (confirmMessage) task.classList.toggle("remove-task");
    

};

function checkTask(e) {
    let task = e.target.parentNode;
    task.classList.toggle("check-task");
}