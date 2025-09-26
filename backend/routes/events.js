const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const generateShareId = require('../utils/generateShareId');

// Create event
// POST /api/events
router.post('/', auth, async (req, res) => {
  const { title, dateTime, location, description, shareEnabled } = req.body;
  if (!title || !dateTime) return res.status(400).json({ message: 'title and dateTime required' });
  try {
    const newEvent = new Event({
      userId: req.user.id,
      title,
      dateTime,
      location,
      description,
      shareEnabled: !!shareEnabled,
      shareId: shareEnabled ? generateShareId() : null
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events for user, with optional filter upcoming/past
// GET /api/events?filter=upcoming|past
router.get('/', auth, async (req, res) => {
  const filter = req.query.filter;
  try {
    let events = await Event.find({ userId: req.user.id }).sort({ dateTime: 1 });
    const now = new Date();
    if (filter === 'upcoming') events = events.filter(e => new Date(e.dateTime) > now);
    if (filter === 'past') events = events.filter(e => new Date(e.dateTime) < now);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event by id (owner) - for editing/viewing
// GET /api/events/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (ev.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event (owner)
// PUT /api/events/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (ev.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const { title, dateTime, location, description, shareEnabled } = req.body;

    ev.title = title ?? ev.title;
    ev.dateTime = dateTime ?? ev.dateTime;
    ev.location = location ?? ev.location;
    ev.description = description ?? ev.description;

    if (typeof shareEnabled === 'boolean') {
      ev.shareEnabled = shareEnabled;
      if (shareEnabled && !ev.shareId) ev.shareId = generateShareId();
      if (!shareEnabled) ev.shareId = null;
    }

    await ev.save();
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event (owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (ev.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await ev.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public share view by shareId
// GET /api/events/share/:shareId
router.get('/share/public/:shareId', async (req, res) => {
  try {
    const ev = await Event.findOne({ shareId: req.params.shareId, shareEnabled: true }).select('-__v -userId');
    if (!ev) return res.status(404).json({ message: 'Public event not found' });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
