function searchFolder() {
    alert("Search button clicked!");

    const folderName = document.getElementById('folderInput').value;

    console.log(`Searching for folder: ${folderName}`);

    if (!folderName) {
        console.error('No folder name provided.');
        document.getElementById('results').innerHTML = 'Please enter a folder name.';
        return;
    }

    const storageRef = storage.ref(folderName);

    storageRef.listAll()
        .then((res) => {
            console.log('Folder found, listing contents...');
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            if (res.items.length === 0) {
                console.log('No files found in this folder.');
                resultsDiv.innerHTML = 'No files found in this folder.';
                return;
            }

            res.items.forEach((itemRef) => {
                itemRef.getDownloadURL().then((url) => {
                    const fileName = itemRef.name;
                    console.log(`Found file: ${fileName} - URL: ${url}`);

                    const fileLink = document.createElement('a');
                    fileLink.href = url;
                    fileLink.textContent = fileName;
                    fileLink.download = fileName;

                    resultsDiv.appendChild(fileLink);
                    resultsDiv.appendChild(document.createElement('br'));
                }).catch((error) => {
                    console.error(`Error getting download URL for ${itemRef.name}:`, error);
                    document.getElementById('results').innerHTML += `Error getting URL for ${itemRef.name}.<br>`;
                });
            });
        })
        .catch((error) => {
            console.error('Error fetching folder contents:', error);
            document.getElementById('results').innerHTML = 'Error fetching folder contents.';
        });
}
