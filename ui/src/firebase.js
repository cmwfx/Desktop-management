// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyA6KPE_Ojkoero-cJFnRLdYDcRmhMek6cc",
	authDomain: "desktop-management.firebaseapp.com",
	projectId: "desktop-management",
	storageBucket: "desktop-management.firebasestorage.app",
	messagingSenderId: "261908859402",
	appId: "1:261908859402:web:3adcb47c2ac8b0c4dcedf3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, auth };
