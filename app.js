// Educo - Mobile-First Education App - Main Application Logic

// ===== Global State =====
const state = {
  user: null,
  userData: null,
  notifications: [],
  unreadCount: 0,
  currentView: 'home',
  isAdmin: false
};

// ===== DOM Elements =====
const elements = {
  loginPage: null,
  appContainer: null,
  topBar: null,
  mainContent: null,
  sideMenu: null,
  sideMenuOverlay: null,
  notificationBadge: null
};

// ===== Initialize App =====
function initApp() {
  console.log('Initializing Educo App...');
  
  // Cache DOM elements
  elements.loginPage = document.getElementById('login-page');
  elements.appContainer = document.getElementById('app-container');
  elements.topBar = document.getElementById('top-bar');
  elements.mainContent = document.getElementById('main-content');
  elements.sideMenu = document.getElementById('side-menu');
  elements.sideMenuOverlay = document.getElementById('side-menu-overlay');
  elements.notificationBadge = document.getElementById('notification-badge');
  
  // Check authentication state
  firebase.auth().onAuthStateChanged(handleAuthStateChange);
  
  // Setup event listeners
  setupEventListeners();
}

// ===== Auth State Handler =====
function handleAuthStateChange(user) {
  state.user = user;
  
  if (user) {
    console.log('User authenticated:', user.email);
    loadUserData(user.uid);
    checkAdminStatus(user.email);
    initializeFCM(user.uid);
    showApp();
  } else {
    console.log('User not authenticated');
    state.userData = null;
    state.isAdmin = false;
    showLogin();
  }
}

// ===== Load User Data =====
async function loadUserData(uid) {
  try {
    console.log('Loading user data for:', uid);
    const userDoc = await firebase.firestore().collection('users').doc(uid).get();
    
    if (userDoc.exists) {
      state.userData = userDoc.data();
      console.log('User data loaded:', state.userData);
      updateSideMenuUserInfo();
    } else {
      console.error('User document not found');
      logout();
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    showError('Failed to load user data');
  }
}

// ===== Check Admin Status =====
function checkAdminStatus(email) {
  state.isAdmin = email === 'admin@educo.app';
  console.log('Admin status:', state.isAdmin);
  updateSideMenu();
}

// ===== Initialize FCM =====
async function initializeFCM(uid) {
  try {
    console.log('Initializing FCM...');
    
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Request permission
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      
      if (permission === 'granted') {
        try {
          const token = await firebase.messaging().getToken();
          console.log('FCM Token:', token);
          
          // Save token to Firestore
          await firebase.firestore().collection('users').doc(uid).update({
            fcmToken: token
          });
          
          console.log('FCM token saved to Firestore');
        } catch (tokenError) {
          console.log('FCM token error (might be in development mode):', tokenError);
        }
        
        // Handle incoming messages
        firebase.messaging().onMessage((payload) => {
          console.log('Received FCM message:', payload);
          showNotification(payload.notification);
          loadNotifications(); // Reload notifications
        });
      }
    }
  } catch (error) {
    console.error('FCM initialization error:', error);
  }
}

// ===== Show Notification =====
function showNotification(notification) {
  if (Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.body,
      icon: '/icon-192.png'
    });
  }
}

// ===== Load Notifications =====
async function loadNotifications() {
  try {
    console.log('Loading notifications...');
    
    let query = firebase.firestore()
      .collection('notifications')
      .orderBy('timestamp', 'desc')
      .limit(50);
    
    // Filter by user class and school
    if (state.userData) {
      query = query.where('school', '==', state.userData.school)
        .where('class', '==', state.userData.class);
    }
    
    const snapshot = await query.get();
    
    state.notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date()
    }));
    
    calculateUnreadCount();
    updateNotificationBadge();
    
    console.log('Notifications loaded:', state.notifications.length);
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

// ===== Calculate Unread Count =====
function calculateUnreadCount() {
  if (!state.user) return;
  
  state.unreadCount = state.notifications.filter(notification => {
    const readBy = notification.readBy || [];
    return !readBy.includes(state.user.uid);
  }).length;
  
  console.log('Unread count:', state.unreadCount);
}

