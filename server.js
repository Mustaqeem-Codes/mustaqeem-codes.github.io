// 1. IMPORT THE TOOLS WE NEED
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Loads environment variables from .env file

// 2. CREATE THE APP AND MIDDLEWARE
const app = express();

// Enable CORS - Use this more permissive setup for LOCAL TESTING
app.use(cors({
    origin: '*', // Allows requests from ANY origin during development
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Lets the server understand JSON data sent from the frontend

// Serve static files (HTML, CSS, JS) from the current directory
const path = require('path');
app.use(express.static(path.join(__dirname)));

// Handle preflight requests
app.options('*', cors());

// 3. CONFIGURE EMAIL TRANSPORTER (The Gmail Mailman)
// We use environment variables to keep our email and password secure
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail's service
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env file
        pass: process.env.EMAIL_PASS  // Your Gmail App Password from .env file
    }
});

// 4. DEFINE THE API ROUTE
// This is the mailbox where your frontend will send the form data
app.post('/send', async (req, res) => {
    // 4a. Get the data from the frontend request
    const { name, email, phone, subject, message } = req.body;

    // 4b. Basic validation - Check if the essential data is present
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // 4c. Configure the email itself
    const mailOptions = {
        from: email, // Sender's email address (the person filling the form)
        to: process.env.EMAIL_USER, // Your personal Gmail address (the receiver)
        subject: `New Contact Form: ${subject}`, // Email subject
        // The body of the email. We use HTML for better formatting.
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        // 4d. Send the email!
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        // 4e. Send a success response back to the frontend
        res.status(200).json({ message: 'Email sent successfully!' });

    } catch (error) {
        // 4f. If something went wrong, send an error response
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// 5. START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});