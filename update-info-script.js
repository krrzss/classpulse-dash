// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Load existing student data
function loadStudentData() {
    const savedData = localStorage.getItem('studentData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Update header with student name
        if (data.firstName) {
            document.getElementById('welcomeTitle').textContent = `Welcome back, ${data.firstName}`;
            document.getElementById('userName').textContent = `${data.firstName} ${data.lastName}`;
            document.getElementById('userAvatar').textContent = `${data.firstName[0]}${data.lastName[0]}`;
        }
        
        // Populate form fields
        if (data.firstName) document.getElementById('firstName').value = data.firstName;
        if (data.lastName) document.getElementById('lastName').value = data.lastName;
        if (data.grade) document.getElementById('grade').value = data.grade;
        if (data.studentId) document.getElementById('studentId').value = data.studentId;
        if (data.totalClasses) document.getElementById('totalClasses').value = data.totalClasses;
        if (data.classesAttended) document.getElementById('attendedClasses').value = data.classesAttended;
        
        // Populate subject scores
        if (data.subjects) {
            document.getElementById('math').value = data.subjects.math || 0;
            document.getElementById('science').value = data.subjects.science || 0;
            document.getElementById('english').value = data.subjects.english || 0;
            document.getElementById('history').value = data.subjects.history || 0;
            document.getElementById('computer').value = data.subjects.computer || 0;
        }
        
        // Populate behavioral metrics
        if (data.participationScore) document.getElementById('participation').value = data.participationScore;
        if (data.behaviorScore) document.getElementById('behavior').value = data.behaviorScore;
        
        // Load assignments
        if (data.assignments && data.assignments.length > 0) {
            data.assignments.forEach(assignment => {
                addAssignmentToForm(assignment);
            });
        }
        
        return data;
    }
    
    return null;
}

// Add assignment to form
function addAssignmentToForm(assignment = null) {
    const assignmentsContainer = document.getElementById('assignmentsContainer');
    const newAssignment = document.createElement('div');
    newAssignment.className = 'assignment-input-group';
    
    // Format date for input field
    let dateValue = '';
    if (assignment && assignment.dueDate) {
        // Convert "Jan 28, 2026" to "2026-01-28"
        const date = new Date(assignment.dueDate);
        if (!isNaN(date.getTime())) {
            dateValue = date.toISOString().split('T')[0];
        }
    }
    
    newAssignment.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Assignment Title</label>
                <input type="text" class="assignment-title" placeholder="e.g., Making websites" value="${assignment ? assignment.title : ''}">
            </div>
            <div class="form-group">
                <label>Subject</label>
                <input type="text" class="assignment-subject" placeholder="e.g., HTML" value="${assignment ? assignment.subject : ''}">
            </div>
            <div class="form-group">
                <label>Due Date</label>
                <input type="date" class="assignment-date" value="${dateValue}">
            </div>
            <div class="form-group">
                <label>Status</label>
                <select class="assignment-status">
                    <option value="pending" ${assignment && assignment.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="progress" ${assignment && assignment.status === 'progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${assignment && assignment.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
        </div>
        <button type="button" class="btn-remove">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Remove
        </button>
    `;
    
    // Add remove button handler
    const removeBtn = newAssignment.querySelector('.btn-remove');
    removeBtn.addEventListener('click', () => {
        newAssignment.remove();
    });
    
    assignmentsContainer.appendChild(newAssignment);
}

// Add Assignment Button Handler
const addAssignmentBtn = document.getElementById('addAssignment');
if (addAssignmentBtn) {
    addAssignmentBtn.addEventListener('click', () => {
        addAssignmentToForm();
    });
}

// Form Submit Handler
const studentForm = document.getElementById('studentForm');
if (studentForm) {
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            grade: document.getElementById('grade').value,
            studentId: document.getElementById('studentId').value,
            totalClasses: parseInt(document.getElementById('totalClasses').value) || 0,
            classesAttended: parseInt(document.getElementById('attendedClasses').value) || 0,
            subjects: {
                math: parseInt(document.getElementById('math').value) || 0,
                science: parseInt(document.getElementById('science').value) || 0,
                english: parseInt(document.getElementById('english').value) || 0,
                history: parseInt(document.getElementById('history').value) || 0,
                computer: parseInt(document.getElementById('computer').value) || 0
            },
            participationScore: parseInt(document.getElementById('participation').value) || 0,
            behaviorScore: parseInt(document.getElementById('behavior').value) || 0,
            assignments: []
        };
        
        // Collect assignments
        const assignmentGroups = document.querySelectorAll('.assignment-input-group');
        assignmentGroups.forEach(group => {
            const title = group.querySelector('.assignment-title').value;
            const subject = group.querySelector('.assignment-subject').value;
            const dateValue = group.querySelector('.assignment-date').value;
            const status = group.querySelector('.assignment-status').value;
            
            if (title && subject) {
                // Format date as "Jan 28, 2026"
                let formattedDate = '';
                if (dateValue) {
                    const date = new Date(dateValue);
                    formattedDate = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    });
                }
                
                formData.assignments.push({ 
                    title, 
                    subject, 
                    dueDate: formattedDate, 
                    status 
                });
            }
        });
        
        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.grade || !formData.studentId) {
            alert('Please fill in all required fields (First Name, Last Name, Grade, Student ID)');
            return;
        }
        
        // Save to localStorage with student ID
        localStorage.setItem('studentData', JSON.stringify(formData));
        localStorage.setItem(`studentData_${formData.studentId}`, JSON.stringify(formData));
        
        // Show success message
        const submitBtn = studentForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Saved!';
        submitBtn.style.background = '#10b981';
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'result-dashboard.html';
        }, 1000);
    });
}

// Check if this is first time setup
const urlParams = new URLSearchParams(window.location.search);
const isFirstTime = urlParams.get('firstTime') === 'true';

if (isFirstTime) {
    // Show a helpful message for first-time users
    const formHeader = document.querySelector('.form-header');
    if (formHeader) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.style.cssText = 'background: #dbeafe; color: #1e40af; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;';
        welcomeMessage.innerHTML = '👋 Welcome! Please fill in your information to set up your dashboard.';
        formHeader.appendChild(welcomeMessage);
    }
}

// Notification handler
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('No new notifications at this time.');
    });
}

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStudentData();
    document.documentElement.style.scrollBehavior = 'smooth';
});