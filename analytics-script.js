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
        
        // Redraw charts with new theme
        setTimeout(() => {
            createTrendChart();
            createDonutChart();
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

// Load Student Data
function loadStudentData() {
    const savedData = localStorage.getItem('studentData');
    
    if (!savedData) {
        // Default sample data
        return {
            firstName: 'Alice',
            lastName: 'Smith',
            grade: '12th Grade',
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
            assignments: []
        };
    }
    
    return JSON.parse(savedData);
}

// Update User Info
function updateUserInfo(data) {
    const fullName = `${data.firstName} ${data.lastName}`;
    document.getElementById('welcomeTitle').textContent = `Welcome back, ${data.firstName}`;
    document.getElementById('userName').textContent = fullName;
    document.getElementById('userGrade').textContent = data.grade;
    
    const initials = `${data.firstName[0]}${data.lastName[0]}`;
    document.getElementById('userAvatar').textContent = initials;
}

// Calculate Metrics Based on Student Data
function calculateMetrics(data) {
    const avgScore = Object.values(data.subjects).reduce((a, b) => a + b, 0) / 5;
    
    // Assignment completion rate (based on actual assignments or mock)
    let completionRate = 92;
    if (data.assignments && data.assignments.length > 0) {
        const completed = data.assignments.filter(a => a.status === 'completed').length;
        completionRate = Math.round((completed / data.assignments.length) * 100);
    }
    
    // Attendance reliability
    const attendanceRate = Math.round((data.classesAttended / data.totalClasses) * 100);
    
    // Quiz accuracy (based on average of subjects)
    const quizAccuracy = Math.round(avgScore * 0.9); // Mock calculation
    
    return {
        avgScore: avgScore.toFixed(1),
        completionRate,
        participationRate: data.participationScore,
        quizAccuracy,
        attendanceRate
    };
}

// Create Weekly Trend Chart
function createTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = loadStudentData();
    const metrics = calculateMetrics(data);
    
    // Generate weekly trend data based on current average
    const avgScore = parseFloat(metrics.avgScore);
    const weeklyScores = [
        avgScore - 10,
        avgScore - 8,
        avgScore - 5,
        avgScore - 3,
        avgScore - 1,
        avgScore
    ];
    
    const isDarkMode = htmlElement.getAttribute('data-theme') === 'dark';
    const lineColor = '#2563eb';
    const fillColor = isDarkMode ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.1)';
    const gridColor = isDarkMode ? '#334155' : '#e5e7eb';
    const textColor = isDarkMode ? '#cbd5e1' : '#6b7280';
    
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = textColor;
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    
    // Y-axis labels (60-100)
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight * i / 4);
        const value = 100 - (10 * i);
        
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        ctx.stroke();
        
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, padding.left - 10, y);
    }
    
    // Draw area fill
    ctx.beginPath();
    ctx.moveTo(padding.left, canvas.height - padding.bottom);
    
    weeklyScores.forEach((score, index) => {
        const x = padding.left + (chartWidth / (weeklyScores.length - 1)) * index;
        const y = padding.top + chartHeight - ((score - 60) / 40 * chartHeight);
        
        if (index === 0) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    weeklyScores.forEach((score, index) => {
        const x = padding.left + (chartWidth / (weeklyScores.length - 1)) * index;
        const y = padding.top + chartHeight - ((score - 60) / 40 * chartHeight);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw points
    weeklyScores.forEach((score, index) => {
        const x = padding.left + (chartWidth / (weeklyScores.length - 1)) * index;
        const y = padding.top + chartHeight - ((score - 60) / 40 * chartHeight);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.fill();
        ctx.strokeStyle = isDarkMode ? '#1e293b' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // X-axis labels
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    weeks.forEach((week, index) => {
        const x = padding.left + (chartWidth / (weeks.length - 1)) * index;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(week, x, canvas.height - padding.bottom + 15);
    });
}

// Create Donut Chart
function createDonutChart() {
    const canvas = document.getElementById('donutChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // FORCE SAFE DATA (ignore localStorage for now)
    const subjects = [
        { name: 'Math', score: 88, color: '#2563eb' },
        { name: 'Science', score: 75, color: '#10b981' },
        { name: 'English', score: 92, color: '#f59e0b' },
        { name: 'History', score: 84, color: '#8b5cf6' },
        { name: 'Computer', score: 96, color: '#ec4899' }
    ];

    canvas.width = 280;
    canvas.height = 280;

    const cx = 140;
    const cy = 140;
    const radius = 100;
    const innerRadius = 65;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = subjects.reduce((s, x) => s + x.score, 0);

    let angle = -Math.PI / 2;

    subjects.forEach(s => {
        const slice = (s.score / total) * Math.PI * 2;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, angle, angle + slice);
        ctx.arc(cx, cy, innerRadius, angle + slice, angle, true);
        ctx.closePath();
        ctx.fillStyle = s.color;
        ctx.fill();

        angle += slice;
    });

    // Avg score
    const avg = (total / subjects.length).toFixed(1);
    document.getElementById('avgScore').textContent = avg;
}

// Update Key Metrics
function updateMetrics(data) {
    const metrics = calculateMetrics(data);
    
    // Update values
    document.getElementById('completionRate').textContent = `${metrics.completionRate}%`;
    document.getElementById('completionBar').style.width = `${metrics.completionRate}%`;
    
    document.getElementById('participationRate').textContent = `${metrics.participationRate}%`;
    document.getElementById('participationBar').style.width = `${metrics.participationRate}%`;
    
    document.getElementById('quizAccuracy').textContent = `${metrics.quizAccuracy}%`;
    document.getElementById('quizBar').style.width = `${metrics.quizAccuracy}%`;
    
    document.getElementById('attendanceReliability').textContent = `${metrics.attendanceRate}%`;
    document.getElementById('attendanceBar').style.width = `${metrics.attendanceRate}%`;
    const legendContainer = document.getElementById('legend');

    // Animate bars
    setTimeout(() => {
        const bars = document.querySelectorAll('.metric-bar');
        bars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 200);
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        createTrendChart();
        createDonutChart();
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
    const data = loadStudentData();
    updateUserInfo(data);
    updateMetrics(data);
    createTrendChart();
    createDonutChart();
    
    document.documentElement.style.scrollBehavior = 'smooth';
});