// ============================================================================
// LOGIN PAGE JAVASCRIPT - MODIFIED FOR NEW DASHBOARD SYSTEM
// Handles tab switching, theme toggle, and authentication
// ============================================================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================================================
    // THEME TOGGLE FUNCTIONALITY
    // ========================================================================
    
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    setTheme(currentTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        setTheme(newTheme);
        
        // Save theme preference to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Add a subtle animation
        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
    
    // Function to set theme
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            themeIcon.textContent = '🌙';
        }
    }
    
    // ========================================================================
    // TAB SWITCHING FUNCTIONALITY
    // ========================================================================
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formContainers = document.querySelectorAll('.login-form-container');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            formContainers.forEach(container => {
                container.classList.remove('active');
            });
            
            const targetForm = document.getElementById(`${role}-form`);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });
    
    // ========================================================================
    // CHECK URL PARAMETERS FOR ROLE
    // ========================================================================
    
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    if (roleParam) {
        const targetTab = document.querySelector(`[data-role="${roleParam}"]`);
        if (targetTab) {
            targetTab.click();
        }
    }
    
    // ========================================================================
    // INPUT VALIDATION AND VISUAL FEEDBACK
    // ========================================================================
    
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.borderColor = 'var(--primary)';
            } else {
                this.style.borderColor = 'var(--border)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
});

// ============================================================================
// STUDENT LOGIN HANDLER - REDIRECTS TO DASHBOARD.HTML
// ============================================================================

function handleStudentLogin(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('student-id').value;
    const password = document.getElementById('student-password').value;
    
    const validCredentials = {
        'STU001': 'student123',
        'STU002': 'student123',
        'STU023': 'student123'
    };
    
    if (validCredentials[studentId] && validCredentials[studentId] === password) {
        sessionStorage.setItem('userRole', 'student');
        sessionStorage.setItem('userId', studentId);
        sessionStorage.setItem('isLoggedIn', 'true');
        
        showNotification('✅ Login successful! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showNotification('❌ Invalid credentials. Please try again.\n\nDemo credentials:\nStudent ID: STU001\nPassword: student123', 'error');
    }
    
    return false;
}

// ============================================================================
// TEACHER LOGIN HANDLER - REDIRECTS TO DASHBOARD.HTML
// ============================================================================

function handleTeacherLogin(event) {
    event.preventDefault();
    
    const teacherId = document.getElementById('teacher-id').value;
    const password = document.getElementById('teacher-password').value;
    
    const validCredentials = {
        'TEACH001': 'teacher123',
        'TEACH002': 'teacher123'
    };
    
    if (validCredentials[teacherId] && validCredentials[teacherId] === password) {
        sessionStorage.setItem('userRole', 'teacher');
        sessionStorage.setItem('userId', teacherId);
        sessionStorage.setItem('isLoggedIn', 'true');
        
        showNotification('✅ Login successful! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showNotification('❌ Invalid credentials. Please try again.\n\nDemo credentials:\nTeacher ID: TEACH001\nPassword: teacher123', 'error');
    }
    
    return false;
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

function showNotification(message, type = 'info') {
    let notification = document.getElementById('login-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'login-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            white-space: pre-line;
            font-size: 14px;
            line-height: 1.6;
        `;
        document.body.appendChild(notification);
    }
    
    if (type === 'success') {
        notification.style.background = '#10b981';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#3b82f6';
        notification.style.color = 'white';
    }
    
    notification.textContent = message;
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
    }, 3000);
}

function clearForms() {
    document.querySelectorAll('input[type="text"], input[type="password"]').forEach(input => {
        input.value = '';
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 't' || e.key === 'T') {
        if (document.activeElement.tagName !== 'INPUT') {
            document.getElementById('themeToggle').click();
        }
    }
    
    if (e.key === 'Escape') {
        clearForms();
    }
});

console.log('ClassPulse Login System Initialized - New Dashboard Integration');