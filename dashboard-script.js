// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Set dark mode as default
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

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Load and Display Student Data
function loadStudentData() {
    const savedData = localStorage.getItem('studentData');
    
    if (!savedData) {
        // If no data, use default sample data
        const sampleData = {
            firstName: 'Alice',
            lastName: 'Smith',
            grade: '12th Grade',
            studentId: 'STU12345',
            totalClasses: 100,
            classesAttended: 92,
            subjects: {
                mathematics: 88,
                MySQL: 75,
                english: 92,
                machineLearning: 84,
                computerScience: 96
            },
            participationScore: 85,
            behaviorScore: 95,
            assignments: [
                {
                    title: 'Algebra Worksheet',
                    subject: 'Math',
                    date: '2024-10-15',
                    status: 'completed'
                },
                {
                    title: 'DBMS Project',
                    subject: 'MySQL',
                    date: '2024-10-20',
                    status: 'pending'
                },
                {
                    title: 'Essay: AI Revolution',
                    subject: 'machineLearning',
                    date: '2024-10-12',
                    status: 'completed'
                },
                {
                    title: 'React Project',
                    subject: 'CS',
                    date: '2024-10-25',
                    status: 'progress'
                }
            ]
        };
        updateDashboard(sampleData);
    } else {
        const data = JSON.parse(savedData);
        updateDashboard(data);
    }
}

// Update Dashboard with Student Data
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
    
    // Calculate change from previous month (mock calculation)
    const previousAttendance = attendancePercentage - 2;
    const attendanceChange = attendancePercentage - previousAttendance;
    const changeText = attendanceChange >= 0 ? `+${attendanceChange}% from last month` : `${attendanceChange}% from last month`;
    document.getElementById('attendanceChange').textContent = changeText;
    document.getElementById('attendanceChange').className = attendanceChange >= 0 ? 'stat-change positive' : 'stat-change';
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
                                                          pendingCount === 1 ? 'Due this week' :
                                                          'Due this week';
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
    
    // Store subject data globally for chart
    window.studentSubjects = data.subjects;
    
    // Update chart
    createPerformanceChart();
    
    // Update assignments list
    updateAssignmentsList(data.assignments);
    
    // Animate stat values
    setTimeout(() => {
        animateStatValues();
    }, 100);
}

// Create Performance Chart
function createPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Chart data
    const subjects = ['Mat', 'Sci', 'Eng', 'His', 'Com'];
    const scores = window.studentSubjects ? [
        window.studentSubjects.math,
        window.studentSubjects.MySQL,
        window.studentSubjects.english,
        window.studentSubjects.machineLearning,
        window.studentSubjects.computerScience
    ] : [88, 75, 92, 84, 96];
    
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
        
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        ctx.stroke();
        
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(label + '%', padding.left - 10, y);
    }
    
    // Draw bars with hover tooltip
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
        if (barHeight > 10) {
            ctx.beginPath();
            ctx.arc(x + barWidth / 2, y + 5, barWidth / 2, Math.PI, 0);
            ctx.fill();
        }
        
        // Draw X-axis labels
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(subject, x + barWidth / 2, canvas.height - padding.bottom + 10);
        
        // Draw score on hover (displayed above bar)
        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // Show score above each bar
        const scoreText = `${score}`;
        const scoreY = y - 5;
        ctx.fillText(scoreText, x + barWidth / 2, scoreY);
    });
    
    // Add canvas title showing full subject names on hover
    canvas.title = 'Subject Performance: Mathematics, MySQL, English, Machine Learning, Computer Science';
}

// Update Assignments List
function updateAssignmentsList(assignments) {
    const assignmentsList = document.getElementById('assignmentsList');
    assignmentsList.innerHTML = '';
    
    if (assignments.length === 0) {
        assignmentsList.innerHTML = '<p class="empty-state">No assignments added yet.</p>';
        return;
    }
    
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

// Animate stat values
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

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        createPerformanceChart();
    }, 250);
});

// Notification handler
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('No new notifications at this time.');
    });
}

// Logout handler
const logoutLink = document.querySelector('.logout .nav-item');
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'login.html';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStudentData();
    document.documentElement.style.scrollBehavior = 'smooth';
});