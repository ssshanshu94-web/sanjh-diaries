import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMwXeNFVww1evSllGFUzHfjzT69KzDOJw",
  authDomain: "sanjhdiaries.firebaseapp.com",
  projectId: "sanjhdiaries",
  storageBucket: "sanjhdiaries.firebasestorage.app",
  messagingSenderId: "606708531528",
  appId: "1:606708531528:web:de374235e6951783cdf37d",
  measurementId: "G-67VNHGX800"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
window.firebaseCollection = collection;
window.firebaseAddDoc = addDoc;
window.firebaseGetDocs = getDocs;
window.firebaseDoc = doc;
window.firebaseDeleteDoc = deleteDoc;
window.firebaseUpdateDoc = updateDoc;
window.firebaseQuery = query;
window.firebaseOrderBy = orderBy;
window.firebaseRef = ref;
window.firebaseUploadBytesResumable = uploadBytesResumable;
window.firebaseGetDownloadURL = getDownloadURL;
window.firebaseDeleteObject = deleteObject;
window.firebaseSignInWithEmailAndPassword = signInWithEmailAndPassword;
window.firebaseCreateUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.firebaseSignOut = signOut;
window.firebaseOnAuthStateChanged = onAuthStateChanged;
