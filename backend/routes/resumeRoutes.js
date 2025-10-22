// File: backend/routes/resumeRoutes.js

import express from 'express'
import multer from 'multer'
import { cloudinary, resumeStorage } from '../config/cloudinary.js'
import docxParser from 'docx-parser'
import ResumeAnalysis from '../models/ResumeAnalysis.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pdfParseModule = require('pdf-parse')

const pdf = pdfParseModule.default || pdfParseModule

const router = express.Router()

// Enhanced ATS-Friendly Format Detection Patterns
const ATS_FRIENDLY_PATTERNS = {
  CLEAN_FORMATTING: /^(?!.*\b(column|table|header|footer|text\-box)\b).*$/i,
  STANDARD_FONTS: /(arial|times|calibri|georgia|helvetica|verdana)/i,
  PROPER_HEADINGS:
    /(experience|education|skills|summary|work\s*history|professional)/i,
  NO_GRAPHICS: /^(?!.*\b(chart|graph|image|logo)\b).*$/i,
}

// Comprehensive Skills Database
const SKILLS_DATABASE = {
  HARD_SKILLS: {
    technical: [
      'javascript',
      'python',
      'java',
      'html',
      'css',
      'react',
      'angular',
      'vue',
      'node.js',
      'express',
      'django',
      'flask',
      'spring',
      'sql',
      'mysql',
      'postgresql',
      'mongodb',
      'aws',
      'azure',
      'gcp',
      'docker',
      'kubernetes',
      'jenkins',
      'git',
      'github',
      'gitlab',
      'typescript',
      'php',
      'c++',
      'c#',
      'ruby',
      'go',
      'swift',
      'kotlin',
      'rust',
      'rest api',
      'graphql',
      'microservices',
      'ci/cd',
      'devops',
      'agile',
      'scrum',
    ],
    business: [
      'financial analysis',
      'budgeting',
      'forecasting',
      'market research',
      'data analysis',
      'project management',
      'risk management',
      'strategic planning',
      'business development',
      'sales',
      'marketing',
      'digital marketing',
      'seo',
      'sem',
      'social media',
      'content marketing',
      'accounting',
      'quickbooks',
      'excel',
      'powerpoint',
      'word',
      'outlook',
    ],
    healthcare: [
      'patient care',
      'medical terminology',
      'emr',
      'ehr',
      'hipaa',
      'clinical',
      'phlebotomy',
      'cpr',
      'bls',
      'acls',
      'nursing',
      'medical coding',
      'icd-10',
      'healthcare',
      'vitals',
    ],
    creative: [
      'photoshop',
      'illustrator',
      'indesign',
      'figma',
      'sketch',
      'adobe xd',
      'ui/ux',
      'graphic design',
      'web design',
      'motion graphics',
      'video editing',
      'premiere pro',
      'after effects',
      'final cut pro',
      'blender',
      'maya',
    ],
  },
  SOFT_SKILLS: [
    'communication',
    'leadership',
    'teamwork',
    'collaboration',
    'problem solving',
    'critical thinking',
    'adaptability',
    'time management',
    'organization',
    'creativity',
    'innovation',
    'work ethic',
    'emotional intelligence',
    'conflict resolution',
    'negotiation',
    'presentation',
    'public speaking',
    'analytical',
    'strategic',
    'decision making',
    'mentoring',
    'coaching',
    'training',
  ],
}

// Enhanced ATS Format Scoring Weights
const SCORING_WEIGHTS = {
  FORMATTING: 0.25,
  HARD_SKILLS: 0.3,
  SOFT_SKILLS: 0.2,
  STRUCTURE: 0.15,
  CONTENT_QUALITY: 0.1,
}

// Industry-specific skill priorities
const INDUSTRY_SKILL_PRIORITIES = {
  technology: {
    hard: [
      'javascript',
      'python',
      'react',
      'node.js',
      'sql',
      'aws',
      'git',
      'docker',
    ],
    soft: ['problem solving', 'communication', 'teamwork', 'adaptability'],
  },
  business: {
    hard: [
      'project management',
      'excel',
      'financial analysis',
      'marketing',
      'sales',
    ],
    soft: ['leadership', 'communication', 'strategic', 'decision making'],
  },
  healthcare: {
    hard: ['patient care', 'medical terminology', 'emr', 'cpr', 'clinical'],
    soft: ['communication', 'empathy', 'teamwork', 'attention to detail'],
  },
  education: {
    hard: [
      'curriculum development',
      'lesson planning',
      'classroom management',
      'educational technology',
    ],
    soft: ['communication', 'patience', 'leadership', 'creativity'],
  },
  general: {
    hard: [
      'microsoft office',
      'communication',
      'organization',
      'project management',
    ],
    soft: ['teamwork', 'problem solving', 'adaptability', 'time management'],
  },
}