// ===== Update Notification Badge =====
function updateNotificationBadge() {
  if (!elements.notificationBadge) return;
  
  if (state.unreadCount > 0) {
    elements.notificationBadge.textContent = state.unreadCount;
    elements.notificationBadge.classList.remove('hidden');
  } else {
    elements.notificationBadge.classList.add('hidden');
  }
}

// ===== Mark Notification as Read =====
async function markNotificationAsRead(notificationId) {
  try {
    await firebase.firestore().collection('notifications').doc(notificationId).update({
      readBy: firebase.firestore.FieldValue.arrayUnion(state.user.uid)
    });
    
    // Update local state
    const notification = state.notifications.find(n => n.id === notificationId);
    if (notification) {
      if (!notification.readBy) {
        notification.readBy = [];
      }
      notification.readBy.push(state.user.uid);
    }
    
    calculateUnreadCount();
    updateNotificationBadge();
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

// ===== Show/Hide Views =====
function showLogin() {
  elements.loginPage.classList.remove('hidden');
  elements.appContainer.classList.add('hidden');
}

function showApp() {
  elements.loginPage.classList.add('hidden');
  elements.appContainer.classList.remove('hidden');
  
  // Load initial data
  loadNotifications();
  
  // Show home view
  navigateTo('home');
}

// ===== Navigation =====
function navigateTo(view, params = {}) {
  console.log('Navigating to:', view, params);
  state.currentView = view;
  
  // Update side menu active state
  document.querySelectorAll('.side-menu-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.view === view) {
      item.classList.add('active');
    }
  });
  
  // Render view
  switch(view) {
    case 'home':
      renderHome();
      break;
    case 'profile':
      renderProfile();
      break;
    case 'notifications':
      renderNotifications();
      break;
    case 'content':
      renderContentList(params);
      break;
    case 'chapters':
      renderChapterList(params);
      break;
    case 'pdf':
      renderPDFViewer(params);
      break;
    case 'admin':
      renderAdmin();
      break;
    default:
      renderHome();
  }
  
  // Close side menu
  closeSideMenu();
}

// ===== Render Home =====
async function renderHome() {
  elements.mainContent.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading content...</div>
    </div>
  `;
  
  try {
    // Fetch content based on user class and school
    const contentSnapshot = await firebase.firestore()
      .collection('content')
      .where('school', '==', state.userData.school)
      .where('class', '==', state.userData.class)
      .get();
    
    const content = contentSnapshot.docs.map(doc => doc.data());
    
    // Group content by type (books)
    const books = {};
    content.forEach(item => {
      const bookName = item.bookName || 'General';
      if (!books[bookName]) {
        books[bookName] = [];
      }
      books[bookName].push(item);
    });
    
    let html = `
      <div class="welcome-card">
        <h2>Welcome, ${state.userData.name}!</h2>
        <p>Class ${state.userData.class} • ${state.userData.board} • ${state.userData.school}</p>
      </div>
      
      <h3 class="section-title">📚 Your Books</h3>
      <div class="content-grid">
    `;
    
    Object.keys(books).forEach(bookName => {
      html += `
        <div class="content-card" onclick="navigateTo('chapters', { bookName: '${bookName.replace(/'/g, "\\'")}' })">
          <div class="content-card-icon">📖</div>
          <div class="content-card-title">${bookName}</div>
          <div class="content-card-subtitle">${books[bookName].length} chapters</div>
        </div>
      `;
    });
    
    html += `</div>`;
    
    elements.mainContent.innerHTML = html;
  } catch (error) {
    console.error('Error loading home content:', error);
    elements.mainContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❌</div>
        <div class="empty-state-text">Failed to load content</div>
        <div class="empty-state-subtext">Please try again later</div>
      </div>
    `;
  }
}

