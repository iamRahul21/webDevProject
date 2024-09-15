import dotenv from 'dotenv';
import express from 'express';
import sgMail from '@sendgrid/mail';
import cors from 'cors';

// Initialize dotenv
dotenv.config();

const app = express();
const PORT = 3001;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { to, subject, content } = req.body;

    const msg = {
        to,
        from: 'ae22b049@smail.iitm.ac.in',
        subject,
        text: content,
        html: `<p>${content}</p>` 
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
        res.status(200).send('Email sent');
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error.message);
        res.status(500).send('Failed to send email');
    }
});

app.listen(PORT, () => {
    console.log(`Email service running on port ${PORT}`);
});