// Enhanced ATS Format Detection with realistic scoring
const detectATSFormatCompatibility = (text, extractedData) => {
  let formatScore = 0
  const formatIssues = []
  const formatStrengths = []

  // 1. Check for clean formatting (no columns/tables) - 25 points
  const hasComplexFormatting = text.match(
    /column|table|text\-box|header|footer/i,
  )
  if (!hasComplexFormatting) {
    formatScore += 20 + Math.random() * 5 // 20-25 points
    formatStrengths.push('Clean, ATS-friendly formatting')
  } else {
    formatScore += 10 + Math.random() * 5 // 10-15 points
    formatIssues.push('Avoid columns/tables - use simple formatting')
  }

  // 2. Check section structure - 30 points
  const expectedSections = ['experience', 'education', 'skills', 'summary']
  const foundSections = expectedSections.filter((section) =>
    text.toLowerCase().includes(section),
  )

  const sectionCoverage = foundSections.length / expectedSections.length
  const sectionScore = sectionCoverage * 25 + Math.random() * 5 // Realistic variation
  formatScore += sectionScore

  if (foundSections.length >= 3) {
    formatStrengths.push('Well-structured with key sections')
  } else {
    formatIssues.push(
      `Add missing sections: ${expectedSections
        .filter((s) => !foundSections.includes(s))
        .join(', ')}`,
    )
  }

  // 3. Check for proper headings - 20 points
  const hasStandardHeadings =
    /(experience|education|skills|work history|professional)/i.test(text)
  if (hasStandardHeadings) {
    formatScore += 15 + Math.random() * 5 // 15-20 points
    formatStrengths.push('Standard section headings used')
  } else {
    formatScore += 8 + Math.random() * 4 // 8-12 points
    formatIssues.push(
      'Use standard section headings (Experience, Education, Skills)',
    )
  }

  // 4. Check length appropriateness - 15 points
  const wordCount = text.split(/\s+/).length
  if (wordCount >= 300 && wordCount <= 800) {
    formatScore += 12 + Math.random() * 3 // 12-15 points
    formatStrengths.push('Appropriate resume length')
  } else if (wordCount < 300) {
    formatScore += 5 + Math.random() * 3 // 5-8 points
    formatIssues.push('Resume may be too short - add more content')
  } else {
    formatScore += 8 + Math.random() * 3 // 8-11 points
    formatIssues.push('Consider shortening resume to 2 pages maximum')
  }

  // 5. Check contact information formatting - 10 points
  const contactInfoScore =
    (extractedData.email ? 3 : 0) +
    (extractedData.phone ? 3 : 0) +
    (extractedData.name ? 2 : 0)
  formatScore += contactInfoScore + Math.random() * 2 // Add small variation

  if (contactInfoScore >= 8) {
    formatStrengths.push('Proper contact information format')
  }

  return {
    score: Math.min(95, Math.max(40, Math.round(formatScore))), // Realistic range
    issues: formatIssues,
    strengths: formatStrengths,
  }
}

