//event listener on the window
window.addEventListener("online", checkIndexedDB);

//new indexeddb request for "budget", version 1
const request = indexedDB.open("budget", 1);

//initialize db
let db;


request.onupgradeneeded = function(event) {
    const db = event.target.result;
    //create pending object store for transactions made offline, auto-increment
    db.createObjectStore("pending", {autoIncrement: true});
};

request.onsucess = function(event) {
    db = event.target.result;
    //check if online before reading from db
    if (navigator.online) {
        checkIndexedDB();
    }
}
    
//error handling
request.onerror = function(e) {
    console.log("Error! " + e.target.errorCode);
};

function saveRecord(record) {
    //transaction on pending db with readwrite permissions
    const transaction = db.transaction(["pending"], "readwrite");

    //access pending object store
    const store = transaction.objectStore("pending");

    //add record to pending object store
    store.add(record);

};

function checkIndexedDB() {
    //open transaction
    const transaction = db.transaction(["pending"], "readwrite");

    //access pending object store
    const store = transaction.objectStore("pending");

    //get records from the store; store in a variable
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*", 
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                //if success, open transaction on pending 
                const transaction = db.transaction(["pending"], "readwrite");

                //access pending object store
                const store = transaction.objectStore("pending");

                //clear the pending object store
                store.clear();
            })
        }
    }
}

//check for app coming back online
// window.addEventListener("online", checkIndexedDB);