// ===== Render Content List =====
async function renderContentList(params) {
  elements.mainContent.innerHTML = `
    <h3 class="section-title">
      <button class="btn btn-sm btn-outline" onclick="navigateTo('home')">← Back</button>
      ${params.title || 'Content'}
    </h3>
    <div class="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading content...</div>
    </div>
  `;
  
  try {
    const snapshot = await firebase.firestore()
      .collection('content')
      .where('school', '==', state.userData.school)
      .where('class', '==', state.userData.class)
      .orderBy('title')
      .get();
    
    let html = `<div class="content-list">`;
    
    snapshot.docs.forEach(doc => {
      const item = doc.data();
      html += `
        <div class="content-item" onclick="navigateTo('pdf', { 
          title: '${item.title.replace(/'/g, "\\'")}',
          viewUrl: '${item.viewUrl}',
          downloadUrl: '${item.downloadUrl}'
        })">
          <div class="content-item-icon">📄</div>
          <div class="content-item-info">
            <div class="content-item-title">${item.title}</div>
            <div class="content-item-subtitle">${item.bookName || ''}</div>
          </div>
          <div class="content-item-arrow">→</div>
        </div>
      `;
    });
    
    html += `</div>`;
    
    if (snapshot.empty) {
      html = `
        <div class="empty-state">
          <div class="empty-state-icon">📚</div>
          <div class="empty-state-text">No content available</div>
          <div class="empty-state-subtext">Check back later for new content</div>
        </div>
      `;
    }
    
    elements.mainContent.innerHTML = html;
  } catch (error) {
    console.error('Error loading content list:', error);
    showError('Failed to load content');
  }
}

// ===== Render Chapter List =====
async function renderChapterList(params) {
  elements.mainContent.innerHTML = `
    <h3 class="section-title">
      <button class="btn btn-sm btn-outline" onclick="navigateTo('home')">← Back</button>
      ${params.bookName || 'Chapters'}
    </h3>
    <div class="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading chapters...</div>
    </div>
  `;
  
  try {
    const snapshot = await firebase.firestore()
      .collection('content')
      .where('school', '==', state.userData.school)
      .where('class', '==', state.userData.class)
      .where('bookName', '==', params.bookName)
      .orderBy('chapterNumber', 'asc')
      .get();
    
    let html = `<div class="chapter-list">`;
    
    snapshot.docs.forEach(doc => {
      const item = doc.data();
      html += `
        <div class="chapter-item" onclick="navigateTo('pdf', { 
          title: '${item.title.replace(/'/g, "\\'")}',
          viewUrl: '${item.viewUrl}',
          downloadUrl: '${item.downloadUrl}'
        })">
          <div class="chapter-number">${item.chapterNumber || ''}</div>
          <div class="chapter-title">${item.title}</div>
          <div class="content-item-arrow">→</div>
        </div>
      `;
    });
    
    html += `</div>`;
    
    if (snapshot.empty) {
      html = `
        <div class="empty-state">
          <div class="empty-state-icon">📖</div>
          <div class="empty-state-text">No chapters found</div>
          <div class="empty-state-subtext">This book doesn't have any chapters yet</div>
        </div>
      `;
    }
    
    elements.mainContent.innerHTML = html;
  } catch (error) {
    console.error('Error loading chapters:', error);
    showError('Failed to load chapters');
  }
}

// ===== Render PDF Viewer =====
function renderPDFViewer(params) {
  elements.mainContent.innerHTML = `
    <div class="pdf-actions">
      <button class="btn btn-outline" onclick="navigateTo('home')">← Back</button>
      <a href="${params.downloadUrl}" class="btn btn-primary" target="_blank">Download PDF</a>
    </div>
    
    <div class="pdf-viewer">
      <div class="pdf-viewer-header">
        <h3>${params.title}</h3>
      </div>
      <div class="pdf-viewer-content">
        <iframe src="${params.viewUrl}"></iframe>
      </div>
    </div>
  `;
}