// Enhanced Skills Detection with realistic scoring
const detectSkillsWithContext = (text, industry = 'general') => {
  const lowerText = text.toLowerCase()
  const industryPriority =
    INDUSTRY_SKILL_PRIORITIES[industry] || INDUSTRY_SKILL_PRIORITIES.general

  const foundHardSkills = []
  const foundSoftSkills = []

  let hardSkillsScore = 0
  let softSkillsScore = 0

  // Detect hard skills with industry weighting
  Object.values(SKILLS_DATABASE.HARD_SKILLS)
    .flat()
    .forEach((skill) => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundHardSkills.push(skill)
        const isPriority = industryPriority.hard.includes(skill.toLowerCase())
        hardSkillsScore += isPriority ? 3 : 1
      }
    })

  // Detect soft skills
  SKILLS_DATABASE.SOFT_SKILLS.forEach((skill) => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSoftSkills.push(skill)
      const isPriority = industryPriority.soft.includes(skill.toLowerCase())
      softSkillsScore += isPriority ? 2 : 1
    }
  })

  // Calculate scores with realistic ranges
  const maxHardSkills = industryPriority.hard.length * 3
  const maxSoftSkills = industryPriority.soft.length * 2

  let normalizedHardScore = Math.min(
    95,
    (hardSkillsScore / Math.max(1, maxHardSkills)) * 100,
  )
  let normalizedSoftScore = Math.min(
    95,
    (softSkillsScore / Math.max(1, maxSoftSkills)) * 100,
  )

  // Add realistic variation
  normalizedHardScore = Math.max(
    45,
    normalizedHardScore + (Math.random() * 10 - 5),
  )
  normalizedSoftScore = Math.max(
    45,
    normalizedSoftScore + (Math.random() * 10 - 5),
  )

  return {
    hardSkills: {
      score: Math.round(normalizedHardScore),
      found: [...new Set(foundHardSkills)].slice(0, 20),
      missing: industryPriority.hard
        .filter(
          (skill) =>
            !foundHardSkills.map((s) => s.toLowerCase()).includes(skill),
        )
        .slice(0, 10),
    },
    softSkills: {
      score: Math.round(normalizedSoftScore),
      found: [...new Set(foundSoftSkills)].slice(0, 15),
      missing: industryPriority.soft
        .filter(
          (skill) =>
            !foundSoftSkills.map((s) => s.toLowerCase()).includes(skill),
        )
        .slice(0, 8),
    },
  }
}

// Enhanced Structure Analysis with realistic scoring
const analyzeResumeStructure = (text, extractedData) => {
  let structureScore = 0
  const structureIssues = []
  const structureStrengths = []

  // 1. Contact Information completeness - 25 points
  const hasEmail = !!extractedData.email
  const hasPhone = !!extractedData.phone
  const hasName = !!extractedData.name

  const contactScore =
    (hasEmail ? 8 : 0) + (hasPhone ? 8 : 0) + (hasName ? 5 : 0)
  structureScore += contactScore + Math.random() * 4 // Add variation

  if (contactScore >= 20) {
    structureStrengths.push('Complete contact information')
  } else {
    structureIssues.push(
      'Ensure complete contact information (name, email, phone)',
    )
  }

  // 2. Experience section quality - 30 points
  const hasExperience = text.match(/experience|work history|employment/i)
  const hasMultiplePositions =
    (text.match(/company|corporation|inc|llc/g) || []).length >= 2

  if (hasExperience && hasMultiplePositions) {
    structureScore += 25 + Math.random() * 5 // 25-30 points
    structureStrengths.push('Strong experience section with multiple positions')
  } else if (hasExperience) {
    structureScore += 15 + Math.random() * 5 // 15-20 points
    structureIssues.push('Add more detailed experience with company names')
  } else {
    structureScore += 5 + Math.random() * 5 // 5-10 points
    structureIssues.push('Include a dedicated experience section')
  }

  // 3. Education section - 20 points
  const hasEducation = text.match(/education|university|college|degree/i)
  if (hasEducation) {
    structureScore += 15 + Math.random() * 5 // 15-20 points
    structureStrengths.push('Education section present')
  } else {
    structureScore += 5 + Math.random() * 5 // 5-10 points
    structureIssues.push('Add education section')
  }

  // 4. Skills section - 15 points
  const hasSkills = text.match(/skills|technical|competencies/i)
  if (hasSkills) {
    structureScore += 12 + Math.random() * 3 // 12-15 points
    structureStrengths.push('Skills section properly defined')
  } else {
    structureScore += 5 + Math.random() * 3 // 5-8 points
    structureIssues.push('Include a dedicated skills section')
  }

  // 5. Action verbs and achievements - 10 points
  const actionVerbs = [
    'managed',
    'developed',
    'created',
    'implemented',
    'led',
    'improved',
    'increased',
    'reduced',
    'achieved',
    'delivered',
    'transformed',
  ]
  const actionVerbCount = actionVerbs.filter((verb) =>
    text.includes(verb),
  ).length
  structureScore += Math.min(8, actionVerbCount * 1.5) + Math.random() * 2

  if (actionVerbCount >= 5) {
    structureStrengths.push('Strong use of action verbs')
  } else {
    structureIssues.push('Use more action verbs to describe achievements')
  }

  return {
    score: Math.min(95, Math.max(40, Math.round(structureScore))),
    issues: structureIssues,
    strengths: structureStrengths,
  }
}

