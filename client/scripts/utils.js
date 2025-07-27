// Global Variables
let currentUser = null;
let currentUserType = null;
let currentThesis = null;
let theses = [];
let users = [];
let topics = [];

document.addEventListener('DOMContentLoaded', async function () {
    console.log("REFRESH PAGE");
    initializeApp();
});

function initializeApp() {
    console.log('loginScreen classes:', document.getElementById('loginScreen').className);
    console.log('mainApp classes:', document.getElementById('mainApp').className);

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('modalOverlay').addEventListener('click', function (e) {
        if (e.target === this) 
            closeModal();
    });

    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('currentUserType');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        currentUserType = savedRole;
        showMainApp();
    }

    document.addEventListener('submit', function (e) {
        if (e.target.id === 'inviteProfessorForm') {
            e.preventDefault();
            if (typeof handleInviteProfessor === 'function') handleInviteProfessor();
        } else if (e.target.id === 'thesisSubmissionForm') {
            e.preventDefault();
            if (typeof handleThesisSubmission === 'function') handleThesisSubmission();
        } else if (e.target.id === 'examinationForm') {
            e.preventDefault();
            if (typeof handleExaminationForm === 'function') handleExaminationForm();
        } else if (e.target.id === 'newTopicForm') {
            e.preventDefault();
            if (typeof createTopic === 'function') createTopic();
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch("http://localhost:5001/api/user/login", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      },
      body:  JSON.stringify({
        email: username,
        password: password
      }),
    });
    if (!response.ok) {
        alert('Λάθος όνομα χρήστη, κωδικός ή τύπος χρήστη!');
        throw new Error(`Error: ${response.status}`);
    }
    const user = await response.json();
    console.log(user);
    if ('userRole' in user) {
        currentUser = user;
        currentUserType = user.userRole;
        console.log(currentUser);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('currentUserType', currentUserType);
        showMainApp();
    } else {
        alert('Λάθος όνομα χρήστη, κωδικός ή τύπος χρήστη!');
    }
}

