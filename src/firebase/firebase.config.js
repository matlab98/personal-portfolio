import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDCHj8v7mV66PS2ksGMUdUvoao1bwhvb0c",
    authDomain: "sistema-alfa-84c19.firebaseapp.com",
    projectId: "sistema-alfa-84c19",
    storageBucket: "sistema-alfa-84c19.appspot.com",
    messagingSenderId: "527837409519",
    appId: "1:527837409519:web:558dbc412f00871d9aeb1a",
    measurementId: "G-SV7KWHB929"
};

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export {
    db,
    firebase
}