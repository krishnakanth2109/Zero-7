// File: backend/models/ResumeAnalysis.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const ResumeAnalysisSchema = new Schema(
  {
    originalFilename: { type: String, required: true },
    serverPath: { type: String, required: true },
    atsScore: { type: Number, required: true },
    overallScore: { type: Number, required: true },
    grade: { type: String, required: true },
    gradeLabel: { type: String, required: true },
    sectionScores: {
      formatting: { type: Number, default: 0 },
      hardSkills: { type: Number, default: 0 },
      softSkills: { type: Number, default: 0 },
      structure: { type: Number, default: 0 },
      contentQuality: { type: Number, default: 0 }
    },
    keywordsFound: [{ type: String }],
    keywordsMissing: [{ type: String }],
    softSkillsFound: [{ type: String }],
    softSkillsMissing: [{ type: String }],
    extractedData: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      location: { type: String },
      linkedin: { type: String },
      summary: { type: String },
      sections: [{ type: String }],
      education: [{
        degree: String,
        institution: String,
        year: String
      }],
      experience: [{
        title: String,
        company: String,
        duration: String,
        description: String
      }],
      skills: {
        technical: [String],
        soft: [String],
        tools: [String]
      },
      yearsOfExperience: { type: Number },
      educationLevel: { type: String },
      actionVerbsCount: { type: Number },
      quantifiableAchievements: { type: Number },
      wordCount: { type: Number }
    },
    recommendations: [{
      category: String,
      priority: { type: String, enum: ['high', 'medium', 'low'] },
      message: String,
      suggestion: String
    }],
    industry: { type: String },
    jobLevel: { type: String, enum: ['entry', 'mid', 'senior', 'executive'] },
    analysisDuration: { type: Number },
    formatStrengths: [{ type: String }],
    structureStrengths: [{ type: String }]
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);