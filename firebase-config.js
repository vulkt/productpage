// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnnHjkUGjHMyCqI5MQspJHR-eJbKwvR00",
    authDomain: "past-jordan.firebaseapp.com",
    projectId: "past-jordan",
    storageBucket: "past-jordan.appspot.com",
    messagingSenderId: "541138565069",
    appId: "1:541138565069:web:e1c0971d58149b98c0f684",
};

// Initialize Firebase
try {
    const app = firebase.initializeApp(firebaseConfig);
    const storage = firebase.storage(app);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Error initializing Firebase: ", error);
}
