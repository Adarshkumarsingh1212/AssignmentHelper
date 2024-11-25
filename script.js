// Firebase Initialization (combined)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();  // Firebase Storage for file uploads
const db = firebase.firestore();    // Firebase Firestore for data management

// Handle User Request Submission (User side)
function submitRequest() {
    const subject = document.getElementById('subject').value;
    const chapter = document.getElementById('chapter').value;
    const details = document.getElementById('details').value;

    if (subject && chapter) {
        db.collection("requests").add({
            subject,
            chapter,
            details,
            status: "pending",
        })
        .then(() => {
            alert("Request submitted successfully!");
            document.getElementById('subject').value = "";
            document.getElementById('chapter').value = "";
            document.getElementById('details').value = "";
        })
        .catch((error) => console.error("Error submitting request: ", error));
    } else {
        alert("Please fill in all required fields!");
    }
}

// Handle File Upload (Provider side)
function uploadFile(file) {
    const storageRef = storage.ref(`uploads/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    }, (error) => {
        console.log('Upload error:', error);
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            saveFileMetadata(downloadURL, file.name);
        });
    });
}

// Save File Metadata in Firestore (Provider side)
function saveFileMetadata(downloadURL, fileName) {
    const fileRef = db.collection('files').doc();  // Create a new document in Firestore

    fileRef.set({
        name: fileName,
        url: downloadURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("File metadata saved!");
    }).catch((error) => {
        console.log("Error saving metadata:", error);
    });
}

// Display Uploaded Files (User side)
function getUploadedFiles() {
    db.collection('files').orderBy('timestamp', 'desc').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const fileData = doc.data();
            const imgElement = document.createElement('img');
            imgElement.src = fileData.url;
            document.getElementById('file-display').appendChild(imgElement);  // Display image in the div
        });
    }).catch((error) => {
        console.log("Error fetching files:", error);
    });
}

// Event Listener for File Upload (When provider selects a file)
document.getElementById('upload-file').addEventListener('change', function(e) {
    const file = e.target.files[0];  // Get the selected file
    uploadFile(file); // Upload the file to Firebase
});

// Fetch and Display Files when the page loads (User side)
window.onload = function() {
    getUploadedFiles();
};

// Mark Request as Complete and Upload Files (Provider side)
function completeRequest(requestId) {
    const fileInput = document.getElementById('upload-file');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a file or photos!");
        return;
    }

    const storageRef = firebase.storage().ref(`uploads/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on("state_changed", null, (error) => {
        console.error("Error uploading file: ", error);
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            db.collection("requests").doc(requestId).update({
                status: "completed",
                fileURL: downloadURL,
            })
            .then(() => {
                alert("Request completed successfully!");
                loadRequests(); // Reload requests after completion
            })
            .catch((error) => console.error("Error marking request as complete: ", error));
        });
    });
}

// Load Requests for Providers
function loadRequests() {
    const requestList = document.getElementById('request-list');
    requestList.innerHTML = "";

    db.collection("requests").where("status", "==", "pending").get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const request = doc.data();
            const requestElement = document.createElement("div");
            requestElement.innerHTML = `
                <h4>${request.subject}</h4>
                <p>Chapter: ${request.chapter}</p>
                <p>Details: ${request.details || "No additional details provided"}</p>
                <button onclick="completeRequest('${doc.id}')">Mark as Complete</button>
            `;
            requestList.appendChild(requestElement);
        });
    })
    .catch((error) => console.error("Error loading requests: ", error));
}