// ===== Render Profile =====
function renderProfile() {
  if (!state.userData) {
    elements.mainContent.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading profile...</div>
      </div>
    `;
    return;
  }
  
  elements.mainContent.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${state.userData.name.charAt(0).toUpperCase()}</div>
      <h2>${state.userData.name}</h2>
      <p>${state.userData.email}</p>
    </div>
    
    <div class="profile-details">
      <div class="profile-detail-item">
        <div class="profile-detail-label">User ID</div>
        <div class="profile-detail-value">${state.user.uid.substring(0, 8)}...</div>
      </div>
      <div class="profile-detail-item">
        <div class="profile-detail-label">Class</div>
        <div class="profile-detail-value">${state.userData.class}</div>
      </div>
      <div class="profile-detail-item">
        <div class="profile-detail-label">Board</div>
        <div class="profile-detail-value">${state.userData.board}</div>
      </div>
      <div class="profile-detail-item">
        <div class="profile-detail-label">School</div>
        <div class="profile-detail-value">${state.userData.school}</div>
      </div>
      <div class="profile-detail-item">
        <div class="profile-detail-label">Email</div>
        <div class="profile-detail-value">${state.userData.email}</div>
      </div>
    </div>
  `;
}

// ===== Render Notifications =====
function renderNotifications() {
  let html = `<h3 class="section-title">🔔 Notifications</h3>`;
  
  if (state.notifications.length === 0) {
    html += `
      <div class="empty-state">
        <div class="empty-state-icon">🔕</div>
        <div class="empty-state-text">No notifications</div>
        <div class="empty-state-subtext">You're all caught up!</div>
      </div>
    `;
  } else {
    html += `<div class="notification-list">`;
    
    state.notifications.forEach(notification => {
      const isRead = notification.readBy && notification.readBy.includes(state.user.uid);
      const timeAgo = getTimeAgo(notification.timestamp);
      
      html += `
        <div class="notification-item ${!isRead ? 'unread' : ''}" onclick="markNotificationAsRead('${notification.id}')">
          <div class="notification-header">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-time">${timeAgo}</div>
          </div>
          <div class="notification-message">${notification.message}</div>
          <div class="notification-target">Class ${notification.class} • ${notification.school}</div>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  elements.mainContent.innerHTML = html;
}

// ===== Render Admin Panel =====
function renderAdmin() {
  if (!state.isAdmin) {
    elements.mainContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔒</div>
        <div class="empty-state-text">Access Denied</div>
        <div class="empty-state-subtext">You don't have permission to access this page</div>
      </div>
    `;
    return;
  }
  
  elements.mainContent.innerHTML = `
    <div class="admin-header">
      <h2>Admin Panel</h2>
      <p>Manage users, content, and notifications</p>
    </div>
    
    <div class="admin-tabs">
      <button class="admin-tab active" onclick="showAdminTab('users')">Users</button>
      <button class="admin-tab" onclick="showAdminTab('content')">Content</button>
      <button class="admin-tab" onclick="showAdminTab('notifications')">Notifications</button>
    </div>
    
    <div id="admin-content">
      <!-- Admin content will be loaded here -->
    </div>
  `;
  
  // Load default tab
  showAdminTab('users');
}

// ===== Show Admin Tab =====
async function showAdminTab(tab) {
  // Update active tab
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  const contentDiv = document.getElementById('admin-content');
  
  switch(tab) {
    case 'users':
      await renderAdminUsers(contentDiv);
      break;
    case 'content':
      await renderAdminContent(contentDiv);
      break;
    case 'notifications':
      await renderAdminNotifications(contentDiv);
      break;
  }
}

// ===== Render Admin Users =====
async function renderAdminUsers(container) {
  container.innerHTML = `
    <div class="admin-form">
      <h4>Create User</h4>
      <div class="form-group mt-2">
        <input type="email" id="user-email" class="form-control" placeholder="Email">
      </div>
      <div class="form-group">
        <input type="password" id="user-password" class="form-control" placeholder="Password">
      </div>
      <div class="form-group">
        <input type="text" id="user-name" class="form-control" placeholder="Full Name">
      </div>
      <div class="form-group">
        <select id="user-class" class="form-select">
          <option value="">Select Class</option>
          ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => 
            `<option value="${c}">Class ${c}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <input type="text" id="user-board" class="form-control" placeholder="Board (e.g., CBSE)">
      </div>
      <div class="form-group">
        <input type="text" id="user-school" class="form-control" placeholder="School Name">
      </div>
      <button class="btn btn-primary btn-full" onclick="createUser()">Create User</button>
    </div>
    
    <h4 class="mt-3">All Users</h4>
    <div id="users-list" class="admin-list mt-2">
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `;
  
  // Load users
  await loadUsersList();
}

// ===== Load Users List =====
async function loadUsersList() {
  const listContainer = document.getElementById('users-list');
  
  try {
    const snapshot = await firebase.firestore().collection('users').get();
    
    if (snapshot.empty) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-text">No users found</div>
        </div>
      `;
      return;
    }
    
    let html = '';
    snapshot.docs.forEach(doc => {
      const user = doc.data();
      html += `
        <div class="admin-list-item">
          <div class="admin-list-item-info">
            <div class="admin-list-item-title">${user.name}</div>
            <div class="admin-list-item-subtitle">${user.email} • Class ${user.class} • ${user.school}</div>
          </div>
          <div class="admin-list-item-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteUser('${doc.id}')">Delete</button>
          </div>
        </div>
      `;
    });
    
    listContainer.innerHTML = html;
  } catch (error) {
    console.error('Error loading users:', error);
    listContainer.innerHTML = `<div class="text-center">Failed to load users</div>`;
  }
}

// ===== Create User =====
async function createUser() {
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  const name = document.getElementById('user-name').value;
  const userClass = document.getElementById('user-class').value;
  const board = document.getElementById('user-board').value;
  const school = document.getElementById('user-school').value;
  
  if (!email || !password || !name || !userClass || !board || !school) {
    alert('Please fill all fields');
    return;
  }
  
  try {
    // Create auth user
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;
    
    // Create user document
    await firebase.firestore().collection('users').doc(uid).set({
      name,
      email,
      class: userClass,
      board,
      school,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert('User created successfully!');
    loadUsersList();
    
    // Clear form
    document.getElementById('user-email').value = '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-name').value = '';
    document.getElementById('user-class').value = '';
    document.getElementById('user-board').value = '';
    document.getElementById('user-school').value = '';
  } catch (error) {
    console.error('Error creating user:', error);
    alert('Error creating user: ' + error.message);
  }
}

// ===== Delete User =====
async function deleteUser(uid) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  try {
    await firebase.firestore().collection('users').doc(uid).delete();
    alert('User deleted successfully!');
    loadUsersList();
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Error deleting user: ' + error.message);
  }
}

// ===== Render Admin Content =====
async function renderAdminContent(container) {
  container.innerHTML = `
    <div class="admin-form">
      <h4>Add Content</h4>
      <div class="form-group mt-2">
        <input type="text" id="content-title" class="form-control" placeholder="Content Title">
      </div>
      <div class="form-group">
        <input type="text" id="content-book" class="form-control" placeholder="Book Name (e.g., Maths Part-I)">
      </div>
      <div class="form-group">
        <input type="number" id="content-chapter" class="form-control" placeholder="Chapter Number">
      </div>
      <div class="form-group">
        <select id="content-class" class="form-select">
          <option value="">Select Class</option>
          ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => 
            `<option value="${c}">Class ${c}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <input type="text" id="content-school" class="form-control" placeholder="School Name">
      </div>
      <div class="form-group">
        <input type="url" id="content-view-url" class="form-control" placeholder="PDF View URL (Google Drive)">
      </div>
      <div class="form-group">
        <input type="url" id="content-download-url" class="form-control" placeholder="PDF Download URL">
      </div>
      <button class="btn btn-primary btn-full" onclick="createContent()">Add Content</button>
    </div>
    
    <h4 class="mt-3">All Content</h4>
    <div id="content-list" class="admin-list mt-2">
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `;
  
  // Load content
  await loadContentList();
}

// ===== Load Content List =====
async function loadContentList() {
  const listContainer = document.getElementById('content-list');
  
  try {
    const snapshot = await firebase.firestore().collection('content').orderBy('title').get();
    
    if (snapshot.empty) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-text">No content found</div>
        </div>
      `;
      return;
    }
    
    let html = '';
    snapshot.docs.forEach(doc => {
      const content = doc.data();
      html += `
        <div class="admin-list-item">
          <div class="admin-list-item-info">
            <div class="admin-list-item-title">${content.title}</div>
            <div class="admin-list-item-subtitle">Class ${content.class} • ${content.school} • ${content.bookName || ''}</div>
          </div>
          <div class="admin-list-item-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteContent('${doc.id}')">Delete</button>
          </div>
        </div>
      `;
    });
    
    listContainer.innerHTML = html;
  } catch (error) {
    console.error('Error loading content:', error);
    listContainer.innerHTML = `<div class="text-center">Failed to load content</div>`;
  }
}

