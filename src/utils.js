// Gets data from persistent storage by the given key and returns it
async function getPersistent() {
    let options = { 
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": "$2b$10$G3u8we1g.QbRfXsTOlEDiOFzRlmSXqbljvIljPRyQEe0uvwz8qX1K",
        },
    };
    const response = await fetch ('https://api.jsonbin.io/v3/b/601308a5b41a937c6d536c6f' + '/latest', options);
    if (response.ok) {
        let responseJSON = await response.json();
        let responseRecord = responseJSON["record"];
        myToDo = responseRecord["my-todo"];
        return myToDo;
    };
};

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
async function setPersistent() {
    const options = { 
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": "$2b$10$G3u8we1g.QbRfXsTOlEDiOFzRlmSXqbljvIljPRyQEe0uvwz8qX1K",
        },
        body: JSON.stringify({"my-todo": myToDo})
    };
    const response = await fetch('https://api.jsonbin.io/v3/b/601308a5b41a937c6d536c6f', options)
    if (response.ok) return true;
};