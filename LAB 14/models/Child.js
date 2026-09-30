const mongoose = require('mongoose');

const childSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age must be a non-negative number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'parentId is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Child = mongoose.model('Child', childSchema);

module.exports = Child;
