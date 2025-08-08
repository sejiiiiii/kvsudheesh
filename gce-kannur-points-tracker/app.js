// GCE Kannur Departmental Points Tracker
// Main Application JavaScript with Voice Input

class PointsTracker {
    constructor() {
        this.departments = [
            { id: 'cse', name: 'CSE', fullName: 'Computer Science & Engineering', points: 0, color: '#FF6B6B' },
            { id: 'ece', name: 'ECE', fullName: 'Electronics & Communication', points: 0, color: '#4ECDC4' },
            { id: 'eee', name: 'EEE', fullName: 'Electrical & Electronics', points: 0, color: '#45B7D1' },
            { id: 'mech', name: 'MECH', fullName: 'Mechanical Engineering', points: 0, color: '#96CEB4' },
            { id: 'civil', name: 'CIVIL', fullName: 'Civil Engineering', points: 0, color: '#FFEAA7' }
        ];

        this.recentActivity = [];
        this.isLoggedIn = false;
        this.currentUser = null;
        this.selectedDepartment = null;
        this.isListening = false;
        this.recognition = null;

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.renderDepartments();
        this.renderRecentActivity();
        this.updateUI();
    }

    loadFromStorage() {
        const savedData = localStorage.getItem('gce-points-tracker');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.departments = data.departments || this.departments;
            this.recentActivity = data.recentActivity || [];
        }
    }

    saveToStorage() {
        const data = {
            departments: this.departments,
            recentActivity: this.recentActivity
        };
        localStorage.setItem('gce-points-tracker', JSON.stringify(data));
    }

    setupEventListeners() {
        // Voice button
        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.toggleVoiceRecognition();
        });

        // Login button
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showLoginModal();
        });

        // Modal close buttons
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideModal('updateModal');
        });

        document.getElementById('closeLogin').addEventListener('click', () => {
            this.hideModal('loginModal');
        });

        // Form submissions
        document.getElementById('updateForm').addEventListener('submit', (e) => {
            this.handlePointUpdate(e);
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            this.handleLogin(e);
        });

        // Cancel buttons
        document.getElementById('cancelUpdate').addEventListener('click', () => {
            this.hideModal('updateModal');
        });

        document.getElementById('cancelLogin').addEventListener('click', () => {
            this.hideModal('loginModal');
        });

        // Quick point buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const value = parseInt(e.target.dataset.value);
                document.getElementById('pointsInput').value = value;
            }
        });

        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
            if (e.ctrlKey && e.key === ' ') {
                e.preventDefault();
                this.toggleVoiceRecognition();
            }
        });
    }

    setupVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Speech recognition not supported');
            document.getElementById('voiceBtn').disabled = true;
            document.getElementById('voiceBtn').innerHTML = '🎤 Not Supported';
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.showVoiceStatus('Listening...');
            document.getElementById('voiceBtn').innerHTML = '🔴 Stop';
            document.getElementById('voiceBtn').style.backgroundColor = 'var(--accent-error)';
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            this.processVoiceCommand(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.showMessage(`Voice recognition error: ${event.error}`, 'error');
            this.stopVoiceRecognition();
        };

        this.recognition.onend = () => {
            this.stopVoiceRecognition();
        };
    }

    toggleVoiceRecognition() {
        if (this.isListening) {
            this.stopVoiceRecognition();
        } else {
            this.startVoiceRecognition();
        }
    }

    startVoiceRecognition() {
        if (!this.recognition) return;
        
        try {
            this.recognition.start();
            this.showMessage('Voice recognition activated. Speak your command.', 'success');
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            this.showMessage('Failed to start voice recognition', 'error');
        }
    }

    stopVoiceRecognition() {
        this.isListening = false;
        this.hideVoiceStatus();
        document.getElementById('voiceBtn').innerHTML = '🎤 Voice Input';
        document.getElementById('voiceBtn').style.backgroundColor = '';
        
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    processVoiceCommand(transcript) {
        console.log('Voice command:', transcript);
        this.showVoiceStatus(`Processing: "${transcript}"`);

        // Extract department names
        const deptMap = {
            'cse': ['cse', 'computer science', 'cs'],
            'ece': ['ece', 'electronics communication', 'ec'],
            'eee': ['eee', 'electrical electronics', 'electrical'],
            'mech': ['mech', 'mechanical', 'mechanical engineering'],
            'civil': ['civil', 'civil engineering']
        };

        let foundDept = null;
        let deptKey = null;

        for (const [key, aliases] of Object.entries(deptMap)) {
            if (aliases.some(alias => transcript.includes(alias))) {
                foundDept = this.departments.find(d => d.id === key);
                deptKey = key;
                break;
            }
        }

        // Extract points
        const pointsMatch = transcript.match(/(\d+)\s*points?/);
        const points = pointsMatch ? parseInt(pointsMatch[1]) : null;

        // Determine action
        let action = 'add';
        if (transcript.includes('subtract') || transcript.includes('remove') || transcript.includes('minus')) {
            action = 'subtract';
        }

        // Extract event description
        const eventPatterns = [
            /for (.+)/,
            /because (.+)/,
            /due to (.+)/
        ];

        let eventDescription = 'Voice command update';
        for (const pattern of eventPatterns) {
            const match = transcript.match(pattern);
            if (match) {
                eventDescription = match[1];
                break;
            }
        }

        // Process command
        if (foundDept && points) {
            const pointChange = action === 'subtract' ? -points : points;
            this.updateDepartmentPoints(deptKey, pointChange, eventDescription, 'voice');
            
            const actionText = action === 'subtract' ? 'subtracted from' : 'added to';
            this.showMessage(`${points} points ${actionText} ${foundDept.name} for: ${eventDescription}`, 'success');
            
            // Voice feedback
            this.speakText(`${points} points ${actionText} ${foundDept.name}`);
        } else {
            // Handle queries
            if (transcript.includes('current') || transcript.includes('standings') || transcript.includes('points')) {
                this.handleVoiceQuery();
            } else {
                this.showMessage('Could not understand the command. Try: "Add 10 points to CSE for hackathon"', 'warning');
                this.speakText('Command not understood. Please try again.');
            }
        }

        setTimeout(() => {
            this.hideVoiceStatus();
        }, 3000);
    }

    handleVoiceQuery() {
        const sortedDepts = [...this.departments].sort((a, b) => b.points - a.points);
        let response = 'Current standings: ';
        response += sortedDepts.map((dept, index) => 
            `${index + 1}. ${dept.name} with ${dept.points} points`
        ).join(', ');
        
        this.showMessage('Check the display for current standings', 'info');
        this.speakText(response);
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1.0;
            speechSynthesis.speak(utterance);
        }
    }

    showVoiceStatus(text) {
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceText = document.getElementById('voiceText');
        
        voiceText.textContent = text;
        voiceStatus.classList.remove('hidden');
    }

    hideVoiceStatus() {
        const voiceStatus = document.getElementById('voiceStatus');
        voiceStatus.classList.add('hidden');
    }

    renderDepartments() {
        const grid = document.getElementById('departmentsGrid');
        grid.innerHTML = '';

        // Sort departments by points (highest first) for leaderboard
        const sortedDepartments = [...this.departments].sort((a, b) => b.points - a.points);

        sortedDepartments.forEach((dept, index) => {
            const card = document.createElement('div');
            card.className = 'department-card';
            card.setAttribute('data-position', index + 1); // Add position for CSS
            card.innerHTML = `
                <h3 class="dept-name">${dept.name}</h3>
                <div class="dept-points">${dept.points}</div>
                <div class="dept-info">${dept.fullName}</div>
                <button class="update-btn" ${!this.isLoggedIn ? 'disabled' : ''} 
                        onclick="pointsTracker.showUpdateModal('${dept.id}')">
                    ${this.isLoggedIn ? 'Update Points' : 'Login Required'}
                </button>
            `;

            // Add click handler for the entire card
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('update-btn')) return;
                this.showDepartmentDetails(dept);
            });

            grid.appendChild(card);
        });
    }

    showDepartmentDetails(dept) {
        const activities = this.recentActivity.filter(activity => activity.departmentId === dept.id);
        let details = `${dept.fullName}\nCurrent Points: ${dept.points}\n\n`;
        
        if (activities.length > 0) {
            details += 'Recent Activity:\n';
            activities.slice(0, 5).forEach(activity => {
                const date = new Date(activity.timestamp).toLocaleDateString();
                const points = activity.pointsChanged > 0 ? `+${activity.pointsChanged}` : activity.pointsChanged;
                details += `• ${points} points - ${activity.eventDescription} (${date})\n`;
            });
        } else {
            details += 'No recent activity.';
        }
        
        alert(details);
    }

    showUpdateModal(deptId) {
        if (!this.isLoggedIn) {
            this.showMessage('Please login to update points', 'warning');
            return;
        }

        this.selectedDepartment = this.departments.find(d => d.id === deptId);
        if (!this.selectedDepartment) return;

        document.getElementById('modalTitle').textContent = `Update Points - ${this.selectedDepartment.name}`;
        document.getElementById('pointsInput').value = '';
        document.getElementById('eventInput').value = '';
        
        this.showModal('updateModal');
        document.getElementById('pointsInput').focus();
    }

    showLoginModal() {
        document.getElementById('usernameInput').value = '';
        document.getElementById('passwordInput').value = '';
        this.showModal('loginModal');
        document.getElementById('usernameInput').focus();
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        document.body.style.overflow = '';
    }

    hideAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
    }

    handlePointUpdate(e) {
        e.preventDefault();
        
        const pointsInput = document.getElementById('pointsInput');
        const eventInput = document.getElementById('eventInput');
        
        const pointsChange = parseInt(pointsInput.value);
        const eventDescription = eventInput.value.trim();

        if (!pointsChange || !eventDescription) {
            this.showMessage('Please enter both points and event description', 'warning');
            return;
        }

        if (Math.abs(pointsChange) > 500) {
            if (!confirm('You are about to make a large point change. Are you sure?')) {
                return;
            }
        }

        this.updateDepartmentPoints(
            this.selectedDepartment.id, 
            pointsChange, 
            eventDescription, 
            'manual'
        );

        this.hideModal('updateModal');
        
        const actionText = pointsChange > 0 ? 'added to' : 'subtracted from';
        this.showMessage(
            `${Math.abs(pointsChange)} points ${actionText} ${this.selectedDepartment.name}`, 
            'success'
        );
    }

    updateDepartmentPoints(deptId, pointsChange, eventDescription, method = 'manual') {
        const dept = this.departments.find(d => d.id === deptId);
        if (!dept) return;

        const oldPoints = dept.points;
        dept.points = Math.max(0, dept.points + pointsChange);

        // Add to activity log
        const activity = {
            id: Date.now(),
            departmentId: deptId,
            departmentName: dept.name,
            pointsChanged: pointsChange,
            eventDescription: eventDescription,
            timestamp: new Date().toISOString(),
            updatedBy: this.currentUser || 'System',
            method: method
        };

        this.recentActivity.unshift(activity);
        
        // Keep only last 100 activities
        if (this.recentActivity.length > 100) {
            this.recentActivity = this.recentActivity.slice(0, 100);
        }

        this.saveToStorage();
        this.renderDepartments();
        this.renderRecentActivity();

        // Trigger real-time update animation
        this.animatePointChange(deptId, oldPoints, dept.points);
    }

    animatePointChange(deptId, oldPoints, newPoints) {
        // Find the department card and animate the point change
        const cards = document.querySelectorAll('.department-card');
        const targetCard = Array.from(cards).find(card => 
            card.querySelector('.dept-name').textContent === this.departments.find(d => d.id === deptId).name
        );

        if (targetCard) {
            const pointsElement = targetCard.querySelector('.dept-points');
            pointsElement.style.transform = 'scale(1.2)';
            pointsElement.style.color = newPoints > oldPoints ? 'var(--accent-success)' : 'var(--accent-warning)';
            
            setTimeout(() => {
                pointsElement.style.transform = '';
                pointsElement.style.color = '';
            }, 500);
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('usernameInput').value.trim();
        const password = document.getElementById('passwordInput').value;

        // Simple demo authentication
        if (username && password) {
            if (username === 'admin' && password === 'gce2024') {
                this.isLoggedIn = true;
                this.currentUser = username;
                this.hideModal('loginModal');
                this.updateUI();
                this.showMessage(`Welcome, ${username}!`, 'success');
            } else {
                this.showMessage('Invalid credentials. Try admin/gce2024', 'error');
            }
        } else {
            this.showMessage('Please enter both username and password', 'warning');
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        
        if (this.isLoggedIn) {
            loginBtn.textContent = `Logout (${this.currentUser})`;
            loginBtn.onclick = () => this.logout();
        } else {
            loginBtn.textContent = 'Admin Login';
            loginBtn.onclick = () => this.showLoginModal();
        }

        this.renderDepartments();
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.updateUI();
        this.showMessage('Logged out successfully', 'info');
    }

    renderRecentActivity() {
        const feed = document.getElementById('activityFeed');
        
        if (this.recentActivity.length === 0) {
            feed.innerHTML = '<div class="activity-item">No recent activity</div>';
            return;
        }

        feed.innerHTML = this.recentActivity.slice(0, 10).map(activity => {
            const time = new Date(activity.timestamp).toLocaleString();
            const pointsClass = activity.pointsChanged > 0 ? 'positive' : 'negative';
            const pointsText = activity.pointsChanged > 0 ? 
                `+${activity.pointsChanged}` : activity.pointsChanged;

            return `
                <div class="activity-item">
                    <div class="activity-header">
                        <div>
                            <span class="activity-dept">${activity.departmentName}</span>
                            <span class="activity-points ${pointsClass}">${pointsText} pts</span>
                        </div>
                        <span class="activity-time">${time}</span>
                    </div>
                    <div class="activity-event">${activity.eventDescription}</div>
                    <div class="activity-method" style="font-size: 0.8rem; opacity: 0.6;">
                        via ${activity.method} by ${activity.updatedBy}
                    </div>
                </div>
            `;
        }).join('');
    }

    showMessage(message, type = 'info') {
        const container = document.getElementById('messageContainer');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;

        container.appendChild(messageEl);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);

        // Remove on click
        messageEl.addEventListener('click', () => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        });
    }

    // Export functionality
    exportData() {
        const data = {
            departments: this.departments,
            recentActivity: this.recentActivity,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gce-points-tracker-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage('Data exported successfully', 'success');
    }

    // Bulk update functionality
    bulkUpdate(updates) {
        updates.forEach(update => {
            this.updateDepartmentPoints(
                update.departmentId,
                update.pointsChange,
                update.eventDescription,
                'bulk'
            );
        });
        this.showMessage(`Bulk update completed for ${updates.length} departments`, 'success');
    }
}

