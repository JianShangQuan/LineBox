const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, remove, onValue, off} = require('firebase/database');

// console.log(firebase);

const config = {
    apiKey: "BJKemhuwY7UeGnLTlzPEyRzHOYpfHFTZstGH4XJmEWxexH7zlivlXO3vZeigxNs0RHkRkqcqGKyzDT_Ipk4YMPU",
    authDomain: "linebox-3725d.firebaseapp.com",
    databaseURL: "https://linebox-3725d-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "linebox-3725d.appspot.com"
}


const app = initializeApp(config);

console.log('DB initialized');


module.exports = {
    db: getDatabase(app),
    app, ref, set, get, remove,
    off,
    onValue
};