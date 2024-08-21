// Your web app's Firebase configuration
const firebaseConfig = {
    piKey: "AIzaSyDnnHjkUGjHMyCqI5MQspJHR-eJbKwvR00",
    authDomain: "past-jordan.firebaseapp.com",
    projectId: "past-jordan",
    storageBucket: "past-jordan.appspot.com",
    messagingSenderId: "541138565069",
    appId: "1:541138565069:web:e1c0971d58149b98c0f684",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage(app);

// Function to search for a folder and display its contents
function searchFolder() {
    const folderName = document.getElementById('folderInput').value;

    if (!folderName) {
        document.getElementById('results').innerHTML = 'Please enter a folder name.';
        return;
    }

    const storageRef = storage.ref(folderName);

    storageRef.listAll()
        .then((res) => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // Clear previous results

            if (res.items.length === 0) {
                resultsDiv.innerHTML = 'No files found in this folder.';
                return;
            }

            res.items.forEach((itemRef) => {
                itemRef.getDownloadURL().then((url) => {
                    const fileName = itemRef.name;

                    const fileLink = document.createElement('a');
                    fileLink.href = url;
                    fileLink.textContent = fileName;
                    fileLink.download = fileName;

                    resultsDiv.appendChild(fileLink);
                    resultsDiv.appendChild(document.createElement('br'));
                }).catch((error) => {
                    console.error(`Error getting download URL for ${itemRef.name}:`, error);
                });
            });
        })
        .catch((error) => {
            console.error('Error fetching folder contents:', error);
            document.getElementById('results').innerHTML = 'Error fetching folder contents.';
        });
}

