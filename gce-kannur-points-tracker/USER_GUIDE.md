# GCE Kannur Departmental Points Tracker - User Guide

## 🚀 Getting Started

### Opening the Application
1. Open `index.html` in any modern web browser
2. The application will load with the black background and yellow text theme
3. You'll see department cards displaying current points for each department

### Demo Credentials
- **Username**: `admin`
- **Password**: `gce2024`

## 🎯 Main Features

### 1. Viewing Department Points
- Each department (CSE, ECE, EEE, MECH, CIVIL) is displayed as a card
- Current points are prominently shown in green
- Click on any department card to see recent activity details

### 2. Admin Login
- Click the "Admin Login" button in the header
- Enter your credentials to access point update features
- Once logged in, the button changes to show "Logout (username)"

### 3. Manual Point Updates
**Requirements**: Must be logged in as admin

1. Click the "Update Points" button on any department card
2. Enter the point change (positive for addition, negative for subtraction)
3. Use quick buttons (+5, +10, +25, -5, -10) for common values
4. **Required**: Provide a detailed event description
5. Click "Update Points" to confirm

**Example**: Add 15 points to CSE for "First place in inter-college hackathon"

### 4. Voice Input System 🎤
**Requirements**: Modern browser with microphone permissions

#### Activating Voice Input
- Click the "🎤 Voice Input" button
- Grant microphone permission when prompted
- Speak your command clearly
- The system will process and execute the command

#### Voice Command Examples
```
"Add 10 points to CSE for hackathon"
"Subtract 5 points from ECE for penalty"
"Give MECH 15 points for workshop completion"
"Remove 8 points from CIVIL for rule violation"
"What are the current standings"
```

#### Voice Command Structure
- **Action**: "Add", "Subtract", "Give", "Remove"
- **Amount**: Any number (e.g., "10", "fifteen")
- **Department**: "CSE", "ECE", "EEE", "MECH", "CIVIL"
- **Event**: "for [description]" (e.g., "for hackathon participation")

### 5. Recent Activity Feed
- Located at the bottom of the page
- Shows the last 10 point updates across all departments
- Displays:
  - Department name
  - Point change (+/-) 
  - Event description
  - Timestamp
  - Update method (manual/voice)
  - Admin who made the change

## ⌨️ Keyboard Shortcuts

- **Esc**: Close any open modal dialog
- **Ctrl + Space**: Activate/deactivate voice input
- **F1**: Show help and shortcuts
- **Enter**: Submit currently active form

## 📱 Mobile Usage

### Touch Interface
- All buttons are sized for easy touch interaction
- Swipe and scroll naturally on mobile devices
- Forms automatically adjust for mobile keyboards

### Installing as App (PWA)
1. Open the application in a mobile browser
2. Look for "Add to Home Screen" or "Install App" prompt
3. Follow browser-specific installation steps
4. Access like any other mobile app

### Offline Capabilities
- View existing data without internet connection
- Point updates sync when connection is restored
- App shell loads instantly on subsequent visits

## 🎨 Accessibility Features

### Visual Accessibility
- High contrast black/yellow theme for visibility
- Font scaling supported up to 300%
- Clear, bold typography throughout

### Navigation Accessibility
- Full keyboard navigation support
- Screen reader compatible
- Voice commands for hands-free operation
- ARIA labels for assistive technologies

### Customization
- Respect system font size preferences
- Support for reduced motion preferences
- High contrast mode enhancement

## 🔧 Troubleshooting

### Voice Input Issues

**Problem**: Voice button shows "Not Supported"
- **Solution**: Use Chrome, Edge, or Safari on HTTPS connection

**Problem**: Voice commands not recognized
- **Solutions**: 
  - Speak clearly and slowly
  - Check microphone permissions
  - Reduce background noise
  - Use exact department names (CSE, ECE, etc.)

**Problem**: Voice recognition errors
- **Solutions**:
  - Refresh the page
  - Try again with different wording
  - Use manual input as fallback

### Login Issues

**Problem**: Cannot login with demo credentials
- **Solution**: Ensure using exact credentials: `admin` / `gce2024`

**Problem**: Update buttons show "Login Required"
- **Solution**: Must be logged in to update points

### Data Issues

**Problem**: Points not updating
- **Solutions**:
  - Check internet connection
  - Refresh the page
  - Clear browser cache
  - Verify login status

**Problem**: Activity feed not showing
- **Solution**: Make some point updates to populate activity

### Mobile Issues

**Problem**: Buttons too small on mobile
- **Solution**: Use mobile browser zoom or accessibility settings

**Problem**: Voice input not working on mobile
- **Solution**: Ensure microphone permissions and HTTPS connection

## 💡 Best Practices

### Point Updates
1. Always provide descriptive event descriptions
2. Use appropriate point values (typically 5-50 points)
3. Double-check department selection before confirming
4. Review recent activity to avoid duplicates

### Voice Commands
1. Speak in a quiet environment
2. Use clear, natural speech
3. Include all required information in one command
4. Wait for confirmation before speaking again

### Data Management
1. Regularly check recent activity for accuracy
2. Keep event descriptions consistent
3. Use the export function for backups
4. Monitor point totals for anomalies

## 🔮 Advanced Features

### Bulk Updates (Future)
```javascript
// Example of programmatic bulk update
pointsTracker.bulkUpdate([
    { departmentId: 'cse', pointsChange: 10, eventDescription: 'Annual Day Performance' },
    { departmentId: 'ece', pointsChange: 10, eventDescription: 'Annual Day Performance' }
]);
```

### Data Export
```javascript
// Export all data to JSON file
pointsTracker.exportData();
```

### Custom Events
Future versions will support:
- Event templates for recurring activities
- Scheduled point updates
- Automated notifications
- Integration with college calendar

## 📞 Support & Feedback

### Common Questions

**Q**: Can multiple admins use the system simultaneously?
**A**: Yes, but changes are reflected in real-time for all users

**Q**: How long is data stored?
**A**: Data persists in browser local storage indefinitely

**Q**: Can I undo point updates?
**A**: Currently no, but future versions will include undo functionality

**Q**: Does voice input work in all browsers?
**A**: Best support in Chrome/Edge, limited in Firefox, iOS Safari 14.5+

### Getting Help
1. Press F1 for in-app help
2. Check browser console for error messages
3. Verify all files are properly loaded
4. Test with demo credentials first

---

**Designed for efficiency and accessibility at Govt. College of Engineering Kannur**
