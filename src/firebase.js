const { initializeApp } = require('firebase/app');
const { getAnalytics } = require('firebase/analytics');
const { getDatabase, ref, set, get, remove, onValue, off} = require('firebase/database');

// console.log(firebase);

const config = {
    apiKey: "AIzaSyCcoQBLBxLEETyvF0b8yPXudAxaoe7nhR8",
    authDomain: "linebox-3725d.firebaseapp.com",
    databaseURL: "https://linebox-3725d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "linebox-3725d",
    storageBucket: "linebox-3725d.appspot.com",
    messagingSenderId: "307404446225",
    appId: "1:307404446225:web:1f95fbcd2029e5ca89afb0",
    measurementId: "G-7DXJW7LSM2"
}


const app = initializeApp(config);
const db = getDatabase(app);
const analytics = getAnalytics(app);

console.log('DB initialized');


module.exports = {
    db, analytics,
    app, ref, set, get, remove,
    off,
    onValue
};