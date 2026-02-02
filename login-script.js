// ============================================================================
// LOGIN PAGE JAVASCRIPT
// Handles tab switching and authentication
// ============================================================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // ========================================================================
    // TAB SWITCHING FUNCTIONALITY
    // ========================================================================
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formContainers = document.querySelectorAll('.login-form-container');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the role from data attribute
            const role = this.getAttribute('data-role');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all form containers
            formContainers.forEach(container => {
                container.classList.remove('active');
            });
            
            // Show the selected form
            const targetForm = document.getElementById(`${role}-form`);
            if (targetForm) {
                targetForm.classList.add('active');
                
                // Reinitialize icons after tab switch
                setTimeout(() => {
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 100);
            }
        });
    });
    
    // ========================================================================
    // CHECK URL PARAMETERS FOR ROLE
    // Allows direct linking to specific login form
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
    // INPUT FIELD ENHANCEMENTS
    // ========================================================================
    
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.parentElement.style.transform = 'translateY(0)';
        });
        
        // Real-time validation
        input.addEventListener('input', function() {
            // Remove any previous validation classes
            this.classList.remove('error', 'success');
            
            // Add validation based on input length
            if (this.value.length > 0) {
                if (this.value.length >= 5) {
                    this.classList.add('success');
                }
            }
        });
    });
    
});

// ============================================================================
// STUDENT LOGIN HANDLER
// ============================================================================

function handleStudentLogin(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('.btn-login');
    const studentIdInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('student-password');
    
    // Get form values
    const studentId = studentIdInput.value.trim();
    const password = passwordInput.value;
    
    // Add loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Demo credentials (in real app, this would be validated server-side)
    const validCredentials = {
        'ST-2024-001': 'student123',
        'STU001': 'student123',
        'STU002': 'student123',
        'STU023': 'student123'
    };
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Validate credentials
        if (validCredentials[studentId] && validCredentials[studentId] === password) {
            // Success - add success class to inputs
            studentIdInput.classList.add('success');
            passwordInput.classList.add('success');
            
            // Store student ID in sessionStorage
            sessionStorage.setItem('userRole', 'student');
            sessionStorage.setItem('userId', studentId);
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // Show success notification
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect to student dashboard after short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            // Failed login - add error class to inputs
            studentIdInput.classList.add('error');
            passwordInput.classList.add('error');
            
            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            // Show error notification
            showNotification('Invalid credentials. Please try again.', 'error');
            
            // Remove error class after animation
            setTimeout(() => {
                studentIdInput.classList.remove('error');
                passwordInput.classList.remove('error');
            }, 3000);
        }
    }, 1000);
    
    return false;
}

// ============================================================================
// TEACHER LOGIN HANDLER
// ============================================================================

function handleTeacherLogin(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('.btn-login');
    const teacherIdInput = document.getElementById('teacher-id');
    const passwordInput = document.getElementById('teacher-password');
    
    // Get form values
    const teacherId = teacherIdInput.value.trim();
    const password = passwordInput.value;
    
    // Add loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Demo credentials (in real app, this would be validated server-side)
    const validCredentials = {
        'TEACH001': 'teacher123',
        'TEACH002': 'teacher123'
    };
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Validate credentials
        if (validCredentials[teacherId] && validCredentials[teacherId] === password) {
            // Success
            teacherIdInput.classList.add('success');
            passwordInput.classList.add('success');
            
            // Store teacher ID in sessionStorage
            sessionStorage.setItem('userRole', 'teacher');
            sessionStorage.setItem('userId', teacherId);
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // Show success notification
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect to teacher dashboard
            setTimeout(() => {
                window.location.href = 'teacher-dashboard.html';
            }, 1000);
            
        } else {
            // Failed login
            teacherIdInput.classList.add('error');
            passwordInput.classList.add('error');
            
            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            // Show error notification
            showNotification('Invalid credentials. Please try again.', 'error');
            
            // Remove error class after animation
            setTimeout(() => {
                teacherIdInput.classList.remove('error');
                passwordInput.classList.remove('error');
            }, 3000);
        }
    }, 1000);
    
    return false;
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="notification-icon"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    const styles = `
        .notification {
            position: fixed;
            top: 24px;
            right: 24px;
            background: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-icon {
            width: 20px;
            height: 20px;
        }
        
        .notification-success .notification-icon {
            color: #10b981;
        }
        
        .notification-error .notification-icon {
            color: #ef4444;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    // Add styles to document if not already present
    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    // Add notification to page
    document.body.appendChild(notification);
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Clear all form fields
function clearForms() {
    document.querySelectorAll('input[type="text"], input[type="password"]').forEach(input => {
        input.value = '';
        input.classList.remove('error', 'success');
    });
}

// Toggle password visibility (can be added to HTML)
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', function(e) {
    // Press Esc to clear forms
    if (e.key === 'Escape') {
        clearForms();
    }
});