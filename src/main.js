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
        let dateinMilliseconds = Number(valuesOfMyToDoObject[1]);
        let sqlDate = (new Date(dateinMilliseconds)).toLocaleString("en-GB").split(',').join(' ');
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
    todoContainer.appendChild(todoPriorityContainer);

    const todoDateContainer = document.createElement('div') // date container
    todoDateContainer.classList.add("todo-created-at");
    todoContainer.appendChild(todoDateContainer);
    
    const todoInputContainer = document.createElement('div') // text container
    todoInputContainer.classList.add("todo-text");
    todoContainer.appendChild(todoInputContainer);
    
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
    myTodo = myTodo.sort(function (a, b) {return b.priority - a.priority});
    childrenSortedList = [];
    for (let i = 0; i < myTodo.length; i++) {

        const todoContainer = document.createElement('div')
        todoContainer.classList.add("todo-container");

        const todoPriorityContainer = document.createElement('div')
        todoPriorityContainer.classList.add("todo-priority");
        todoPriorityContainer.textContent = myTodo[i].priority;
        todoContainer.appendChild(todoPriorityContainer);

        const todoDateContainer = document.createElement('div')
        todoDateContainer.classList.add("todo-created-at");
        todoDateContainer.textContent = myTodo[i].date;
        todoContainer.appendChild(todoDateContainer);
        
        const todoInputContainer = document.createElement('div')
        todoInputContainer.classList.add("todo-text");
        todoInputContainer.textContent = myTodo[i].text;
        todoContainer.appendChild(todoInputContainer);

        childrenSortedList.push(todoContainer); 

    }
    textInput.value = '';
    viewSection.textContent = '';
    for (div of childrenSortedList) {
        viewSection.appendChild(div);
    }
}

