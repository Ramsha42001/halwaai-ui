import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDsV8DOHu_RfG1suWNBXFKKJvwC3We-qR8",
    authDomain: "halwai-d8f5e.firebaseapp.com",
    databaseURL: "https://halwai-d8f5e-default-rtdb.firebaseio.com",
    projectId: "halwai-d8f5e",
    storageBucket: "halwai-d8f5e.firebasestorage.app",
    messagingSenderId: "131932878016",
    appId: "1:131932878016:web:7254df2150e356ccbb6925",
    measurementId: "G-6PHL3J5SB3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, database, googleProvider };