// Enhanced Content Quality Analysis with realistic scoring
const analyzeContentQuality = (text, extractedData) => {
  let contentScore = 55 // Lower base score for realism

  // 1. Word count optimization - 20 points
  const wordCount = text.split(/\s+/).length
  if (wordCount >= 400 && wordCount <= 700) {
    contentScore += 15 + Math.random() * 5 // 15-20 points
  } else if (wordCount >= 300 && wordCount <= 800) {
    contentScore += 10 + Math.random() * 5 // 10-15 points
  } else {
    contentScore += 5 + Math.random() * 5 // 5-10 points
  }

  // 2. Achievement indicators - 15 points
  const achievementIndicators = [
    'increased',
    'decreased',
    'improved',
    'reduced',
    'achieved',
    'delivered',
    'saved',
    'generated',
    'developed',
    'created',
    'implemented',
  ]
  const achievementCount = achievementIndicators.filter((indicator) =>
    text.includes(indicator),
  ).length
  contentScore += Math.min(12, achievementCount * 1.5) + Math.random() * 3

  // 3. Quantifiable results - 10 points
  const hasNumbers =
    /\d+%|\$\d+|\d+\s*(years|months)|increased by|decreased by/i.test(text)
  if (hasNumbers) {
    contentScore += 8 + Math.random() * 2 // 8-10 points
  } else {
    contentScore += 3 + Math.random() * 2 // 3-5 points
  }

  return Math.max(45, Math.min(90, Math.round(contentScore)))
}

// Enhanced Grading System
const getGradeFromScore = (score) => {
  if (score >= 85) return { grade: 'A', label: 'Excellent', color: '#10b981' }
  if (score >= 80) return { grade: 'A-', label: 'Very Good', color: '#34d399' }
  if (score >= 75) return { grade: 'B+', label: 'Good', color: '#60a5fa' }
  if (score >= 70)
    return { grade: 'B', label: 'Above Average', color: '#3b82f6' }
  if (score >= 67) return { grade: 'B-', label: 'Average', color: '#8b5cf6' }
  if (score >= 63)
    return { grade: 'C+', label: 'Below Average', color: '#f59e0b' }
  if (score >= 60)
    return { grade: 'C', label: 'Needs Improvement', color: '#f97316' }
  return { grade: 'D', label: 'Poor', color: '#ef4444' }
}

// Enhanced Main Scoring Algorithm (67-90% range)
const calculateRealisticScore = (analysisData) => {
  const {
    formatAnalysis,
    skillsAnalysis,
    structureAnalysis,
    contentQuality,
    industry,
  } = analysisData

  // Calculate weighted total with realistic base
  let totalScore = 0

  totalScore += formatAnalysis.score * SCORING_WEIGHTS.FORMATTING
  totalScore += skillsAnalysis.hardSkills.score * SCORING_WEIGHTS.HARD_SKILLS
  totalScore += skillsAnalysis.softSkills.score * SCORING_WEIGHTS.SOFT_SKILLS
  totalScore += structureAnalysis.score * SCORING_WEIGHTS.STRUCTURE
  totalScore += contentQuality * SCORING_WEIGHTS.CONTENT_QUALITY

  // Industry adjustment (smaller impact)
  const industryMultiplier =
    industry === 'technology' ? 1.02 : industry === 'business' ? 1.01 : 1.0
  totalScore *= industryMultiplier

  // Add natural variance for realism (67-90 range)
  const baseVariance = Math.random() * 8 - 4 // ±4 points
  const qualityVariance = contentQuality > 70 ? 2 : -2 // Content quality bonus/penalty

  totalScore += baseVariance + qualityVariance

  // Ensure score stays in 67-90 range (95% of cases)
  let finalScore = Math.max(67, Math.min(90, Math.round(totalScore)))

  // 5% chance for scores outside this range for authenticity
  if (Math.random() < 0.05) {
    if (Math.random() < 0.5) {
      finalScore = Math.min(95, finalScore + 5) // 5% chance for 91-95
    } else {
      finalScore = Math.max(60, finalScore - 7) // 5% chance for 60-66
    }
  }

  return finalScore
}

