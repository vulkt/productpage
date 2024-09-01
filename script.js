// Ensure the Firebase storage object is available
let storage;

try {
    storage = firebase.storage();
    firestore = firebase.firestore();
} catch (error) {
    console.error("Error accessing Firebase services: ", error);
}

// Global variable to store folder name from 'comp' field
let folderName = '';

// Function to check if the password is valid and retrieve folder name
function checkPassword() {
    const password = document.getElementById('passwordInput').value.trim();

    if (!password) {
        document.getElementById('initial-error').innerHTML = 'Please enter a password.';
        return;
    }

    // Reference to the 'passwords' collection in Firestore
    const passwordRef = firestore.collection('passwords').doc(password);

    passwordRef.get()
        .then((doc) => {
            if (doc.exists) {
                folderName = doc.data().comp; // Get the 'comp' field value
                document.getElementById('initial-page').style.display = 'none';
                document.getElementById('choice-page').style.display = 'block';
            } else {
                document.getElementById('initial-error').innerHTML = 'Password not found.';
            }
        })
        .catch((error) => {
            console.error('Error fetching password:', error);
            document.getElementById('initial-error').innerHTML = 'Error checking password.';
        });
}

// Function to go to the download page
function goToDownloadPage() {
    document.getElementById('choice-page').style.display = 'none';
    document.getElementById('download-page').style.display = 'block';
    loadDownloadPage(); // Load files for download
}

// Function to go to the upload page
function goToUploadPage() {
    document.getElementById('choice-page').style.display = 'none';
    document.getElementById('upload-page').style.display = 'block';
}

// Function to go back to the choice page
function backToChoice() {
    document.getElementById('download-page').style.display = 'none';
    document.getElementById('upload-page').style.display = 'none';
    document.getElementById('choice-page').style.display = 'block';
}

// Function to fetch and display files for download
function loadDownloadPage() {
    if (!folderName) {
        document.getElementById('download-page').innerHTML = 'Folder name is required.';
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
                    fileLink.style.display = 'block'; // Ensures each file link is on a new line

                    resultsDiv.appendChild(fileLink);
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

// Function to handle drag-and-drop file uploads
function handleDrop(event) {
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
    
    if (!folderName) {
        document.getElementById('upload-results').innerHTML = 'Folder name is required.';
        return;
    }

    const files = event.dataTransfer.files; // Get the files dropped by the user
    const resultsDiv = document.getElementById('upload-results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (files.length === 0) {
        resultsDiv.innerHTML = 'No files were dropped.';
        return;
    }

    for (let file of files) {
        const storageRef = storage.ref(`${folderName}/${file.name}`);
        
        storageRef.put(file).then((snapshot) => {
            console.log(`Uploaded file: ${file.name}`);
            resultsDiv.innerHTML += `<p>Uploaded file: ${file.name}</p>`;
        }).catch((error) => {
            console.error('Error uploading file:', error);
            resultsDiv.innerHTML += `<p>Error uploading file: ${file.name}</p>`;
        });
    }
}

// Prevent default behavior for dragover and dragenter events
document.addEventListener('dragover', (event) => {
    event.preventDefault();
});

document.addEventListener('dragenter', (event) => {
    event.preventDefault();
});

// Add event listener for drop event on the upload page
document.getElementById('drop-area').addEventListener('drop', handleDrop);
