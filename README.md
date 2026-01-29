# Educo - Mobile-First Education Web App

A modern, mobile-first education platform built with vanilla HTML, CSS, and JavaScript, powered by Firebase. Designed to provide a seamless learning experience similar to Byju's and NCERT apps.

## 🌟 Features

### Core Features
- 🔐 **Secure Authentication** - Firebase Email/Password login with role-based access
- 👤 **User Profiles** - Complete profile management with school, class, and board info
- 📚 **Dynamic Content** - Content adapts based on user's class and school
- 📖 **PDF Viewer** - Built-in PDF viewer with Google Drive integration
- 📥 **PDF Download** - One-click download functionality
- 🔔 **Push Notifications** - Real-time notifications via FCM
- 👨‍💼 **Admin Panel** - Complete admin dashboard for managing users, content, and notifications

### User Features
- **Mobile-First Design** - Optimized for mobile devices with touch-friendly UI
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Instant content and notification updates
- **Offline Support** - Service worker ready for PWA capabilities
- **Notification Tracking** - Track read/unread notifications
- **Targeted Content** - Content filtered by class and school

### Admin Features
- **User Management** - Create, edit, and delete users
- **Content Management** - Add and manage educational content
- **Notification System** - Send targeted notifications by class and school
- **Analytics Ready** - Track user engagement and content usage

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
- Basic knowledge of HTML, CSS, and JavaScript

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd educo
   ```

2. **Configure Firebase**
   - Follow the detailed setup in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - Update `firebase-config.js` with your Firebase credentials

3. **Open the app**
   ```bash
   # Simply open index.html in your browser
   open index.html
   ```

4. **Or use a local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

5. **Access the app**
   - Open `http://localhost:8000` in your browser
   - Login with admin credentials or create a user

## 📁 Project Structure

```
educo/
├── index.html              # Main HTML file
├── styles.css              # All CSS styles (mobile-first)
├── app.js                  # Main application logic
├── firebase-config.js      # Firebase configuration
├── firestore.rules         # Firestore security rules
├── FIREBASE_SETUP.md       # Detailed Firebase setup guide
└── README.md              # This file
```

## 🔑 Default Admin Credentials

```
Email: admin@educo.app
Password: [Set during setup]
```

**Note:** Create the admin user using Firebase Console or the Admin Panel after setup.

## 📱 Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Firebase Services Used

- **Authentication** - Email/Password authentication
- **Firestore Database** - NoSQL database for users, content, and notifications
- **Cloud Messaging (FCM)** - Push notifications
- **Hosting** - (Optional) Web hosting

## 📊 Firestore Data Structure

### Users Collection
```javascript
{
  name: string,
  email: string,
  class: string,
  board: string,
  school: string,
  fcmToken: string,
  createdAt: timestamp
}
```

### Content Collection
```javascript
{
  title: string,
  bookName: string,
  chapterNumber: number,
  class: string,
  school: string,
  viewUrl: string,
  downloadUrl: string,
  createdAt: timestamp
}
```

### Notifications Collection
```javascript
{
  title: string,
  message: string,
  class: string,
  school: string,
  timestamp: timestamp,
  readBy: array
}
```

## 🎨 UI/UX Features

- **Mobile-First Design** - Optimized for touch interactions
- **Smooth Animations** - CSS transitions and keyframe animations
- **Responsive Grid** - Content grid adapts to screen size
- **Dark Mode Ready** - CSS variables for easy theming
- **Accessibility** - ARIA labels and keyboard navigation
- **Loading States** - Visual feedback during data loading
- **Error Handling** - User-friendly error messages

## 🔐 Security Features

- **Firebase Authentication** - Secure user authentication
- **Firestore Security Rules** - Role-based data access
- **Input Validation** - Client-side form validation
- **XSS Protection** - Safe DOM manipulation
- **Admin Protection** - Admin-only routes and actions

## 📝 Usage Guide

### For Students/Teachers

1. **Login** with your credentials
2. **View Profile** to see your details
3. **Browse Content** on the home page
4. **Open Books** to see chapters
5. **Read PDFs** with the built-in viewer
6. **Download PDFs** for offline reading
7. **Check Notifications** for updates

### For Admins

1. **Login** as admin (admin@educo.app)
2. **Access Admin Panel** from the menu
3. **Manage Users** - Create and manage student accounts
4. **Manage Content** - Add books, chapters, and PDFs
5. **Send Notifications** - Target specific classes and schools
6. **Monitor** user engagement and content usage

## 🌐 Deployment

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init

# Deploy
firebase deploy
```

### Netlify/Vercel

1. Push code to GitHub
2. Connect repository to Netlify/Vercel
3. Deploy with default settings

### Custom Hosting

1. Update Firebase config for production
2. Enable HTTPS (required for FCM)
3. Configure domain and SSL certificates

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can login with valid credentials
- [ ] User cannot login with invalid credentials
- [ ] Profile page displays correct user information
- [ ] Home page shows content based on user's class/school
- [ ] PDF viewer loads and displays PDFs
- [ ] PDF download works correctly
- [ ] Notifications are received and displayed
- [ ] Unread count badge updates correctly
- [ ] Admin panel is accessible to admin only
- [ ] Admin can create, edit, and delete users
- [ ] Admin can add and manage content
- [ ] Admin can send notifications
- [ ] App works on mobile browsers
- [ ] App works on desktop browsers

## 🐛 Troubleshooting

### Common Issues

**Problem: Login fails**
- Solution: Check Firebase config, verify email/password, check Firestore rules

**Problem: PDF doesn't load**
- Solution: Ensure Google Drive link is public, verify URL format, check CORS

**Problem: Notifications not working**
- Solution: Enable notifications in browser, verify FCM config, check HTTPS

**Problem: Admin panel not accessible**
- Solution: Verify email is admin@educo.app, check authentication state

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed troubleshooting.

## 🔄 Updates and Maintenance

### Regular Tasks
- Review and update Firestore security rules
- Monitor Firebase Console for errors
- Backup important data regularly
- Update Firebase SDK versions
- Test new features before deployment

### Adding New Features

1. Update Firestore collections if needed
2. Modify security rules accordingly
3. Add UI components to HTML
4. Style with CSS
5. Implement logic in app.js
6. Test thoroughly

## 📄 License

This project is provided as-is for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for setup issues
- Review browser console for errors
- Check Firebase Console for service issues
- Verify all configuration files

## 🎯 Roadmap

### Future Enhancements

- [ ] PWA with offline support
- [ ] Video content support
- [ ] Quiz and assessment features
- [ ] Progress tracking
- [ ] Discussion forums
- [ ] Live classes integration
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode toggle

## 🙏 Acknowledgments

- Firebase for the amazing backend services
- Google Drive for PDF hosting
- The open-source community for inspiration

---

**Built with ❤️ using Vanilla JavaScript and Firebase**