// File: backend/utils/emailTemplates.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Renders an HTML email template with provided data
 * @param {string} templateName - Name of the template file (without .html extension)
 * @param {object} data - Object containing key-value pairs for template replacement
 * @returns {string} - Rendered HTML content
 */
export const renderEmailTemplate = (templateName, data = {}) => {
  try {
    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      `${templateName}.html`,
    )
    let htmlContent = fs.readFileSync(templatePath, 'utf-8')

    // Replace placeholders with actual data
    Object.keys(data).forEach((key) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g')
      htmlContent = htmlContent.replace(placeholder, data[key] || 'N/A')
    })

    return htmlContent
  } catch (error) {
    console.error('Error rendering email template:', error)
    return '<h1>Error loading email template</h1>'
  }
}

/**
 * --- ADD THIS NEW FUNCTION ---
 * Prepares the data object for the candidate details email template.
 * @param {object} request - The full request info object from the database.
 * @param {object} candidate - The full candidate object from the database.
 * @returns {object} The data object ready for the HTML template.
 */
export const prepareCandidateDetailsForRequester = (request, candidate) => {
  return {
      REQUESTER_NAME: request.contactPerson,
      CANDIDATE_NAME: candidate.name,
      CANDIDATE_ROLE: candidate.role,
      CANDIDATE_EXP: candidate.exp,
      CANDIDATE_SKILLS: candidate.skills,
      CANDIDATE_LOCATION: candidate.location,
      CANDIDATE_EMAIL: candidate.email,
      CANDIDATE_PHONE: candidate.phone,
      CURRENT_YEAR: new Date().getFullYear(),
  };
};
// --- END OF NEW FUNCTION ---

/**
 * Gets current timestamp in a readable format
 * @returns {string} - Formatted date and time
 */
export const getCurrentTimestamp = () => {
  return new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  })
}

/**
 * Gets current date in a readable format
 * @returns {string} - Formatted date
 */
export const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Extracts IP address from request object
 * @param {object} req - Express request object
 * @returns {string} - Client IP address
 */
export const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    'Unknown'
  )
}

/**
 * Extracts User Agent from request object
 * @param {object} req - Express request object
 * @returns {string} - User Agent string (truncated if too long)
 */
export const getUserAgent = (req) => {
  const userAgent = req.headers['user-agent'] || 'Unknown'
  // Truncate if too long for email display
  return userAgent.length > 100 ? userAgent.substring(0, 97) + '...' : userAgent
}

/**
 * Prepares data for successful login email template
 * @param {object} req - Express request object
 * @param {string} adminEmail - Admin email address
 * @returns {object} - Template data object
 */
export const prepareSuccessLoginData = (req, adminEmail, role) => {
  return {
    USER: role,
    ADMIN_EMAIL: adminEmail,
    LOGIN_TIME: getCurrentTimestamp(),
    IP_ADDRESS: getClientIP(req),
    USER_AGENT: getUserAgent(req),
    CURRENT_DATE: getCurrentDate(),
  }
}

/**
 * Prepares data for failed login email template
 * @param {object} req - Express request object
 * @param {string} attemptedEmail - Email that was attempted
 * @returns {object} - Template data object
 */
export const prepareFailedLoginData = (req, attemptedEmail, role) => {
  return {
    USER: role,
    ATTEMPTED_EMAIL: attemptedEmail,
    ATTEMPT_TIME: getCurrentTimestamp(),
    IP_ADDRESS: getClientIP(req),
    USER_AGENT: getUserAgent(req),
    CURRENT_DATE: getCurrentDate(),
  }
}

export const prepareOtpData = (req, otp, username, validMin) => {
  return {
    OTP_CODE: otp,
    USER_NAME: username,
    VALIDITY_MINUTES: validMin,
    USER_AGENT: getUserAgent(req),
    CURRENT_DATE: getCurrentDate(),
  }
}

export const prepareForSuccessfulPasswordChange = (req, username, login) => {
  return {
    USER_NAME: username,
    IP_ADDRESS: getClientIP(req),
    USER_AGENT: getUserAgent(req),
    LOGIN_URL: login,
    CURRENT_DATE: getCurrentDate(),
  }
}

export const prepareCandidateEnrollForAdmin = (userDetails) => {
  return {
    NAME: userDetails.name,
    EMAIL: userDetails.email,
    PHONE: userDetails.contact,
    LOCATION: userDetails.location,
    CURRENT_DATE: getCurrentDate(),
  }
}

export const prepareStudentAcknowledgment = (name) => {
  return {
    NAME: name,
    CURRENT_DATE: getCurrentDate(),
  }
}