async function handleLogout() {
    const response = await fetch("http://localhost:5001/api/user/logout", {
      method: 'POST',
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    currentUser = null;
    currentUserType = null;
    currentThesis = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    localStorage.removeItem('currentThesis');
    showLoginScreen();
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('mainApp').classList.remove('active');
    document.getElementById('loginForm').reset();
}

function showMainApp() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainApp').classList.add('active');
    updateUserInfo();
    loadNavigation();
    loadDefaultContent();
}

async function updateUserInfo() {
    const response = await fetch(`http://localhost:5001/api/${currentUserType}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      },
    });
    person = await response.json();
    if (!response.ok) {
      currentUser = null;
      currentUserType = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserType');
      showLoginScreen();
      throw new Error(`Error: ${person.message}`);
    }
    currentUser = person;
    localStorage.setItem('currentUser', JSON.stringify(person));
    if (currentUserType === 'student') await refreshThesis(true);
    console.log(currentUser);
    console.log(currentThesis);
    const userInfo = document.getElementById('userInfo');
    userInfo.textContent = `${currentUser.first_name} ${currentUser.last_name} (${getUserTypeName(currentUserType)})`;
}

function getUserTypeName(type) {
    const types = {
        student: 'Φοιτητής/τρια',
        professor: 'Διδάσκων',
        secretary: 'Γραμματεία'
    };
    return types[type] || type;
}

function loadNavigation() {
    const navMenu = document.getElementById('navMenu');
    const menuItems = getMenuItems();
    navMenu.innerHTML = menuItems.map(item => `
        <div class="nav-item" onclick="loadContent('${item.id}', event)">
            <i class="${item.icon}"></i>
            <span>${item.title}</span>
        </div>
    `).join('');
}

function getMenuItems() {
    const baseItems = {
        student: [
            { id: 'viewThesis', title: 'Προβολή Θέματος', icon: 'fas fa-eye' },
            { id: 'editProfile', title: 'Επεξεργασία Προφίλ', icon: 'fas fa-user-edit' },
            { id: 'manageThesis', title: 'Διαχείριση Διπλωματικής', icon: 'fas fa-tasks' }
        ],
        professor: [
            { id: 'topics', title: 'Θέματα Διπλωματικών', icon: 'fas fa-book' },
            { id: 'assignTopic', title: 'Ανάθεση Θέματος', icon: 'fas fa-user-plus' },
            { id: 'thesesList', title: 'Λίστα Διπλωματικών', icon: 'fas fa-list' },
            { id: 'manageTheses', title: 'Διαχείριση Διπλωματικών', icon: 'fas fa-cogs' },
            { id: 'invitations', title: 'Προσκλήσεις Τριμελούς', icon: 'fas fa-envelope' },
            { id: 'statistics', title: 'Στατιστικά', icon: 'fas fa-chart-bar' }
        ],
        secretary: [
            { id: 'viewTheses', title: 'Προβολή ΔΕ', icon: 'fas fa-eye' },
            { id: 'importData', title: 'Εισαγωγή Δεδομένων', icon: 'fas fa-upload' },
            { id: 'secretaryManageTheses', title: 'Διαχείριση ΔΕ', icon: 'fas fa-cogs' }
        ]
    };
    return baseItems[currentUserType] || [];
}

function loadDefaultContent() {
    const defaultPages = {
        student: 'viewThesis',
        professor: 'topics',
        secretary: 'viewTheses'
    };
    loadContent(defaultPages[currentUserType]);
}

async function loadContent(pageId, event) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (event) event.target.closest('.nav-item').classList.add('active');

    const contentArea = document.getElementById('contentArea');

    const contentMap = {
        viewThesis: typeof getStudentThesisView === 'function' ? getStudentThesisView : () => '',
        editProfile: typeof getProfileEditForm === 'function' ? getProfileEditForm : () => '',
        manageThesis: typeof getThesisManagement === 'function' ? getThesisManagement : () => '',
        topics: typeof getTopicsManagement === 'function' ? getTopicsManagement : () => '',
        assignTopic: typeof getTopicAssignment === 'function' ? getTopicAssignment : () => '',
        thesesList: typeof getThesesList === 'function' ? getThesesList : () => '',
        manageTheses: typeof getThesesManagement === 'function' ? getThesesManagement : () => '',
        invitations: typeof getInvitationsList === 'function' ? getInvitationsList : () => '',
        statistics: typeof getStatistics === 'function' ? getStatistics : () => '',
        viewTheses: typeof getSecretaryThesesView === 'function' ? getSecretaryThesesView : () => '',
        importData: typeof getDataImport === 'function' ? getDataImport : () => '',
        secretaryManageTheses: typeof getSecretaryThesesManagement === 'function' ? getSecretaryThesesManagement : () => ''
    };

    contentArea.innerHTML = await contentMap[pageId]();
    if (pageId === 'statistics') await renderGraphs();
    if (pageId === 'viewTheses') await attachEventListener();
}


function showModal(content) {
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('active');
}

function formatDate(dateString) {
    if (!dateString) return 'Δεν έχει οριστεί';
    return new Date(dateString).toLocaleDateString('el-GR');
}

function calculateTimeSince(dateString) {
    if (!dateString) return 'Δεν έχει οριστεί';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ημέρες`;
}

function calculateAverageCompletionTime(theses) {
    const completedTheses = theses.filter(t => t.status === 'completed' && t.completedDate);
    if (completedTheses.length === 0) return 0;
    
    const totalMonths = completedTheses.reduce((sum, thesis) => {
        const start = new Date(thesis.assignedDate);
        const end = new Date(thesis.completedDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        return sum + months;
    }, 0);
    
    return Math.round(totalMonths / completedTheses.length);
}

function calculateAverageGrade(theses) {
    const gradedTheses = theses.filter(t => t.grade);
    if (gradedTheses.length === 0) return 0;
    
    const totalGrade = gradedTheses.reduce((sum, thesis) => sum + thesis.grade, 0);
    return totalGrade / gradedTheses.length;
}

function getUserName(userId) {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Άγνωστος Χρήστης';
}

function getStatusText(status) {
    const statuses = {
        pending: 'Υπό Ανάθεση',
        active: 'Ενεργή',
        review: 'Υπό Εξέταση',
        completed: 'Περατωμένη',
        cancelled: 'Ακυρωμένη'
    };
    return statuses[status.toLowerCase()] || status;
}