// Enhanced Resume Analysis
const analyzeResumeComprehensive = (resumeText) => {
  const text = resumeText.toLowerCase()
  const originalText = resumeText

  const extractedData = {
    name: null,
    email: null,
    phone: null,
    location: null,
    linkedin: null,
    summary: null,
    sections: [],
    education: [],
    experience: [],
    skills: {
      technical: [],
      soft: [],
      tools: [],
    },
    yearsOfExperience: null,
    educationLevel: null,
    actionVerbsCount: 0,
    quantifiableAchievements: 0,
    wordCount: 0,
  }

  const recommendations = []

  // Basic extraction
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w{2,4}/)
  extractedData.email = emailMatch ? emailMatch[0] : null

  const phoneMatch = text.match(
    /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\s-]{7,10}/,
  )
  extractedData.phone = phoneMatch ? phoneMatch[0].trim() : null

  const lines = originalText
    .split('\n')
    .filter((line) => line.trim().length > 2)
  if (lines.length > 0) {
    extractedData.name = lines[0].trim()
  }

  // Industry detection
  const industryTerms = {
    technology: [
      'software',
      'developer',
      'engineer',
      'programming',
      'code',
      'technical',
      'it',
    ],
    business: [
      'business',
      'management',
      'administrative',
      'office',
      'corporate',
      'finance',
      'marketing',
    ],
    healthcare: [
      'medical',
      'health',
      'patient',
      'clinical',
      'hospital',
      'nursing',
      'healthcare',
    ],
    education: [
      'teacher',
      'education',
      'student',
      'learning',
      'academic',
      'curriculum',
    ],
  }

  let detectedIndustry = 'general'
  let maxIndustryMatches = 0

  Object.entries(industryTerms).forEach(([industry, terms]) => {
    const matches = terms.filter((term) => text.includes(term)).length
    if (matches > maxIndustryMatches) {
      maxIndustryMatches = matches
      detectedIndustry = industry
    }
  })

  // Job level detection
  const seniorTerms = [
    'senior',
    'lead',
    'principal',
    'manager',
    'director',
    'head',
  ]
  const entryTerms = ['entry', 'junior', 'graduate', 'assistant', 'intern']

  let jobLevel = 'mid'
  if (seniorTerms.some((term) => text.includes(term))) {
    jobLevel = 'senior'
  } else if (entryTerms.some((term) => text.includes(term))) {
    jobLevel = 'entry'
  }

  // Comprehensive analysis
  const formatAnalysis = detectATSFormatCompatibility(text, extractedData)
  const skillsAnalysis = detectSkillsWithContext(text, detectedIndustry)
  const structureAnalysis = analyzeResumeStructure(text, extractedData)
  const contentQuality = analyzeContentQuality(text, extractedData)

  // Generate recommendations
  formatAnalysis.issues.forEach((issue) => {
    recommendations.push({
      category: 'formatting',
      priority: 'high',
      message: issue,
      suggestion: 'Use simple, ATS-friendly formatting with standard sections',
    })
  })

  skillsAnalysis.hardSkills.missing.slice(0, 3).forEach((skill) => {
    recommendations.push({
      category: 'skills',
      priority: 'medium',
      message: `Missing key hard skill: ${skill}`,
      suggestion: `Consider adding ${skill} to your skills section`,
    })
  })

  skillsAnalysis.softSkills.missing.slice(0, 2).forEach((skill) => {
    recommendations.push({
      category: 'skills',
      priority: 'low',
      message: `Could emphasize soft skill: ${skill}`,
      suggestion: `Demonstrate ${skill} in your experience descriptions`,
    })
  })

  structureAnalysis.issues.forEach((issue) => {
    recommendations.push({
      category: 'structure',
      priority: 'medium',
      message: issue,
      suggestion: 'Follow standard resume structure with clear sections',
    })
  })

  // Calculate final score
  const analysisData = {
    formatAnalysis,
    skillsAnalysis,
    structureAnalysis,
    contentQuality,
    industry: detectedIndustry,
  }

  const finalScore = calculateRealisticScore(analysisData)
  const gradeInfo = getGradeFromScore(finalScore)

  // Prepare response
  return {
    atsScore: finalScore,
    overallScore: finalScore,
    grade: gradeInfo.grade,
    gradeLabel: gradeInfo.label,
    gradeColor: gradeInfo.color,
    sectionScores: {
      formatting: formatAnalysis.score,
      hardSkills: skillsAnalysis.hardSkills.score,
      softSkills: skillsAnalysis.softSkills.score,
      structure: structureAnalysis.score,
      contentQuality: contentQuality,
    },
    keywordsFound: skillsAnalysis.hardSkills.found,
    keywordsMissing: skillsAnalysis.hardSkills.missing,
    softSkillsFound: skillsAnalysis.softSkills.found,
    softSkillsMissing: skillsAnalysis.softSkills.missing,
    extractedData,
    recommendations: recommendations.slice(0, 6),
    industry: detectedIndustry,
    jobLevel,
    formatStrengths: formatAnalysis.strengths,
    structureStrengths: structureAnalysis.strengths,
  }
}

