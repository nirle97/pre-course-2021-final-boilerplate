const HOST = "http://localhost:3000/b";

async function postRequest(task) {
    const options = { 
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"my-todo": task}, null, 4)
    };
    try {
        spinner.classList.toggle("spinner-appearance");
        const response = await fetch(`${HOST}/`, options)
        spinner.classList.toggle("spinner-appearance");

        if (response.status !== 200) {
          throw new Error(response.status)
        }
    } catch(e) {
        spinner.classList.toggle("spinner-appearance");
        console.error(`${e} There is a problem with the ${options.method} request`);
        alert("All apologizes, an error occurred :(")
    };
};
async function putRequest(id, updatedTask) {
    const options = { 
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"my-todo": updatedTask}, null, 4)
    };
    try {
        spinner.classList.toggle("spinner-appearance");
        const response = await fetch(`${HOST}/${id}`, options)
        spinner.classList.toggle("spinner-appearance");

        if (response.status !== 200) {
          throw new Error(response.status)
        }
    } catch(e) {
        spinner.classList.toggle("spinner-appearance");
        console.error(`${e} There is a problem with the ${options.method} request`);
        alert("All apologizes, an error occurred :(")
    };
};

async function getRequest() {
    const options = { 
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        const response = await fetch(`${HOST}/`, options)
        spinner.classList.toggle("spinner-appearance");
        if (response.status !== 200) {
            throw new Error(response.status)
        }
        const resJson = await response.json();
        for (task of resJson) {myToDo.push(task["my-todo"])};
        return myToDo;

    } catch(e) {
        spinner.classList.toggle("spinner-appearance");
        console.error(`${e} There is a problem with the ${options.method} request`);
        alert("All apologizes, an error occurred :(")
    };
};

async function deleteAllRequest() {
    const options = { 
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        spinner.classList.toggle("spinner-appearance");
        const response = await fetch(`${HOST}/`, options)
        spinner.classList.toggle("spinner-appearance");

        if (response.status !== 200) {
          throw new Error(response.status)
        }
    } catch(e) {
        spinner.classList.toggle("spinner-appearance");
        console.error(`${e} There is a problem with the ${options.method} request`);
        alert("All apologizes, an error occurred :(")
    };
};

async function deleteRequest(id) {
    const options = { 
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        spinner.classList.toggle("spinner-appearance");
        const response = await fetch(`${HOST}/${id}`, options)
        spinner.classList.toggle("spinner-appearance");
        
        if (response.status !== 200) {
          throw new Error(response.status)
        }
    } catch(e) {
        spinner.classList.toggle("spinner-appearance");
        console.error(`${e} There is a problem with the ${options.method} request`);
        alert("All apologizes, an error occurred :(")
    };
};