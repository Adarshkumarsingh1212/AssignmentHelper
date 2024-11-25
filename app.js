// Firebase configuration (replace with your Firebase project details)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Handle login
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const userClass = document.getElementById('class').value;
  const age = document.getElementById('age').value;
  const role = document.getElementById('role').value;

  // Store user info in Firestore
  db.collection('users').add({
    name,
    class: userClass,
    age,
    role,
  }).then(() => {
    alert('Logged in successfully!');
    if (role === 'user') {
      window.location.href = 'user_dashboard.html';
    } else {
      window.location.href = 'provider_dashboard.html';
    }
  }).catch(err => console.error(err));
});
