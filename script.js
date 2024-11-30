import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyDVEBr0jKL-wy84UGNfZ_M4mdZMrtceJ3U",
  authDomain: "project-2238004657865001506.firebaseapp.com",
  databaseURL: "https://project-2238004657865001506-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-2238004657865001506",
  storageBucket: "project-2238004657865001506.appspot.com",
  messagingSenderId: "727875437565",
  appId: "1:727875437565:web:77f90aa64c410dbc590f94",
  measurementId: "G-6XG7QCLFH4"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const signInButton = document.getElementById("sign-in");
const registerButton = document.getElementById("register");

// Google 登入
signInButton.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        update(userRef, { lastLogin: new Date().toISOString() });
        // 登入成功後跳轉到會員頁面
        window.location.href = "member.html";
      } else {
        alert("尚未註冊，請先點選註冊按鈕！");
      }
    })
    .catch((error) => console.error("登入失敗", error));
});

// Google 註冊
registerButton.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const userRef = ref(database, `users/${user.uid}`);
      set(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString()
      });
      alert("註冊成功！");
      // 註冊成功後跳轉到會員頁面
      window.location.href = "member.html";
    })
    .catch((error) => console.error("註冊失敗", error));
});