// Enhanced upload configuration with better validation
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '.docx',
}

const validateFileType = (file) => {
  // Check MIME type
  if (!ALLOWED_FILE_TYPES[file.mimetype]) {
    return {
      isValid: false,
      error: `Invalid file type. Only PDF and DOCX files are allowed. Received: ${file.mimetype}`,
    }
  }

  // Check file extension
  const extension = file.originalname.toLowerCase().split('.').pop()
  const expectedExtension = ALLOWED_FILE_TYPES[file.mimetype].substring(1)
  if (extension !== expectedExtension) {
    return {
      isValid: false,
      error: `File extension does not match the file type. Expected ${expectedExtension} but received ${extension}`,
    }
  }

  return { isValid: true }
}

const upload = multer({
  storage: resumeStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Only allow one file
  },
  fileFilter: (req, file, cb) => {
    const validation = validateFileType(file)
    if (validation.isValid) {
      cb(null, true)
    } else {
      cb(new Error(validation.error), false)
    }
  },
}).single('resumeFile')

router.post('/analyze', (req, res) => {
  console.log('📄 Resume upload request received')

  upload(req, res, async (err) => {
    if (err) {
      console.error('❌ Multer/Upload Error:', err)
      const errorMessage =
        err && err.message ? err.message : 'File upload error'
      let message = errorMessage
      let statusCode = 400

      // Enhanced error messages
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = `File size exceeds the limit of ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB`
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message =
          'No file field found. Please upload a file with field name "resumeFile"'
      } else if (
        errorMessage.includes('format') ||
        errorMessage.includes('file type')
      ) {
        message = errorMessage // Use the detailed error from validateFileType
      }

      return res.status(statusCode).json({
        success: false,
        message,
        code: err.code || 'UPLOAD_ERROR',
      })
    }

    if (!req.file) {
      console.error('❌ No file uploaded')
      return res.status(400).json({ message: 'No resume file was uploaded.' })
    }

    const startTime = Date.now()

    try {
      let extractedText = ''

      console.log('⬇️ Downloading file from Cloudinary...')
      // Add retry mechanism for Cloudinary fetch
      let response
      let retryCount = 0
      const maxRetries = 3
      const baseDelay = 1000 // Start with 1 second delay

      while (retryCount < maxRetries) {
        try {
          response = await fetch(req.file.path)
          if (response.ok) break

          // If response is not ok, prepare for retry
          console.log(
            `Attempt ${retryCount + 1}/${maxRetries} failed with status: ${
              response.status
            }`,
          )
          retryCount++

          if (retryCount === maxRetries) {
            throw new Error(
              `Failed to fetch file from Cloudinary after ${maxRetries} attempts: ${response.statusText}`,
            )
          }

          // Exponential backoff
          const delay = baseDelay * Math.pow(2, retryCount - 1)
          await new Promise((resolve) => setTimeout(resolve, delay))
        } catch (fetchError) {
          if (retryCount === maxRetries) throw fetchError
          retryCount++
          const delay = baseDelay * Math.pow(2, retryCount - 1)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }

      const fileBuffer = Buffer.from(await response.arrayBuffer())
      console.log(
        '✅ File downloaded, buffer size:',
        fileBuffer.length,
        'bytes',
      )

      // Parse based on file type
      if (
        req.file.mimetype === 'application/pdf' ||
        req.file.path.endsWith('.pdf')
      ) {
        console.log('📑 Parsing PDF...')

        try {
          let data
          if (typeof pdf === 'function') {
            data = await pdf(fileBuffer)
          } else if (pdf && typeof pdf.default === 'function') {
            data = await pdf.default(fileBuffer)
          } else if (pdfParseModule && typeof pdfParseModule === 'function') {
            data = await pdfParseModule(fileBuffer)
          } else {
            throw new Error('pdf-parse function not found')
          }

          extractedText = data.text
          console.log('✅ PDF parsed successfully')
        } catch (pdfError) {
          console.error('❌ PDF parsing error:', pdfError)
          throw new Error(`PDF parsing failed: ${pdfError.message}`)
        }
      } else if (
        req.file.mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        req.file.path.endsWith('.docx')
      ) {
        console.log('📝 Parsing DOCX...')

        try {
          const result = await docxParser.parseDocx(fileBuffer)
          extractedText = result
          console.log('✅ DOCX parsed successfully')
        } catch (docxError) {
          console.error('❌ DOCX parsing error:', docxError)
          throw new Error(`DOCX parsing failed: ${docxError.message}`)
        }
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error(
          'No text could be extracted. The file might be corrupted, password-protected, or contain only images.',
        )
      }

      // Enhanced comprehensive analysis
      console.log('🔍 Performing realistic ATS resume analysis...')
      const analysisResult = analyzeResumeComprehensive(extractedText)
      const analysisDuration = Date.now() - startTime

      // Save to database
      const resumeAnalysis = new ResumeAnalysis({
        originalFilename: req.file.originalname,
        serverPath: req.file.path,
        atsScore: analysisResult.atsScore,
        overallScore: analysisResult.overallScore,
        grade: analysisResult.grade,
        gradeLabel: analysisResult.gradeLabel,
        sectionScores: analysisResult.sectionScores,
        keywordsFound: analysisResult.keywordsFound,
        keywordsMissing: analysisResult.keywordsMissing,
        softSkillsFound: analysisResult.softSkillsFound,
        softSkillsMissing: analysisResult.softSkillsMissing,
        extractedData: analysisResult.extractedData,
        recommendations: analysisResult.recommendations,
        industry: analysisResult.industry,
        jobLevel: analysisResult.jobLevel,
        analysisDuration,
      })

      await resumeAnalysis.save()
      console.log('💾 Realistic ATS analysis saved to database')

      // Send enhanced response
      res.status(200).json({
        success: true,
        atsScore: analysisResult.atsScore,
        overallScore: analysisResult.overallScore,
        grade: analysisResult.grade,
        gradeLabel: analysisResult.gradeLabel,
        gradeColor: analysisResult.gradeColor,
        sectionScores: analysisResult.sectionScores,
        keywordsFound: analysisResult.keywordsFound,
        keywordsMissing: analysisResult.keywordsMissing,
        softSkillsFound: analysisResult.softSkillsFound,
        softSkillsMissing: analysisResult.softSkillsMissing,
        extractedData: analysisResult.extractedData,
        recommendations: analysisResult.recommendations,
        industry: analysisResult.industry,
        jobLevel: analysisResult.jobLevel,
        formatStrengths: analysisResult.formatStrengths,
        structureStrengths: analysisResult.structureStrengths,
        analysisDuration,
        message: 'Realistic ATS resume analysis completed successfully',
      })
    } catch (error) {
      console.error('❌ Critical error during analysis:', error)

      res.status(500).json({
        success: false,
        message:
          error.message || 'Could not parse the uploaded file on the server.',
      })

      // Clean up failed upload
      if (req.file && req.file.filename) {
        console.log('🗑️ Cleaning up failed upload from Cloudinary...')
        cloudinary.uploader
          .destroy(req.file.filename, { resource_type: 'raw' })
          .then(() => console.log('✅ Cleanup complete'))
          .catch((delErr) =>
            console.error('⚠️ Cleanup failed:', delErr.message),
          )
      }
    }
  })
})

// Get analysis history
router.get('/history', async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        'originalFilename atsScore overallScore grade gradeLabel createdAt industry jobLevel',
      )

    res.json({ success: true, analyses })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch analysis history' })
  }
})

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Realistic ATS resume analysis working',
    features: [
      'realistic_scoring_67_90',
      'grading_system',
      'industry_context',
      'enhanced_recommendations',
    ],
  })
})

export default router
