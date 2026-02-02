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

// Analyze Student Performance and Generate Recommendations
function analyzePerformance(data) {
    const subjects = data.subjects;
    const subjectNames = {
        mathematics: 'Mathematics',
        MySQL: 'MySQL',
        english: 'English',
        machineLearning: 'Machine Learning',
        computerScience: 'Computer Science'
    };
    
    // Find lowest scoring subject
    let lowestSubject = null;
    let lowestScore = 100;
    
    for (let key in subjects) {
        if (subjects[key] < lowestScore) {
            lowestScore = subjects[key];
            lowestSubject = key;
        }
    }
    
    // Find highest scoring subject
    let highestSubject = null;
    let highestScore = 0;
    
    for (let key in subjects) {
        if (subjects[key] > highestScore) {
            highestScore = subjects[key];
            highestSubject = key;
        }
    }
    
    // Calculate average
    const avgScore = Object.values(subjects).reduce((a, b) => a + b, 0) / Object.keys(subjects).length;
    const attendanceRate = (data.classesAttended / data.totalClasses) * 100;
    
    return {
        lowestSubject,
        lowestScore,
        lowestSubjectName: subjectNames[lowestSubject],
        highestSubject,
        highestScore,
        highestSubjectName: subjectNames[highestSubject],
        avgScore,
        attendanceRate,
        participationScore: data.participationScore,
        behaviorScore: data.behaviorScore
    };
}

// Generate Main Recommendation
function generateMainRecommendation(data, analysis) {
    const mainRec = document.getElementById('mainRecommendation');
    
    let title, description, subject, tags, actions;
    
    // Determine main focus based on lowest score
    if (analysis.lowestScore < 80) {
        title = `Boost your ${analysis.lowestSubjectName} scores`;
        description = `We've noticed a slight dip in your ${analysis.lowestSubjectName} performance. Dedicating 30 minutes extra this week could bring your average back up to an A.`;
        subject = analysis.lowestSubjectName;
        
        // Generate specific actions based on subject
        actions = [
            `Review key concepts in ${analysis.lowestSubjectName}`,
            `Take a practice quiz to identify weak areas`,
            `Watch educational videos on challenging topics`
        ];
        
        tags = [
            { text: subject, class: '' },
            { text: 'High Priority', class: 'priority-high' }
        ];
    } else if (analysis.attendanceRate < 90) {
        title = 'Improve Your Attendance';
        description = 'Your attendance has room for improvement. Consistent attendance is crucial for staying on track with lessons and assignments.';
        subject = 'Attendance';
        actions = [
            'Set morning alarms earlier',
            'Prepare materials the night before',
            'Review class schedules weekly'
        ];
        tags = [
            { text: 'Attendance', class: '' },
            { text: 'High Priority', class: 'priority-high' }
        ];
    } else if (analysis.participationScore < 85) {
        title = 'Increase Class Participation';
        description = 'Your academic scores are strong, but increasing participation could enhance your learning and class engagement.';
        subject = 'Participation';
        actions = [
            'Prepare questions before each class',
            'Volunteer to answer at least once per class',
            'Join study groups for collaborative learning'
        ];
        tags = [
            { text: 'Participation', class: '' },
            { text: 'Medium Priority', class: 'priority-medium' }
        ];
    } else {
        title = 'Maintain Your Excellent Performance';
        description = 'You\'re doing great! Keep up the consistent study habits and consider helping classmates to reinforce your knowledge.';
        subject = 'General';
        actions = [
            'Continue your current study routine',
            'Consider tutoring peers in your strong subjects',
            'Challenge yourself with advanced materials'
        ];
        tags = [
            { text: 'Excellence', class: '' },
            { text: 'Keep Going', class: 'priority-low' }
        ];
    }
    
    // Update HTML
    mainRec.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        
        <div class="tags">
            ${tags.map(tag => `<span class="tag ${tag.class}">${tag.text}</span>`).join('')}
        </div>

        <div class="suggested-actions">
            <h4>SUGGESTED ACTIONS</h4>
            <ul>
                ${actions.map(action => `
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        ${action}
                    </li>
                `).join('')}
            </ul>
            <button class="btn-primary">Start Learning</button>
        </div>
    `;
}

// Generate Priority Cards
function generatePriorityCards(data, analysis) {
    const container = document.getElementById('priorityCardsGrid');
    const cards = [];
    
    // High Priority Card - Based on lowest subject
    if (analysis.lowestScore < 85) {
        cards.push({
            priority: 'high',
            priorityText: 'High Priority',
            category: 'Academic',
            title: `Focus on ${analysis.lowestSubjectName}`,
            description: `Your recent ${analysis.lowestSubjectName} scores show room for improvement. Dedicating extra time this week could boost your grade.`
        });
    } else if (analysis.attendanceRate < 90) {
        cards.push({
            priority: 'high',
            priorityText: 'High Priority',
            category: 'Attendance',
            title: 'Improve Attendance Rate',
            description: `Current attendance is ${Math.round(analysis.attendanceRate)}%. Aim for 95% or higher to stay on track with all lessons.`
        });
    } else {
        cards.push({
            priority: 'high',
            priorityText: 'High Priority',
            category: 'Academic',
            title: `Maintain ${analysis.highestSubjectName} Excellence`,
            description: `You're excelling at ${analysis.highestSubjectName}! Consider advanced topics or helping peers to deepen your understanding.`
        });
    }
    
    // Medium Priority Card - Study habits
    if (analysis.participationScore < 80) {
        cards.push({
            priority: 'medium',
            priorityText: 'Medium Priority',
            category: 'Participation',
            title: 'Increase Class Participation',
            description: 'Active participation helps reinforce learning. Try contributing at least once per class session.'
        });
    } else {
        cards.push({
            priority: 'medium',
            priorityText: 'Medium Priority',
            category: 'Habit',
            title: 'Consistent Study Time',
            description: 'Establish a regular study schedule. Try dedicating specific hours each day for focused study sessions.'
        });
    }
    
    // Low Priority Card - Based on participation in specific subject
    const participationSubject = analysis.lowestScore < analysis.highestScore ? analysis.lowestSubjectName : 'class discussions';
    cards.push({
        priority: 'low',
        priorityText: 'Low Priority',
        category: 'Participation',
        title: `Speak Up More`,
        description: `Consider contributing more during ${participationSubject}. Your insights could help both you and your classmates.`
    });
    
    // Render cards
    container.innerHTML = cards.map(card => `
        <div class="priority-card ${card.priority}-priority">
            <div class="card-header">
                <span class="priority-badge ${card.priority}">${card.priorityText}</span>
                <span class="category">${card.category}</span>
            </div>
            <h3 class="card-title">${card.title}</h3>
            <p class="card-description">${card.description}</p>
            <button class="view-details-btn">
                View Details
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        </div>
    `).join('');
}

