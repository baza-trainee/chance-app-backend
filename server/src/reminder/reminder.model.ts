const obj = {
  _id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  medicationName: {
    type: String,
    trim: true,
  },
  dosage: {
    type: String,
    required: true,
    trim: true,
  },
  days: {
    type: [String],
    required: true,
    enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  times: {
    type: [[Date]], // Nested array to store multiple times per day
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
};
