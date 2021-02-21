//This process of adding a text works in a number of steps after click the add button:
// 1. The DOM tree with all the requires divs in established: function "createSkeletonTomyToDo".
// 2. The data from the user is assign to the divs: function "appendDataToTasksDiv".
// 3. The data from the user is assign to the JSON object "myToDo" variable: function "appendTaskTomyToDo" (also set the data in jsonbin).
// 4. the data is saved in the local storage / in the jsonbin server: function "appendToLocalStorage".
// All the rest features are based on the functions above.

// General variables declaration
const body = document.body;
const scrollButton = document.querySelector("#scroll-button");
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
const tasksTitles = document.querySelector(".task-titles");
const spinner = document.querySelector('img[class="spinner-image"]');
// const { v4: uuidv4 } = require("uuid");
// console.log(uuidv4());
// JSON file storing the tasks data 
let myToDo = [];

// All the events handlers 
addTaskButton.addEventListener('click', createSkeletonTomyToDo);
addTaskButton.addEventListener('click', appendDataToTasksDiv);
addTaskButton.addEventListener('click', appendTaskTomyToDo);
addTaskButton.addEventListener('click',CounterFunction);
sortButton.addEventListener('click', sortmyToDo);
clearButton.addEventListener('click', clearAll);
window.addEventListener('load', onReload);
scrollButton.addEventListener("click", smoothScroll);
function smoothScroll(e) {
    e.preventDefault();
    const href = scrollButton.getAttribute("href");
    const offsetTop = document.querySelector(href).offsetTop;
   
    scroll({
      top: offsetTop,
      behavior: "smooth"
    });
  }

// EventListener of addTaskButton.
// Function to build the DOM tree divided into div tags. 
function createSkeletonTomyToDo() {
    if (textInput.value === '' && myToDo.lengt >= 0) return; // prevent adding a task when input is empty.

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
    tasksTitles.style.display = 'inline-block'; //hide the task's titles

}

// EventListener of addTaskButton.
// Take the data from the user and append it to the divs (convert date to SQL format).
function appendDataToTasksDiv() {
    if (textInput.value === '' && myToDo.lengt >= 0) return; // prevent adding a task when input is empty.

    if (textInput.value !== '' && prioritySelector.value === '') prioritySelector.value = 1; //set default priority to 1
    let prioritiesDivs = document.querySelectorAll(".todo-priority");
    prioritiesDivs[prioritiesDivs.length - 1].textContent = prioritySelector.value;

    let textDivs = document.querySelectorAll(".todo-text")
    textDivs[textDivs.length - 1].textContent = textInput.value;
    
    let datesDivs = document.querySelectorAll(".todo-created-at")
    let taskDate = (new Date).toISOString().slice(0,19).replace("T"," ");
    taskDate = taskDate.slice(0, 11) + (Number(taskDate.slice(11, 13)) + 2) + taskDate.slice(13, taskDate.length)
    datesDivs[datesDivs.length - 1].textContent = taskDate;

    controlSection.reset(); //clean the input and priority boxes
};

// EventListener of addTaskButton.
// push the task's data into the myToDo JSON.
// the date is converted to milliseconds.
function appendTaskTomyToDo() {
    let lastDiv = viewSection.lastChild;
        const dateForUser = (lastDiv.querySelector(".todo-created-at").textContent);
        const [first, second] = dateForUser.split(' ').map(item => item.trim());
        const [year, month, day] = first.split('-');
        const [hours, minutes, seconds] = second.split(':');
        const dateFormyToDo = new Date(year, month - 1, day, hours, minutes, seconds); 
    let taskInfo = {
        "priority": `${lastDiv.querySelector(".todo-priority").textContent}`,
        "date": `${dateFormyToDo.getTime()}`, //convert date to milliseconds
        "text": `${lastDiv.querySelector(".todo-text").textContent}`,
    };
    myToDo.push(taskInfo);
    postRequest(taskInfo);
}   

// EventListener of sortButton.
// looping through all the task's main div (class="todo-container") and change the siblings' order in the DOM tree.
// assign myToDo with the sorted values to the local storage / jsonbin.
async function sortmyToDo() {
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
    await deleteAllRequest();

    for (task of myToDo) {
        await postRequest(task)     
    };
};
// EventListener of sortButton.
// remove a task's div from the DOM tree and the object from myToDo and local storage / jsonbin.
function removeTask(e) {
    const confirmMessage = confirm("Hey Champ! are you sure you want to delete the task?");
    if (confirmMessage) {
        let targetTask = e.target.parentNode;
        targetTask.remove()
        const taskText = targetTask.querySelector(".todo-text").textContent;
        let indexCounter = 0;
        for (task of myToDo) {
            if (task.text === taskText) {
                deleteRequest(task.date)
                myToDo.splice(indexCounter, 1);
                if (myToDo.length === 0) {
                    tasksTitles.style.display = 'none';
                };
            };
            indexCounter++;
        }
        CounterFunction();
    };
};

// Counts how many children the view-section has.
// show text according to the number
function CounterFunction() {
    counter.textContent = viewSection.childElementCount;
    if (counter.textContent === '0' || counter.textContent === "") {
        counterLabel.textContent = "You made all the tasks!";
        counter.textContent = "";
        return;
    } counterLabel.textContent = 'Total remaining tasks are: ';
}

// EventListener of clearButton.
// clear the local storage and all the viewSection content.
function clearAll() {
    viewSection.textContent = '';
    myToDo = [];
    deleteAllRequest(); 
    CounterFunction();
    controlSection.reset();
    tasksTitles.style.display = 'none';
}
// EventListener of the check-Button.
// add a style of line-through
function checkTask(e) {
    let task = e.target.parentNode;
    task.classList.toggle("check-task");
    for (let i = 0; i < document.querySelectorAll("div.todo-container").length; i++) {
        if (document.querySelectorAll("div.todo-container")[i].getAttribute("class").includes("check-task")) {
            myToDo[i]["was-checked"] = true;
        } else {
            myToDo[i]["was-checked"] = false;
        }
        putRequest(myToDo[i]["date"],  myToDo[i]);
    };
};

function recheckTaskOnReload() {
    for (let i = 0; i < myToDo.length; i++) {
        if (myToDo[i]["was-checked"] === true) {
            document.querySelectorAll("div.todo-container")[i].classList.toggle("check-task");
        };
    };
};

// EventListener of addTaskButton.
// On page reloading all the data is retrieved from the local storage / jsonbin.
// New Dom tree is being built with a division into <div> tags.
// The objects from the local storage / jsonbin are being appended to the <div>s.
async function onReload() {
    await getRequest();
    console.log(myToDo);
    if (myToDo.length < 1) {
        tasksTitles.style.display = 'none';
        CounterFunction();
        return;
    }

    for (let i = 0; i < myToDo.length; i++) { //loop through all the tasks and re-create the DOM tree.
        createSkeletonTomyToDo();
        let valuesOfmyToDoObject = Object.values(myToDo[i]);
        prioritySelector.value = valuesOfmyToDoObject[0];
        textInput.value = valuesOfmyToDoObject[2];
        
        appendDataToTasksDiv();
        // convert milliseconds back to SQL date
        let datesDivs = document.querySelectorAll(".todo-created-at")
        let dateInMilliseconds = Number(valuesOfmyToDoObject[1]);
        let sqlDate = (new Date(dateInMilliseconds)).toISOString().slice(0,19).replace("T"," ");
        datesDivs[datesDivs.length - 1].textContent = sqlDate;
    }
    recheckTaskOnReload();
    CounterFunction()
} 
