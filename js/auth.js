// Authentication management
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  async init() {
    // Initialize Firebase
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js");
    const { getAuth, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js");

    const firebaseConfig = {
      apiKey: "AIzaSyCE8_ndgd2Z5aYshlSpghmsqxsiqXbOpZ8",
      authDomain: "vee-s-beaut.firebaseapp.com",
      projectId: "vee-s-beaut",
      storageBucket: "vee-s-beaut.firebasestorage.app",
      messagingSenderId: "880939794331",
      appId: "1:880939794331:web:8b4faf30b1a4906660eb3e",
      measurementId: "G-VSRRR2FZLT",
    };

    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

    // Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      this.updateUI();
    });
  }

  updateUI() {
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const registerLinks = document.querySelectorAll('a[href="signup.html"]');

    if (this.currentUser) {
      // User is logged in
      loginLinks.forEach(link => {
        link.textContent = 'Logout';
        link.href = '#';
        link.onclick = (e) => {
          e.preventDefault();
          this.logout();
        };
      });

      registerLinks.forEach(link => {
        link.textContent = `Hello, ${this.currentUser.email.split('@')[0]}`;
        link.href = '#';
        link.style.cursor = 'default';
      });
    } else {
      // User is not logged in
      loginLinks.forEach(link => {
        link.textContent = 'Login';
        link.href = 'login.html';
        link.onclick = null;
      });

      registerLinks.forEach(link => {
        link.textContent = 'Register';
        link.href = 'signup.html';
        link.style.cursor = 'pointer';
      });
    }
  }

  async logout() {
    try {
      const { signOut } = await import("https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js");
      await signOut(this.auth);
      this.showNotification('Logged out successfully', 'success');
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Logout error:', error);
      this.showNotification('Error logging out', 'error');
    }
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  requireAuth(action = 'perform this action') {
    if (!this.isAuthenticated()) {
      this.showNotification(`Please login to ${action}`, 'warning');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return false;
    }
    return true;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      animation: slideInRight 0.3s ease-out;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Global auth manager instance
window.authManager = new AuthManager();