// ===== Create Content =====
async function createContent() {
  const title = document.getElementById('content-title').value;
  const bookName = document.getElementById('content-book').value;
  const chapterNumber = document.getElementById('content-chapter').value;
  const contentClass = document.getElementById('content-class').value;
  const school = document.getElementById('content-school').value;
  const viewUrl = document.getElementById('content-view-url').value;
  const downloadUrl = document.getElementById('content-download-url').value;
  
  if (!title || !contentClass || !school || !viewUrl || !downloadUrl) {
    alert('Please fill all required fields');
    return;
  }
  
  try {
    await firebase.firestore().collection('content').add({
      title,
      bookName,
      chapterNumber,
      class: contentClass,
      school,
      viewUrl,
      downloadUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert('Content added successfully!');
    loadContentList();
    
    // Clear form
    document.getElementById('content-title').value = '';
    document.getElementById('content-book').value = '';
    document.getElementById('content-chapter').value = '';
    document.getElementById('content-class').value = '';
    document.getElementById('content-school').value = '';
    document.getElementById('content-view-url').value = '';
    document.getElementById('content-download-url').value = '';
  } catch (error) {
    console.error('Error creating content:', error);
    alert('Error creating content: ' + error.message);
  }
}

// ===== Delete Content =====
async function deleteContent(id) {
  if (!confirm('Are you sure you want to delete this content?')) return;
  
  try {
    await firebase.firestore().collection('content').doc(id).delete();
    alert('Content deleted successfully!');
    loadContentList();
  } catch (error) {
    console.error('Error deleting content:', error);
    alert('Error deleting content: ' + error.message);
  }
}

// ===== Render Admin Notifications =====
async function renderAdminNotifications(container) {
  container.innerHTML = `
    <div class="admin-form">
      <h4>Send Notification</h4>
      <div class="form-group mt-2">
        <input type="text" id="notification-title" class="form-control" placeholder="Notification Title">
      </div>
      <div class="form-group">
        <textarea id="notification-message" class="form-control" placeholder="Notification Message" rows="4"></textarea>
      </div>
      <div class="form-group">
        <select id="notification-class" class="form-select">
          <option value="">Select Class (or All)</option>
          <option value="all">All Classes</option>
          ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => 
            `<option value="${c}">Class ${c}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <input type="text" id="notification-school" class="form-control" placeholder="School Name">
      </div>
      <button class="btn btn-primary btn-full" onclick="sendNotification()">Send Notification</button>
    </div>
    
    <h4 class="mt-3">Sent Notifications</h4>
    <div id="notifications-list" class="admin-list mt-2">
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `;
  
  // Load notifications
  await loadNotificationsList();
}

// ===== Load Notifications List =====
async function loadNotificationsList() {
  const listContainer = document.getElementById('notifications-list');
  
  try {
    const snapshot = await firebase.firestore()
      .collection('notifications')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();
    
    if (snapshot.empty) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-text">No notifications sent</div>
        </div>
      `;
      return;
    }
    
    let html = '';
    snapshot.docs.forEach(doc => {
      const notification = doc.data();
      const timeAgo = getTimeAgo(notification.timestamp ? notification.timestamp.toDate() : new Date());
      html += `
        <div class="admin-list-item">
          <div class="admin-list-item-info">
            <div class="admin-list-item-title">${notification.title}</div>
            <div class="admin-list-item-subtitle">${notification.message.substring(0, 50)}... • ${timeAgo}</div>
          </div>
          <div class="admin-list-item-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteNotification('${doc.id}')">Delete</button>
          </div>
        </div>
      `;
    });
    
    listContainer.innerHTML = html;
  } catch (error) {
    console.error('Error loading notifications:', error);
    listContainer.innerHTML = `<div class="text-center">Failed to load notifications</div>`;
  }
}

