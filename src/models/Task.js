import { Schema } from "mongoose";
import mongoClient from '../config/db.js';

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 4,
    maxLength: 100
  },
  description: {
    type: String,
    required: false,
    default: '',
    trim: true,
    maxLength: 255
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: null,
    trim: true,
    lowercase: true
  },
  state: {
    type: String,
    enum: ['active', 'deleted', 'completed', 'archived', 'pending', 'in_progress', 'blocked'],
    default: 'active',
    trim: true,
    lowercase: true
  },
  deletedAt: {
    type: Date,
    default: null,
    get: (date) => date?.toLocaleDateString("es-AR")
  },
  finishedAt: {
    type: Date,
    default: null,
    get: (date) => date?.toLocaleDateString("es-AR")
  },
  createdAt: {
    type: Date,
    get: (date) => date?.toLocaleDateString("es-AR")
  },
  updatedAt: {
    type: Date,
    get: (date) => date?.toLocaleDateString("es-AR")
  }
},
{ 
  collection: 'tasks', 
  timestamps: true, 
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }, 
  toObject: { getters: true }
});

export const Task = mongoClient.model('Task', taskSchema);
