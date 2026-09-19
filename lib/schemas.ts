/**
 * QNexus — Database Schema Definitions & Validation Specifications
 * 
 * Includes Mongoose-compatible schema specifications & TypeScript Types for:
 * 1. ContactInquirySchema
 * 2. JoinApplicationSchema
 * 3. EventRegistrationSchema
 */

export interface IContactInquiry {
  id?: string;
  name: string;
  email: string;
  company: string;
  inquiryType:
    | 'Enterprise Quantum Solutions'
    | 'Research Grants & Fellowships'
    | 'Hardware / QPU Access'
    | 'University Chapter & Hackathons'
    | 'Press & Media Alliances';
  subject: string;
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: Date | string;
}

export interface IJoinApplication {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  position: string;
  expertise:
    | 'quantum-algorithms'
    | 'nisq-error'
    | 'quantum-hardware'
    | 'post-quantum'
    | 'hybrid-hpc'
    | 'quantum-ml'
    | 'student-chapter';
  experience: 'Beginner' | 'Intermediate' | 'Advanced / Fellow';
  country: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date | string;
}

export interface IEventRegistration {
  id?: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone?: string;
  organization: string;
  role: string;
  background: 'Beginner' | 'Intermediate' | 'Advanced';
  teamName?: string;
  status: 'Confirmed' | 'Attended' | 'Cancelled';
  createdAt: Date | string;
}

// Mongoose Schema Definitions Object for easy Mongoose model instantiation
export const MongooseSchemaConfigs = {
  ContactInquiry: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, default: 'N/A', trim: true },
    inquiryType: {
      type: String,
      enum: [
        'Enterprise Quantum Solutions',
        'Research Grants & Fellowships',
        'Hardware / QPU Access',
        'University Chapter & Hackathons',
        'Press & Media Alliances',
      ],
      default: 'Enterprise Quantum Solutions',
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved'],
      default: 'New',
    },
    createdAt: { type: Date, default: Date.now },
  },

  JoinApplication: {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    expertise: {
      type: String,
      enum: [
        'quantum-algorithms',
        'nisq-error',
        'quantum-hardware',
        'post-quantum',
        'hybrid-hpc',
        'quantum-ml',
        'student-chapter',
      ],
      default: 'quantum-algorithms',
    },
    experience: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced / Fellow'],
      default: 'Intermediate',
    },
    country: { type: String, required: true, default: 'India' },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    createdAt: { type: Date, default: Date.now },
  },

  EventRegistration: {
    eventId: { type: String, required: true },
    eventTitle: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    organization: { type: String, default: 'Independent' },
    role: { type: String, default: 'Attendee' },
    background: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    teamName: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Confirmed', 'Attended', 'Cancelled'],
      default: 'Confirmed',
    },
    createdAt: { type: Date, default: Date.now },
  },
};