// Initialize the application
let pointsTracker;

document.addEventListener('DOMContentLoaded', () => {
    pointsTracker = new PointsTracker();
    
    // Add some demo data on first load
    const hasData = localStorage.getItem('gce-points-tracker');
    if (!hasData) {
        setTimeout(() => {
            pointsTracker.showMessage('Welcome to GCE Kannur Points Tracker! Login with admin/gce2024 to get started.', 'info');
        }, 1000);
    }
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// PWA install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    const installBtn = document.createElement('button');
    installBtn.textContent = '📱 Install App';
    installBtn.className = 'voice-btn';
    installBtn.style.position = 'fixed';
    installBtn.style.bottom = '20px';
    installBtn.style.right = '20px';
    installBtn.style.zIndex = '1000';
    
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                pointsTracker.showMessage('App installed successfully!', 'success');
            }
            deferredPrompt = null;
            installBtn.remove();
        }
    });
    
    document.body.appendChild(installBtn);
    
    setTimeout(() => {
        if (installBtn.parentNode) {
            installBtn.remove();
        }
    }, 10000);
});

// Keyboard shortcuts help
document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        e.preventDefault();
        const shortcuts = `
Keyboard Shortcuts:
• Esc: Close modals
• Ctrl + Space: Toggle voice input
• F1: Show this help

Voice Commands Examples:
• "Add 10 points to CSE for hackathon"
• "Subtract 5 points from ECE for penalty"
• "What are the current standings"
• "Give MECH 15 points for workshop"

Login Credentials (Demo):
• Username: admin
• Password: gce2024
        `;
        alert(shortcuts);
    }
});
