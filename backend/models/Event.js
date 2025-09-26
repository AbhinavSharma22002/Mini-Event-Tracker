const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  dateTime: { type: Date, required: true },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  shareId: { type: String, default: null }, // public share token when enabled
  shareEnabled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
