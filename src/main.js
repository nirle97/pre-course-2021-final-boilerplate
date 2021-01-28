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

addTaskButton.addEventListener('click', appendSkeletonDiv);
addTaskButton.addEventListener('click', appendDataToDiv);
addTaskButton.addEventListener('click', appendTaskToMyTodo);
addTaskButton.addEventListener('click', appendToLocalStorage);
addTaskButton.addEventListener('click',CounterFunction);
sortButton.addEventListener('click', sortMyTodo);
window.addEventListener('load', onReload);

function onReload() {
    const valuesOfLocalStorage = JSON.parse(localStorage.getItem('my-todo'));
    for (let i = 0; i < valuesOfLocalStorage.length; i++) {
        appendSkeletonDiv();
        let valuesOfOBject = Object.values(valuesOfLocalStorage[i]);
        prioritySelector.value = valuesOfOBject[0];
        textInput.value = valuesOfOBject[2];
        appendDataToDiv();
    }
    myTodo = JSON.parse(localStorage.getItem('my-todo'))
    CounterFunction();
}

function CounterFunction() {
    counter.textContent = viewSection.childElementCount;
}

function appendSkeletonDiv() {
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

function appendDataToDiv() {
    if (textInput.value === '' &&  localStorage.length > 0 && myTodo.length > 0) return;

    let prioritiesDivs = document.querySelectorAll(".todo-priority");
    prioritiesDivs[prioritiesDivs.length - 1].textContent = prioritySelector.value;

    let datesDivs = document.querySelectorAll(".todo-created-at")
    let getTime = new Date().getTime();
    let SqlDate = (new Date(getTime)).toLocaleString("en-GB").split(',').join(' ');
    datesDivs[datesDivs.length - 1].textContent = SqlDate;

    let textDivs = document.querySelectorAll(".todo-text")
    textDivs[textDivs.length - 1].textContent = textInput.value;

    textInput.value = '';
}

function appendTaskToMyTodo() {
    let lastDiv = viewSection.lastChild;
    let taskInfo = {
        "priority": `${lastDiv.querySelector(".todo-priority").textContent}`,
        "date": `${lastDiv.querySelector(".todo-created-at").textContent}`,
        "input": `${lastDiv.querySelector(".todo-text").textContent}`
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
        todoInputContainer.textContent = myTodo[i].input;
        todoContainer.appendChild(todoInputContainer);

        childrenSortedList.push(todoContainer); 

    }
    viewSection.textContent = '';
    for (div of childrenSortedList) {
        viewSection.appendChild(div);
    }
}

