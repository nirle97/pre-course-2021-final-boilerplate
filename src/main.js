const body = document.body;
const viewSection = document.querySelector(".view-section");  
const textInput = document.querySelector('#text-input'); 
const addTaskButton = document.querySelector('#add-button'); 
const prioritySelector = document.querySelector('#priority-selector'); 
const counter = document.querySelector('#counter'); 
const sortButton = document.querySelector('#sort-button'); 

let tasksData = [];

addTaskButton.addEventListener('click', appendDivTask);
addTaskButton.addEventListener('click', appendTaskToJson);
addTaskButton.addEventListener('click', () => counter.textContent = viewSection.childElementCount);
sortButton.addEventListener('click', sortTasksData);

function appendDivTask() {
    if (textInput.value === '') return;

    const todoContainer = document.createElement('div')
    todoContainer.classList.add("todo-container");

    const todoPriorityContainer = document.createElement('div')
    todoPriorityContainer.classList.add("todo-priority");
    todoPriorityContainer.textContent = prioritySelector.value;
    todoContainer.appendChild(todoPriorityContainer);

    const todoDateContainer = document.createElement('div')
    todoDateContainer.classList.add("todo-created-at");
    let SqlDate = (new Date()).toLocaleString("en-GB").split(',').join(' ');
    todoDateContainer.textContent = SqlDate;
    todoContainer.appendChild(todoDateContainer);
    
    const todoInputContainer = document.createElement('div')
    todoInputContainer.classList.add("todo-text");
    todoInputContainer.textContent = textInput.value;
    todoContainer.appendChild(todoInputContainer);
    textInput.value = '';

    viewSection.appendChild(todoContainer);
}

function appendTaskToJson() {
    let lastDiv = viewSection.lastChild;
    let taskInfo = {
        // "id": `${tasksData.length}`,
        "priority": `${lastDiv.querySelector(".todo-priority").textContent}`,
        "date": `${lastDiv.querySelector(".todo-created-at").textContent}`,
        "input": `${lastDiv.querySelector(".todo-text").textContent}`
    };
    tasksData.push(taskInfo);
    console.log(tasksData);
}

function sortTasksData() {
    tasksData = tasksData.sort(function (a, b) {return b.priority - a.priority});
    childrenSortedList = [];
    for (let i = 0; i < tasksData.length; i++) {

        const todoContainer = document.createElement('div')
        todoContainer.classList.add("todo-container");

        const todoPriorityContainer = document.createElement('div')
        todoPriorityContainer.classList.add("todo-priority");
        todoPriorityContainer.textContent = tasksData[i].priority;
        todoContainer.appendChild(todoPriorityContainer);

        const todoDateContainer = document.createElement('div')
        todoDateContainer.classList.add("todo-created-at");
        todoDateContainer.textContent = tasksData[i].date;
        todoContainer.appendChild(todoDateContainer);
        
        const todoInputContainer = document.createElement('div')
        todoInputContainer.classList.add("todo-text");
        todoInputContainer.textContent = tasksData[i].input;
        todoContainer.appendChild(todoInputContainer);

        childrenSortedList.push(todoContainer); 

    }
    viewSection.textContent = '';
    for (div of childrenSortedList) {
        viewSection.appendChild(div);
    }
}

