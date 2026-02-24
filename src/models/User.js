import { Schema } from "mongoose";
import mongoClient from "../config/db.js";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: 4,
    maxLength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    // match: [/^((?=(.*\d){1}))((?=(.*[a-z]){1}))((?=(.*[A-Z]){1}))((?=(.*[\W_]){1}))(.{6,20})$/, 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character']
  }
}, {
  collection: 'users',
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  },
  toObject: { getters: true }
});

export const User = mongoClient.model('User', userSchema);
