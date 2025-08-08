# GCE Kannur Departmental Points Tracker

## Overview
A web application designed for Govt. College of Engineering Kannur to track and manage departmental points for CSE, ECE, EEE, MECH, and CIVIL departments.

## Technical Requirements

### Backend Technology Stack
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API architecture
- **Voice Processing**: Web Speech API (client-side) with fallback to server-side processing

### Frontend Technology Stack
- **Framework**: React.js with TypeScript
- **Styling**: CSS3 with responsive design
- **State Management**: React Context API or Redux
- **Voice Input**: Web Speech API
- **Mobile Support**: Progressive Web App (PWA) capabilities

### Database Schema
```javascript
// Department Schema
{
  _id: ObjectId,
  name: String, // CSE, ECE, EEE, MECH, CIVIL
  currentPoints: Number,
  createdAt: Date,
  updatedAt: Date
}

// Point Update Schema
{
  _id: ObjectId,
  departmentId: ObjectId,
  pointsChanged: Number, // positive or negative
  eventDescription: String,
  updatedBy: ObjectId, // admin user ID
  timestamp: Date,
  updateMethod: String // 'manual' or 'voice'
}

// Admin User Schema
{
  _id: ObjectId,
  username: String,
  email: String,
  passwordHash: String,
  role: String, // 'admin', 'super_admin'
  department: String, // optional, for department-specific admins
  createdAt: Date,
  lastLogin: Date
}
```

## User Interface Specifications

### Design Requirements
- **Background**: Pure black (#000000)
- **Text Color**: Yellow (#FFD700 or #FFFF00)
- **Font**: Helvetica Bold
- **Typography**: All text must be bold weight
- **Contrast Ratio**: Minimum 7:1 for WCAG AAA compliance

### Responsive Design
- **Desktop**: Grid layout with department cards
- **Tablet**: Responsive grid that adapts to screen size
- **Mobile**: Single column layout with touch-friendly buttons
- **Breakpoints**: 
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+

### Accessibility Features
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Voice Announcements**: Screen reader compatible
- **High Contrast**: Black background with yellow text
- **Font Size**: Minimum 16px, scalable up to 200%

## Core Features

### 1. Dashboard
- Real-time display of all department points
- Quick overview cards for each department
- Recent activity feed
- Voice input activation button

### 2. Point Management
- Manual point addition/subtraction interface
- Event description mandatory for each update
- Confirmation dialogs for all changes
- Undo functionality (within session)

### 3. Voice Input System
- "Add [number] points to [department] for [event]"
- "Subtract [number] points from [department] for [event]"
- Voice feedback confirmation
- Fallback to manual input if voice fails

### 4. History & Reporting
- Complete audit trail of all point changes
- Filter by department, date range, admin user
- Export functionality (CSV, PDF)
- Visual charts and graphs

### 5. User Management
- Admin authentication system
- Role-based access control
- Department-specific permissions
- Activity logging

## Security Requirements
- HTTPS encryption mandatory
- JWT token authentication
- Password hashing (bcrypt)
- Rate limiting for API endpoints
- Input validation and sanitization
- CORS configuration
- Session management

## Performance Requirements
- Page load time: < 3 seconds
- Voice recognition response: < 2 seconds
- Database queries optimized with indexing
- Caching strategy for frequently accessed data
- Offline capability for basic viewing (PWA)

## Deployment Architecture
- **Frontend**: Static hosting (Netlify/Vercel)
- **Backend**: Cloud hosting (AWS/Heroku/DigitalOcean)
- **Database**: MongoDB Atlas (cloud)
- **CDN**: For static assets
- **SSL**: Let's Encrypt certificates

## Voice Input Implementation
```javascript
// Voice commands structure
const voiceCommands = {
  patterns: [
    "add {number} points to {department} for {event}",
    "subtract {number} points from {department} for {event}",
    "remove {number} points from {department} for {event}",
    "give {department} {number} points for {event}"
  ],
  departments: ["CSE", "ECE", "EEE", "MECH", "CIVIL"],
  numbers: /\b\d+\b/,
  events: "free text capture"
}
```

## API Endpoints
```
GET    /api/departments           - Get all departments with points
POST   /api/departments/:id/points - Update department points
GET    /api/history              - Get point update history
POST   /api/auth/login           - Admin authentication
GET    /api/auth/verify          - Verify JWT token
POST   /api/voice/process        - Process voice input
```

## Mobile-First Design Principles
- Touch-friendly buttons (minimum 44px)
- Swipe gestures for navigation
- Voice input prominent on mobile
- Offline functionality
- App-like experience (PWA)

## Testing Strategy
- Unit tests for all components
- Integration tests for API endpoints
- Voice input testing across browsers
- Accessibility testing (WAVE, axe)
- Cross-browser compatibility testing
- Mobile device testing (iOS/Android)

## Maintenance & Updates
- Regular security updates
- Database backup strategy
- Error monitoring and logging
- Performance monitoring
- User feedback collection system
