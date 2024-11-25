// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Handle Login
function login() {
  const name = document.getElementById('name').value;
  const userClass = document.getElementById('class').value;
  const age = document.getElementById('age').value;
  const role = document.querySelector('input[name="role"]:checked').value;

  if (name && userClass && age && role) {
    alert("TEAM QUESTRO WELCOMES YOU");
    if (role === "user") {
      window.location.href = "user.html";
    } else {
      window.location.href = "provider.html";
    }
  } else {
    alert("Please fill in all fields!");
  }
}

// Handle User Request Submission
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

// Complete a Request
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

// Rate Provider
function rateProvider(providerId) {
  db.collection("providers").doc(providerId).update({
    stars: firebase.firestore.FieldValue.increment(1),
  })
    .then(() => alert("Provider rated successfully!"))
    .catch((error) => console.error("Error rating provider: ", error));
}

// Display User's Completed Requests
function loadUserRequests() {
  const userRequestList = document.getElementById('user-request-list');
  userRequestList.innerHTML = "";

  db.collection("requests").where("status", "==", "completed").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const request = doc.data();
        const requestElement = document.createElement("div");
        requestElement.innerHTML = `
          <h4>${request.subject}</h4>
          <p>Chapter: ${request.chapter}</p>
          <p>Status: Completed</p>
          <a href="${request.fileURL}" target="_blank">Download Work</a>
        `;
        userRequestList.appendChild(requestElement);
      });
    })
    .catch((error) => console.error("Error loading user requests: ", error));
}