// Generate Study Habits
function generateStudyHabits(data, analysis) {
    const workingContainer = document.getElementById('workingHabits');
    const needsAttentionContainer = document.getElementById('needsAttentionHabits');
    
    const working = [];
    const needsAttention = [];
    
    // Analyze what's working
    if (analysis.highestScore >= 90) {
        working.push(`Excelling in ${analysis.highestSubjectName}`);
    }
    
    if (analysis.attendanceRate >= 90) {
        working.push('Consistent morning attendance');
    }
    
    if (analysis.behaviorScore >= 90) {
        working.push('Excellent classroom behavior');
    }
    
    if (data.assignments && data.assignments.filter(a => a.status === 'completed').length > 0) {
        working.push('Completing assignments on time');
    }
    
    // If not enough working items, add generic ones
    if (working.length < 2) {
        working.push('Maintaining regular study schedule');
        working.push('Active participation in class');
    }
    
    // Analyze what needs attention
    if (analysis.lowestScore < 80) {
        needsAttention.push(`${analysis.lowestSubjectName} performance needs improvement`);
    }
    
    if (analysis.participationScore < 80) {
        needsAttention.push('Low participation in class discussions');
    }
    
    if (analysis.attendanceRate < 90) {
        needsAttention.push('Inconsistent attendance pattern');
    }
    
    // If not enough attention items, add generic ones
    if (needsAttention.length < 2) {
        needsAttention.push('Late night study sessions impacting focus');
        needsAttention.push('Could improve time management for assignments');
    }
    
    // Render working habits
    workingContainer.innerHTML = working.slice(0, 3).map(habit => `
        <div class="habit-item success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>${habit}</span>
        </div>
    `).join('');
    
    // Render needs attention
    needsAttentionContainer.innerHTML = needsAttention.slice(0, 3).map(habit => `
        <div class="habit-item warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>${habit}</span>
        </div>
    `).join('');
}

// Generate Daily Tip
function generateDailyTip() {
    const tips = [
        "Spaced repetition is key. Review your notes 10 minutes after class, then again 24 hours later.",
        "Take regular breaks during study sessions. The Pomodoro Technique (25 min work, 5 min break) can boost focus.",
        "Teach someone else what you've learned. Explaining concepts reinforces your own understanding.",
        "Stay hydrated and eat brain-healthy foods. Your mental performance depends on physical wellness.",
        "Get adequate sleep. Studies show that 7-9 hours improves memory consolidation and problem-solving.",
        "Active recall is more effective than re-reading. Test yourself regularly on the material.",
        "Create a dedicated study space free from distractions. Your environment affects your focus.",
        "Set specific, achievable goals for each study session. Clear objectives improve productivity."
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('dailyTip').textContent = `"${randomTip}"`;
}

// Add Button Click Handlers
function setupEventListeners() {
    // Start Learning button
    const startLearningBtn = document.querySelector('.suggested-actions .btn-primary');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', () => {
            alert('Starting learning session! This would navigate to study materials.');
        });
    }
    
    // View Details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Detailed recommendation view would open here.');
        });
    });
    
    // Read More button
    const readMoreBtn = document.querySelector('.read-more-btn');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', () => {
            alert('More study tips and learning resources would be displayed here.');
        });
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
const logoutLink = document.querySelector('.logout .nav-item');
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'dashboard.html';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const data = loadStudentData();
    const analysis = analyzePerformance(data);
    
    updateUserInfo(data);
    generateMainRecommendation(data, analysis);
    generatePriorityCards(data, analysis);
    generateStudyHabits(data, analysis);
    generateDailyTip();
    setupEventListeners();
    
    document.documentElement.style.scrollBehavior = 'smooth';
});