// ===== Send Notification =====
async function sendNotification() {
  const title = document.getElementById('notification-title').value;
  const message = document.getElementById('notification-message').value;
  const notificationClass = document.getElementById('notification-class').value;
  const school = document.getElementById('notification-school').value;
  
  if (!title || !message || !school) {
    alert('Please fill all required fields');
    return;
  }
  
  try {
    // Save to Firestore
    await firebase.firestore().collection('notifications').add({
      title,
      message,
      class: notificationClass,
      school,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      readBy: []
    });
    
    // Send FCM notification
    await sendFCMNotification(title, message, notificationClass, school);
    
    alert('Notification sent successfully!');
    loadNotificationsList();
    
    // Clear form
    document.getElementById('notification-title').value = '';
    document.getElementById('notification-message').value = '';
    document.getElementById('notification-class').value = '';
    document.getElementById('notification-school').value = '';
  } catch (error) {
    console.error('Error sending notification:', error);
    alert('Error sending notification: ' + error.message);
  }
}

// ===== Send FCM Notification =====
async function sendFCMNotification(title, message, targetClass, school) {
  try {
    // Get users matching criteria
    let query = firebase.firestore().collection('users').where('school', '==', school);
    
    if (targetClass !== 'all') {
      query = query.where('class', '==', targetClass);
    }
    
    const snapshot = await query.get();
    const fcmTokens = snapshot.docs
      .map(doc => doc.data().fcmToken)
      .filter(token => token); // Filter out null/undefined tokens
    
    // In production, you would send this through your backend server
    // For now, we'll just log the tokens
    console.log('FCM tokens:', fcmTokens);
    console.log('Notification payload:', { title, message });
    
    // Note: In a real production app, you would use Firebase Cloud Functions
    // to send notifications to these tokens
    alert(`Notification queued for ${fcmTokens.length} users`);
  } catch (error) {
    console.error('Error sending FCM notification:', error);
  }
}

