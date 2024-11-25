// firebase-init.js

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD9clFYb6g5DIac64ElQ_Yez1l2LKxRWFU",
    authDomain: "questro01.firebaseapp.com",
    projectId: "questro01",
    storageBucket: "questro01.firebasestorage.app",
    messagingSenderId: "374170494299",
    appId: "1:374170494299:web:7b48878706bc66124b267e",
    measurementId: "G-214C2R14ZQ"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

  <!-- Link to your Firebase Initialization script -->
  <script src="https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.1.2/firebase-storage.js"></script>
  <script src="firebase-init.js"></script> <!-- External JS file -->
</head>
<body>
