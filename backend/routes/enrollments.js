// File: backend/routes/enrollments.js

import express from 'express';
const router = express.Router();
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/notifications.js'; // <-- Corrected Import
import {
  renderEmailTemplate,
  prepareCandidateEnrollForAdmin,
  prepareStudentAcknowledgment,
} from '../utils/emailTemplates.js';
import transporter from '../utils/mail.js';

// POST a new enrollment
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const emailCheck = await Enrollment.findOne({ email });
    
    if (emailCheck) {
<<<<<<< Updated upstream
      res.send({ message: 'You are Already Enrolled' })
    } else {
      const newEnrollment = new Enrollment({
        name,
        contact,
        email,
        location,
      })
      const savedEnrollment = await newEnrollment.save()
      // const templateData = prepareCandidateEnrollForAdmin(newEnrollment)
      // const htmlContent = renderEmailTemplate('enrollmentAlert', templateData)

      // const mailOptions = {
      //   from: process.env.AUTH_MAIL,
      //   to: process.env.AUTH_MAIL,
      //   subject: 'Candidate Enrollment Form Alert',
      //   html: htmlContent,
      // }
      // await transporter.sendMail(mailOptions)
      // const template = prepareStudentAcknowledgment(newEnrollment.name)
      // const html = renderEmailTemplate(
      //   'enrollmentStudentConfirmation',
      //   template,
      // )
      // const mail = {
      //   from: process.env.AUTH_MAIL,
      //   to: newEnrollment.email,
      //   subject: 'Thank You for Your Response',
      //   html: html,
      // }
      // await transporter.sendMail(mail)
      res.status(201).json(savedEnrollment)
=======
      return res.send({ message: 'You are Already Enrolled' });
>>>>>>> Stashed changes
    }
    
    const newEnrollment = new Enrollment(req.body);
    const savedEnrollment = await newEnrollment.save();
    
    // --- Email Logic ---
    const adminTemplate = prepareCandidateEnrollForAdmin(newEnrollment);
    const adminHtml = renderEmailTemplate('enrollmentAlert', adminTemplate);
    await transporter.sendMail({
      from: process.env.AUTH_MAIL,
      to: process.env.AUTH_MAIL,
      subject: 'Candidate Enrollment Form Alert',
      html: adminHtml,
    });
    
    const studentTemplate = prepareStudentAcknowledgment(name);
    const studentHtml = renderEmailTemplate('enrollmentStudentConfirmation', studentTemplate);
    await transporter.sendMail({
      from: process.env.AUTH_MAIL,
      to: email,
      subject: 'Thank You for Your Response',
      html: studentHtml,
    });
    // --- End Email Logic ---

    // --- ADDED: Notification Logic ---
    const io = req.app.get('io');
    const message = `New enrollment from student: ${name}.`;

    const notification = new Notification({
        title: 'New Enrollment',
        message: message,
        type: 'info',
        link: '/admin/studentenrollment'
    });
    await notification.save();
    
    io.emit('newEnrollment', { message });
    // -------------------------

    res.status(201).json(savedEnrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;