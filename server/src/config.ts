export default {
    port: process.env.PORT || 3001,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager',
    jwtSecret: process.env.JWT_SECRET || 'jwt_secret',
    // For role-based access (admin emails)
    adminEmails: ['admin@example.com'],

    // SMTP
    emailHost: process.env.EMAIL_HOST || 'smtp.example.com',
    emailPort: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    emailSecure: process.env.EMAIL_SECURE === 'true', // true for port 465, false for others
    emailUser: process.env.EMAIL_USER || 'user@example.com',
    emailPass: process.env.EMAIL_PASS || 'password',
    emailFrom: process.env.EMAIL_FROM || 'no-reply@example.com',
};
