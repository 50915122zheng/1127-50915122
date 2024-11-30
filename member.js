// Firebase 初始化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, push, set, remove, onValue, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyDVEBr0jKL-wy84UGNfZ_M4mdZMrtceJ3U",
  authDomain: "project-2238004657865001506.firebaseapp.com",
  databaseURL: "https://project-2238004657865001506-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-2238004657865001506",
  storageBucket: "project-2238004657865001506.firebasestorage.app",
  messagingSenderId: "727875437565",
  appId: "1:727875437565:web:77f90aa64c410dbc590f94",
  measurementId: "G-6XG7QCLFH4"
};

// 初始化 Firebase 應用
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM 元素
const authInfoModal = new bootstrap.Modal(document.getElementById("authInfoModal"));
const authInfoDiv = document.getElementById("auth-info");
const logoutButton = document.getElementById("logout");
const showAuthInfoButton = document.getElementById("show-auth-info");
const dataForm = document.getElementById("data-form");
const dataTableBody = document.getElementById("data-table-body");
const dataTitle = document.getElementById("data-title");
const dataContent = document.getElementById("data-content");

let currentUser = null;

// 確認用戶是否已登入
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    const userRef = ref(database, `users/${currentUser.uid}`);
    loadUserData(); // 讀取該用戶的資料
    
  } else {
    alert("未登入，將跳回首頁！");
    window.location.href = "index.html";
  }
});

// 顯示認證資訊
showAuthInfoButton.addEventListener("click", () => {
  if (currentUser) {
    const { displayName, email, photoURL, uid } = currentUser;
    authInfoDiv.innerHTML = `
      <p><strong>名稱:</strong> ${displayName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>UID:</strong> ${uid}</p>
      <img src="${photoURL}" alt="User Photo" style="width:100px; height:100px;" />
    `;
    authInfoModal.show();
  }
});

// 登出
logoutButton.addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("已登出！");
    window.location.href = "index.html";
  });
});

// 資料新增功能
dataForm.addEventListener("submit", (e) => {
    e.preventDefault(); // 防止表單重新載入頁面
  
    // 定位到該用戶的資料節點
    const dataRef = ref(database, `users/${currentUser.uid}/data`);
  
    // 新增資料到 Firebase
    const newDataRef = push(dataRef); // 自動生成一個唯一的節點
    set(newDataRef, {
      title: dataTitle.value,  // 使用者輸入的標題
      content: dataContent.value, // 使用者輸入的內容
      timestamp: new Date().toISOString() // 加入時間戳記
    })
      .then(() => {
        alert("資料新增成功！");
        dataTitle.value = ""; // 清空表單
        dataContent.value = ""; // 清空表單
        dataModal.hide(); // 提交成功後關閉 Modal
      })
      .catch((error) => {
        console.error("新增資料時發生錯誤：", error);
      });
  });
  
  

  function loadUserData() {
    const dataRef = ref(database, `users/${currentUser.uid}/data`);
    onValue(dataRef, (snapshot) => {
      dataTableBody.innerHTML = ""; // 清空表格
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        
        // 格式化時間戳
        const formattedTime = data.timestamp 
          ? new Date(data.timestamp).toLocaleString() 
          : "無時間紀錄";
  
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${data.title}</td>
          <td>${data.content}</td>
          <td>${formattedTime}</td> <!-- 顯示時間 -->
          <td>
            <button class="btn btn-success btn-sm edit-btn" data-id="${childSnapshot.key}">編輯</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${childSnapshot.key}">刪除</button>
          </td>
        `;
  
        dataTableBody.appendChild(row);
      });
  
      // 綁定編輯和刪除按鈕
      document.querySelectorAll(".edit-btn").forEach((button) =>
        button.addEventListener("click", (e) => {
          const key = e.target.dataset.id;
          editData(key);
        })
      );
  
      document.querySelectorAll(".delete-btn").forEach((button) =>
        button.addEventListener("click", (e) => {
          const key = e.target.dataset.id;
          deleteData(key);
        })
      );
    });
  }
  

// 資料編輯
function editData(key) {
  const dataRef = ref(database, `users/${currentUser.uid}/data/${key}`);
  const title = prompt("輸入新的標題:");
  const content = prompt("輸入新的內容:");
  if (title && content) {
    update(dataRef, { title, content });
  }
}

// 資料刪除功能
function deleteData(key) {
    Swal.fire({
      title: "確定要刪除嗎？",
      text: "刪除後將無法恢復！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "是的，刪除！",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        const dataRef = ref(database, `users/${currentUser.uid}/data/${key}`);
        remove(dataRef)
          .then(() => {
            Swal.fire("已刪除！", "該筆資料已成功刪除。", "success");
          })
          .catch((error) => {
            Swal.fire("刪除失敗", "發生錯誤，無法刪除資料。", "error");
            console.error("刪除資料時發生錯誤：", error);
          });
      }
    });
  }
  const openDataModalButton = document.getElementById("openDataModal");
const dataModal = new bootstrap.Modal(document.getElementById("dataModal"));

// 打開 Modal
openDataModalButton.addEventListener("click", () => {
  dataModal.show(); // 顯示資料填寫的 Modal
});


  