// ===== Delete Notification =====
async function deleteNotification(id) {
  if (!confirm('Are you sure you want to delete this notification?')) return;
  
  try {
    await firebase.firestore().collection('notifications').doc(id).delete();
    alert('Notification deleted successfully!');
    loadNotificationsList();
  } catch (error) {
    console.error('Error deleting notification:', error);
    alert('Error deleting notification: ' + error.message);
  }
}

// ===== Side Menu Functions =====
function openSideMenu() {
  elements.sideMenu.classList.add('active');
  elements.sideMenuOverlay.classList.add('active');
}

function closeSideMenu() {
  elements.sideMenu.classList.remove('active');
  elements.sideMenuOverlay.classList.remove('active');
}

function updateSideMenuUserInfo() {
  const userInfoEl = document.getElementById('side-menu-user-info');
  if (userInfoEl && state.userData) {
    userInfoEl.innerHTML = `
      <h3>${state.userData.name}</h3>
      <p>${state.userData.email}</p>
    `;
  }
}

function updateSideMenu() {
  const adminTab = document.getElementById('admin-tab');
  if (adminTab) {
    adminTab.style.display = state.isAdmin ? 'flex' : 'none';
  }
}

// ===== Event Listeners =====
function setupEventListeners() {
  // Menu button
  document.getElementById('menu-btn').addEventListener('click', openSideMenu);
  document.getElementById('side-menu-close').addEventListener('click', closeSideMenu);
  elements.sideMenuOverlay.addEventListener('click', closeSideMenu);
  
  // Notification button
  document.getElementById('notification-btn').addEventListener('click', () => {
    navigateTo('notifications');
  });
  
  // Side menu items
  document.querySelectorAll('.side-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      navigateTo(view);
    });
  });
  
  // Logout
  document.getElementById('logout-btn').addEventListener('click', logout);
}

// ===== Utility Functions =====
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' year(s) ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' month(s) ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' day(s) ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hour(s) ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minute(s) ago';
  
  return 'Just now';
}

function showError(message) {
  alert(message);
}

// ===== Login Function =====
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  if (!email || !password) {
    showError('Please enter email and password');
    return;
  }
  
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    // Auth state change will handle navigation
  } catch (error) {
    console.error('Login error:', error);
    document.getElementById('login-error').textContent = error.message;
    document.getElementById('login-error').classList.remove('hidden');
  }
}

// ===== Logout Function =====
async function logout() {
  try {
    await firebase.auth().signOut();
    // Auth state change will handle navigation
  } catch (error) {
    console.error('Logout error:', error);
    showError('Failed to logout');
  }
}

// ===== Initialize App on Load =====
document.addEventListener('DOMContentLoaded', initApp);