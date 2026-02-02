// Tab Switching
const tabBtns = document.querySelectorAll('.tab-btn');
const studentForm = document.getElementById('studentForm');
const teacherForm = document.getElementById('teacherForm');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        
        // Show appropriate form
        const tab = btn.getAttribute('data-tab');
        if (tab === 'student') {
            studentForm.classList.add('active');
            teacherForm.classList.remove('active');
        } else {
            teacherForm.classList.add('active');
            studentForm.classList.remove('active');
        }
    });
});

// Student Form Submission
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('studentPassword').value;
    
    // Get submit button
    const submitBtn = studentForm.querySelector('.btn-submit');
    
    // Add loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simple validation (accept any credentials for demo)
    setTimeout(() => {
        // Check if student data already exists for this ID
        const existingData = localStorage.getItem(`studentData_${studentId}`);
        
        // Store the current student ID in session
        localStorage.setItem('currentStudentId', studentId);
        localStorage.setItem('isLoggedIn', 'true');
        
        if (existingData) {
            // Returning student - has existing data
            const studentData = JSON.parse(existingData);
            localStorage.setItem('studentData', existingData);
            
            // Redirect directly to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // New student - needs to fill in information
            // Create minimal data structure
            const newStudentData = {
                firstName: '',
                lastName: '',
                grade: '',
                studentId: studentId,
                totalClasses: 0,
                classesAttended: 0,
                subjects: {
                    mathematics: 0,
                    computerScience: 0,
                    english: 0,
                    MySQL: 0,
                    machineLearning: 0
                },
                participationScore: 0,
                behaviorScore: 0,
                assignments: []
            };
            
            localStorage.setItem('studentData', JSON.stringify(newStudentData));
            
            // Redirect to update-info page to fill in details
            window.location.href = 'update-info.html?firstTime=true';
        }
    }, 1000);
});

// Teacher Form (disabled)
teacherForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Auto-fill demo credentials on page load (optional)
window.addEventListener('load', () => {
    const studentIdInput = document.getElementById('studentId');
    const studentPasswordInput = document.getElementById('studentPassword');
    
    // Pre-fill with demo credentials
    studentIdInput.value = 'ST-2024-001';
    studentPasswordInput.value = 'demo123';
    
    // Create demo data for ST-2024-001 if it doesn't exist
    const demoStudentId = 'ST-2024-001';
    const existingDemoData = localStorage.getItem(`studentData_${demoStudentId}`);
    
    if (!existingDemoData) {
        const demoData = {
            firstName: 'Alice',
            lastName: 'Foster',
            grade: '12th Grade',
            studentId: demoStudentId,
            totalClasses: 100,
            classesAttended: 92,
            subjects: {
                mathematics: 88,
                computerScience: 75,
                english: 92,
                MySQL: 84,
                machineLearning: 96
            },
            participationScore: 85,
            behaviorScore: 95,
            assignments: [
                {
                    title: 'Python Assignment',
                    subject: 'Computer Science',
                    dueDate: 'Jan 28, 2026',
                    status: 'pending'
                },
                {
                    title: 'Presentation Analysis',
                    subject: 'English',
                    dueDate: 'Jan 30, 2026',
                    status: 'progress'
                },
                {
                    title: 'Making AI Tools',
                    subject: 'Machine Learning',
                    dueDate: 'Feb 5, 2026',
                    status: 'completed'
                }
            ]
        };
        localStorage.setItem(`studentData_${demoStudentId}`, JSON.stringify(demoData));
    }
});

// Add input focus effects
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});