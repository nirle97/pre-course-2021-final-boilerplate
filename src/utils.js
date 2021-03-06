// Gets data from persistent storage by the given key and returns it
function getPersistent() {
    let options = { 
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": "$2b$10$G3u8we1g.QbRfXsTOlEDiOFzRlmSXqbljvIljPRyQEe0uvwz8qX1K",
        },
    };

    const res = fetch ('https://api.jsonbin.io/v3/b/601308a5b41a937c6d536c6f' + '/latest', options);
    return res.then(resPromise => {
        if (!resPromise.ok) {
            throw new Error ("something went wrong")
        }

        const resJsonPromise = resPromise.json();
        return resJsonPromise.then(resJson => {
                myToDo = resJson["record"]["my-todo"];
                spinner.classList.toggle("spinner-appearance");
                return myToDo;
            });
    })
};

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
function setPersistent() {
    spinner.classList.toggle("spinner-appearance");
    const options = { 
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": "$2b$10$G3u8we1g.QbRfXsTOlEDiOFzRlmSXqbljvIljPRyQEe0uvwz8qX1K",
        },
        body: JSON.stringify({"my-todo": myToDo})
    };
    const response = fetch('https://api.jsonbin.io/v3/b/601308a5b41a937c6d536c6f', options)
    response.then((res) => {
        if (!res.ok) {
            throw new Error ("something went wrong");
        }
        spinner.classList.toggle("spinner-appearance");
        return true;
    });
};

// function mainSync() {
//     getPersistent.then(bin => {
//         console.log(bin);
//     }).catch(e => {
//         console.log("There was an error", e);
//     });
// };
// mainSync();

// function getJsonBinSync(binUrl) {
//     return window.fetch(binUrl).then((res) => {
//         if (!res.ok) {
//             throw new Error("jsonbin error. status code:", res.statusText);
//         }
//     // return 5;
//     return res.json();
// });
// }













// (async function main() {
//     const url = "https://api.jsonbin.io/v3/b/601890cadde2a87f921c401f";
//     try {
//         const bin = await getJsonBinSync(url);
//     console.log(bin);
// } catch (e) {
//     console.log("There was an error", e);
//   }
// })();
// async function getJsonBin(binUrl) {
//   const res = await window.fetch(binUrl);
//   if (!res.ok) {
//     throw new Error("jsonbin error. status code:", res.statusText);
//   }
//   const json = await res.json();
//   return json;
// }