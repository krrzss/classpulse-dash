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
        
        // Redraw chart with new theme colors
        setTimeout(() => {
            createPerformanceChart();
        }, 100);
    });
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Page Navigation
const navItems = document.querySelectorAll('.nav-item[data-page]');
const pages = {
    input: document.getElementById('inputPage'),
    dashboard: document.getElementById('dashboardPage')
};

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = item.getAttribute('data-page');
        
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show target page
        Object.values(pages).forEach(page => page.classList.remove('active'));
        pages[targetPage].classList.add('active');
        
        // Close mobile menu
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

// Add Assignment Handler
const addAssignmentBtn = document.getElementById('addAssignment');
const assignmentsContainer = document.getElementById('assignmentsContainer');

addAssignmentBtn.addEventListener('click', () => {
    const newAssignment = document.createElement('div');
    newAssignment.className = 'assignment-input-group';
    newAssignment.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Assignment Title</label>
                <input type="text" class="assignment-title" placeholder="e.g., Algebra Worksheet">
            </div>
            <div class="form-group">
                <label>Subject</label>
                <input type="text" class="assignment-subject" placeholder="e.g., Math">
            </div>
            <div class="form-group">
                <label>Due Date</label>
                <input type="date" class="assignment-date">
            </div>
            <div class="form-group">
                <label>Status</label>
                <select class="assignment-status">
                    <option value="pending">Pending</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Remove
        </button>
    `;
    assignmentsContainer.appendChild(newAssignment);
});

// Form Submit Handler
const studentForm = document.getElementById('studentForm');
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        grade: document.getElementById('grade').value,
        studentId: document.getElementById('studentId').value,
        totalClasses: parseInt(document.getElementById('totalClasses').value),
        classesAttended: parseInt(document.getElementById('classesAttended').value),
        subjects: {
            math: parseInt(document.getElementById('mathScore').value),
            MySQL: parseInt(document.getElementById('MySQLScore').value),
            english: parseInt(document.getElementById('englishScore').value),
            machineLearning: parseInt(document.getElementById('machineLearningScore').value),
            computerScience: parseInt(document.getElementById('computerScienceScore').value)
        },
        participationScore: parseInt(document.getElementById('participationScore').value),
        behaviorScore: parseInt(document.getElementById('behaviorScore').value),
        assignments: []
    };
    
    // Collect assignments
    const assignmentGroups = document.querySelectorAll('.assignment-input-group');
    assignmentGroups.forEach(group => {
        const title = group.querySelector('.assignment-title').value;
        const subject = group.querySelector('.assignment-subject').value;
        const date = group.querySelector('.assignment-date').value;
        const status = group.querySelector('.assignment-status').value;
        
        if (title && subject) {
            formData.assignments.push({ title, subject, date, status });
        }
    });
    
    // Save to localStorage
    localStorage.setItem('studentData', JSON.stringify(formData));
    
    // Redirect to dashboard result page
    window.location.href = 'result-dashboard.html';
});

// Reset Form Handler
document.getElementById('resetForm').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the form?')) {
        studentForm.reset();
        // Keep only first assignment group
        const groups = document.querySelectorAll('.assignment-input-group');
        for (let i = 1; i < groups.length; i++) {
            groups[i].remove();
        }
    }
});

// Load Sample Data Handler
document.getElementById('loadSample').addEventListener('click', () => {
    // Fill personal details
    document.getElementById('firstName').value = 'Tanisha';
    document.getElementById('lastName').value = 'Smith';
    document.getElementById('grade').value = '12th Grade';
    document.getElementById('studentId').value = 'STU12345';
    
    // Fill attendance
    document.getElementById('totalClasses').value = '100';
    document.getElementById('classesAttended').value = '92';
    
    // Fill subject scores
    document.getElementById('mathScore').value = '88';
    document.getElementById('MySQLScore').value = '75';
    document.getElementById('englishScore').value = '92';
    document.getElementById('machineLearningScore').value = '84';
    document.getElementById('computerScienceScore').value = '96';
    
    // Fill participation & behavior
    document.getElementById('participationScore').value = '78';
    document.getElementById('behaviorScore').value = '100';
    
    // Clear existing assignments and add sample one
    const groups = document.querySelectorAll('.assignment-input-group');
    for (let i = 1; i < groups.length; i++) {
        groups[i].remove();
    }
    
    // Fill first assignment
    const firstGroup = document.querySelector('.assignment-input-group');
    firstGroup.querySelector('.assignment-title').value = 'Algebra Work';
    firstGroup.querySelector('.assignment-subject').value = 'Math';
    firstGroup.querySelector('.assignment-date').value = '2026-03-02';
    firstGroup.querySelector('.assignment-status').value = 'progress';
    
    alert('Sample data loaded! Click "Show Result" to see the dashboard.');
});

// Update Dashboard Function
function updateDashboard(data) {
    // Update header
    const fullName = `${data.firstName} ${data.lastName}`;
    document.getElementById('welcomeTitle').textContent = `Welcome back, ${data.firstName}`;
    document.getElementById('userName').textContent = fullName;
    document.getElementById('userGrade').textContent = data.grade;
    
    // Update avatar
    const initials = `${data.firstName[0]}${data.lastName[0]}`;
    document.getElementById('userAvatar').textContent = initials;
    
    // Calculate attendance percentage
    const attendancePercentage = Math.round((data.classesAttended / data.totalClasses) * 100);
    document.getElementById('attendanceValue').textContent = `${attendancePercentage}%`;
    document.getElementById('attendanceDetail').textContent = 
        `${data.classesAttended} of ${data.totalClasses} classes attended`;
    document.getElementById('attendanceProgress').style.width = `${attendancePercentage}%`;
    
    // Update participation
    document.getElementById('participationValue').textContent = `${data.participationScore}/100`;
    const participationRank = data.participationScore >= 90 ? 'Top 5% of class' :
                              data.participationScore >= 80 ? 'Top 10% of class' :
                              data.participationScore >= 70 ? 'Top 25% of class' :
                              'Below average';
    document.getElementById('participationRank').textContent = participationRank;
    document.getElementById('participationProgress').style.width = `${data.participationScore}%`;
    
    // Update behavior
    document.getElementById('behaviorValue').textContent = data.behaviorScore;
    const behaviorStatus = data.behaviorScore >= 90 ? 'Excellent record' :
                           data.behaviorScore >= 75 ? 'Good standing' :
                           data.behaviorScore >= 60 ? 'Needs improvement' :
                           'Requires attention';
    document.getElementById('behaviorStatus').textContent = behaviorStatus;
    document.getElementById('behaviorProgress').style.width = `${data.behaviorScore}%`;
    
    // Count pending assignments
    const pendingCount = data.assignments.filter(a => a.status === 'pending' || a.status === 'progress').length;
    document.getElementById('pendingValue').textContent = pendingCount;
    document.getElementById('pendingDetail').textContent = pendingCount === 0 ? 'All caught up!' :
                                                          pendingCount === 1 ? 'Due soon' :
                                                          'Multiple due soon';
    const pendingPercentage = pendingCount > 0 ? Math.min(pendingCount * 20, 100) : 0;
    document.getElementById('pendingProgress').style.width = `${pendingPercentage}%`;
    
    // Calculate risk level
    const avgScore = Object.values(data.subjects).reduce((a, b) => a + b, 0) / 5;
    const riskScore = (attendancePercentage * 0.3) + (avgScore * 0.4) + 
                     (data.participationScore * 0.15) + (data.behaviorScore * 0.15);
    
    const riskBadge = document.getElementById('riskBadge');
    const riskText = document.getElementById('riskText');
    
    riskBadge.classList.remove('low-risk', 'medium-risk', 'high-risk');
    
    if (riskScore >= 80) {
        riskBadge.classList.add('low-risk');
        riskText.textContent = 'ClassPulse Risk Analysis: Low Risk';
    } else if (riskScore >= 60) {
        riskBadge.classList.add('medium-risk');
        riskText.textContent = 'ClassPulse Risk Analysis: Medium Risk';
    } else {
        riskBadge.classList.add('high-risk');
        riskText.textContent = 'ClassPulse Risk Analysis: High Risk';
    }
    
    // Update chart
    window.studentSubjects = data.subjects;
    createPerformanceChart();
    
    // Update assignments list
    updateAssignmentsList(data.assignments);
    
    // Animate values
    setTimeout(() => {
        animateStatValues();
    }, 300);
}

// Update Assignments List
function updateAssignmentsList(assignments) {
    const assignmentsList = document.getElementById('assignmentsList');
    
    if (assignments.length === 0) {
        assignmentsList.innerHTML = '<p class="empty-state">No assignments added yet.</p>';
        return;
    }
    
    assignmentsList.innerHTML = '';
    
    // Sort by date
    const sortedAssignments = [...assignments].sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
    });
    
    sortedAssignments.forEach(assignment => {
        const item = document.createElement('div');
        item.className = 'assignment-item';
        
        const statusClass = assignment.status === 'completed' ? 'badge-completed' :
                           assignment.status === 'progress' ? 'badge-progress' :
                           'badge-pending';
        
        const statusText = assignment.status === 'completed' ? 'Completed' :
                          assignment.status === 'progress' ? 'In Progress' :
                          'Pending';
        
        const dateText = assignment.date ? 
            `Due ${new Date(assignment.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            })}` : 
            'No due date';
        
        item.innerHTML = `
            <div class="assignment-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path>
                </svg>
            </div>
            <div class="assignment-details">
                <div class="assignment-title">${assignment.title}</div>
                <div class="assignment-meta">${assignment.subject} • ${dateText}</div>
            </div>
            <span class="badge ${statusClass}">${statusText}</span>
        `;
        
        assignmentsList.appendChild(item);
    });
}

// Chart.js Bar Chart for Subject Performance
function createPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Chart data - use stored data or defaults
    const subjects = ['Mat', 'Sci', 'Eng', 'His', 'Com'];
    const scores = window.studentSubjects ? [
        window.studentSubjects.math,
        window.studentSubjects.MySQL,
        window.studentSubjects.english,
        window.studentSubjects.machineLearning,
        window.studentSubjects.computerScience
    ] : [0, 0, 0, 0, 0];
    
    // Get theme-aware colors
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const barColor = '#2563eb';
    const gridColor = isDarkMode ? '#334155' : '#e5e7eb';
    const textColor = isDarkMode ? '#cbd5e1' : '#6b7280';
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 350;
    
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    // Calculate bar dimensions
    const barWidth = chartWidth / (subjects.length * 2);
    const maxScore = 100;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines and Y-axis labels
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = textColor;
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight * i / 4);
        const label = maxScore - (25 * i);
        
        // Grid line
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        ctx.stroke();
        
        // Y-axis label
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(label + '%', padding.left - 10, y);
    }
    
    // Draw bars
    subjects.forEach((subject, index) => {
        const score = scores[index];
        const barHeight = (score / maxScore) * chartHeight;
        const x = padding.left + (chartWidth / subjects.length) * index + (chartWidth / subjects.length - barWidth) / 2;
        const y = padding.top + chartHeight - barHeight;
        
        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, barColor);
        gradient.addColorStop(1, '#1d4ed8');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw rounded top
        ctx.beginPath();
        ctx.arc(x + barWidth / 2, y + 5, barWidth / 2, Math.PI, 0);
        ctx.fill();
        
        // Draw X-axis labels
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(subject, x + barWidth / 2, canvas.height - padding.bottom + 10);
    });
}

// Animate stat values counting up
function animateStatValues() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach((stat) => {
        const text = stat.textContent;
        const match = text.match(/(\d+)/);
        
        if (match) {
            const targetValue = parseInt(match[0]);
            const duration = 1000;
            const steps = 30;
            const increment = targetValue / steps;
            let current = 0;
            let step = 0;
            
            stat.textContent = '0' + text.replace(/\d+/, '');
            
            const timer = setInterval(() => {
                step++;
                current = Math.min(Math.floor(increment * step), targetValue);
                stat.textContent = text.replace(/\d+/, current);
                
                if (current >= targetValue) {
                    clearInterval(timer);
                }
            }, duration / steps);
        }
    });
}

// Handle window resize for chart
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        createPerformanceChart();
    }, 250);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved data
    const savedData = localStorage.getItem('studentData');
    if (savedData) {
        const data = JSON.parse(savedData);
        updateDashboard(data);
        // Show dashboard if data exists
        document.querySelector('.nav-item[data-page="dashboard"]').click();
    } else {
        // Load sample data on first visit
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            // Auto-load sample data
            document.getElementById('loadSample').click();
            localStorage.setItem('hasVisited', 'true');
        }
        createPerformanceChart(); // Draw empty chart
    }
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Add notification click handler
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('No new notifications at this time.');
    });
}

// Add logout confirmation
const logoutLink = document.querySelector('.logout .nav-item');
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout? Your data will be preserved.')) {
            // Could add logout logic here
            alert('Logged out successfully!');
        }
    });
}