// General variables defining
const body = document.body;
let scrollButton = document.querySelector("#welcome-page")
const viewSection = document.querySelector(".view-section");  
const controlSection = document.querySelector(".control-section");  
const textInput = document.querySelector('#text-input'); 
const addTaskButton = document.querySelector('#add-button'); 
const prioritySelector = document.querySelector('#priority-selector'); 
const counter = document.querySelector('#counter');
const counterLabel = document.querySelector('.counter-label') 
const sortButton = document.querySelector('#sort-button'); 
const clearButton = document.getElementById("clear");
const select = document.getElementById("priority-selector");
const tasksTitles = document.querySelector(".task-titles")

// JSON file storing the tasks data 
let myToDo = [];

// getPersistent()
// All the events handlers 
addTaskButton.addEventListener('click', createSkeletonTomyToDo);
addTaskButton.addEventListener('click', appendDataToTasksDiv);
addTaskButton.addEventListener('click', appendTaskTomyToDo);
addTaskButton.addEventListener('click', appendToLocalStorage);
addTaskButton.addEventListener('click',CounterFunction);
sortButton.addEventListener('click', sortmyToDo);
clearButton.addEventListener('click', clearAll);
window.addEventListener('load', onReload);

// EventListener of addTaskButton.
// On page reloading all the data is retrieved from the local storage / jsonbin.
// New Dom tree is being built with a division into <div> tags.
// The objects from the local storage / jsonbin are being appended to the <div>s.
function onReload() {
    // await getPersistent();

    if (localStorage.length === 0) return;
    objectsofmyToDo = JSON.parse(localStorage.getItem('my-todo'));
    
    for (let i = 0; i < objectsofmyToDo.length; i++) {
        createSkeletonTomyToDo();

        let valuesOfmyToDoObject = Object.values(objectsofmyToDo[i]);
        prioritySelector.value = valuesOfmyToDoObject[0];
        textInput.value = valuesOfmyToDoObject[2];

        appendDataToTasksDiv();

        let datesDivs = document.querySelectorAll(".todo-created-at")
        let dateInMilliseconds = Number(valuesOfmyToDoObject[1]);
        let sqlDate = (new Date(dateInMilliseconds)).toLocaleString("en-GB").split(',').join(' ');
        datesDivs[datesDivs.length - 1].textContent = sqlDate;
    }
    myToDo = JSON.parse(localStorage.getItem('my-todo'))
    CounterFunction()
}

// Counts how many children the view-section has.
// Each child is a task.
function CounterFunction() {
    counter.textContent = viewSection.childElementCount;
    if (counter.textContent === '0') {
        counterLabel.textContent = "You made all the tasks!";
        counter.textContent = "";
        return;
    } counterLabel.textContent = 'Total tasks you have left is:';
}

// EventListener of addTaskButton.
// Function to build the DOM tree divided into div tags. 
function createSkeletonTomyToDo() {

    const todoContainer = document.createElement('div'); // main task container
    todoContainer.classList.add("todo-container");

    const todoPriorityContainer = document.createElement('div') // priority container
    todoPriorityContainer.classList.add("todo-priority");

    const todoDateContainer = document.createElement('div') // date container
    todoDateContainer.classList.add("todo-created-at");
    
    const todoInputContainer = document.createElement('div') // text container
    todoInputContainer.classList.add("todo-text");

    const removeButton = document.createElement('a'); // remove task button
    removeButton.setAttribute("id", "remove-button");
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.addEventListener('click', removeTask);

    const checkButton = document.createElement('a'); // check task button
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

// EventListener of addTaskButton.
// On each click on the "add button" - the priority, date and the task's name are being wrapped inside divs.
// All the divs were created in the "createSkeletonTomyToDo" function.
function appendDataToTasksDiv() {
    if (textInput.value === '' && localStorage.length > 0 && myToDo.length === 0) return;
    if (textInput.value !== '' && prioritySelector.value === '') prioritySelector.value = 1; //set default priority to 1

    let prioritiesDivs = document.querySelectorAll(".todo-priority");
    prioritiesDivs[prioritiesDivs.length - 1].textContent = prioritySelector.value;

    let textDivs = document.querySelectorAll(".todo-text")
    textDivs[textDivs.length - 1].textContent = textInput.value;

    
    let datesDivs = document.querySelectorAll(".todo-created-at")
    let taskDate = new Date();
    let dateForUser = taskDate.toLocaleString("en-GB");
    datesDivs[datesDivs.length - 1].textContent = dateForUser;
    
    controlSection.reset(); //clean the input and priority boxes
    tasksTitles.style.display = 'inline-block'; //hide the task's titles
};

// EventListener of addTaskButton.
// push the task's data into the myToDo JSON object.
// the date is converted to milliseconds.
function appendTaskTomyToDo() {
    let lastDiv = viewSection.lastChild;
        const dateForUser = (lastDiv.querySelector(".todo-created-at").textContent);
        const [first, second] = dateForUser.split(',').map(item => item.trim());
        const [day, month, year] = first.split('/');
        const [hours, minutes, seconds] = second.split(':');
        const dateFormyToDo = new Date(year, month - 1, day, hours, minutes, seconds); 
    let taskInfo = {
        "priority": `${lastDiv.querySelector(".todo-priority").textContent}`,
        "date": `${dateFormyToDo.getTime()}`, //convert date to milliseconds
        "text": `${lastDiv.querySelector(".todo-text").textContent}`
    };
    myToDo.push(taskInfo);
    // setPersistent();
}   

// EventListener of addTaskButton.
// Save myToDo in the local storage
function appendToLocalStorage() {
    localStorage.setItem('my-todo', JSON.stringify(myToDo));
}

// EventListener of sortButton.
// looping through all the task's main div (class="todo-container") and change the siblings order in the DOM tree.
// assign myToDo with the sorted values and set it in the local storage / jsonbin.
function sortmyToDo() {
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
    myToDo = myToDo.sort(function (a, b) {return b.priority - a.priority});
    localStorage.setItem('my-todo', JSON.stringify(myToDo));
    // setPersistent();
};

// EventListener of sortButton.
// remove a task from the DOM tree, from the myToDo object and from the local storage / jsonbin.
function removeTask(e) {
    const confirmMessage = confirm("Hey Champ! are you sure you want to delete the task?");
    if (confirmMessage) {
        let targetTask = e.target.parentNode;
        targetTask.remove()
        const taskText = targetTask.querySelector(".todo-text").textContent;
        let indexCounter = 0;
        for (task of myToDo) {
            if (task.text === taskText) {
                myToDo.splice(indexCounter, 1);
                if (myToDo.length > 0) {
                    localStorage.setItem('my-todo', JSON.stringify(myToDo));
                    // setPersistent()
                } else {
                    localStorage.clear();
                    // myToDo = []
                    // setPersistent();
                    tasksTitles.style.display = 'none';
                };
            };
            indexCounter++;
        }
        CounterFunction();
    };
};

// EventListener of clearButton.
// clear the local storage and all the viewSection content.
function clearAll() {
    viewSection.textContent = '';
    myToDo = [];
    // setPersistent();
    localStorage.clear()
    CounterFunction();
    controlSection.reset();
    tasksTitles.style.display = 'none';
}

// EventListener of the check-Button.
// add a style of line-through
function checkTask(e) {
    let task = e.target.parentNode;
    task.classList.toggle("check-task");
}
