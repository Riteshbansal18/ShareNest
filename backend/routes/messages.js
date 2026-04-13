const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { protect } = require('../middleware/auth');
const { createNotification } = require('../utils/notify');

router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'fullName profileImage lastSeen')
      .sort({ lastMessageAt: -1 });

    const result = conversations.map(conv => {
      const unread = conv.unreadCount.get(req.user._id.toString()) || 0;
      const other = conv.participants.find(p => p._id.toString() !== req.user._id.toString());
      return { _id: conv._id, participant: other, lastMessage: conv.lastMessage, lastMessageAt: conv.lastMessageAt, unread, createdAt: conv.createdAt };
    });

    res.json({ success: true, conversations: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:conversationId', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const isParticipant = conversation.participants.some(p => p.toString() === req.user._id.toString());
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not authorized' });

    const { page = 1, limit = 50 } = req.query;
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'fullName profileImage')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: req.user._id }, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    const unreadKey = `unreadCount.${req.user._id}`;
    await Conversation.findByIdAndUpdate(req.params.conversationId, { [unreadKey]: 0 });

    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/start', protect, async (req, res) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) return res.status(400).json({ success: false, message: 'Recipient ID is required' });
    if (recipientId === req.user._id.toString()) return res.status(400).json({ success: false, message: 'Cannot message yourself' });

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] }
    }).populate('participants', 'fullName profileImage lastSeen');

    if (!conversation) {
      conversation = await Conversation.create({ participants: [req.user._id, recipientId] });
      await conversation.populate('participants', 'fullName profileImage lastSeen');
    }

    res.json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:conversationId', protect, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ success: false, message: 'Message content is required' });

    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const isParticipant = conversation.participants.some(p => p.toString() === req.user._id.toString());
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not authorized' });

    const message = await Message.create({
      conversation: req.params.conversationId,
      sender: req.user._id,
      content: content.trim()
    });
    await message.populate('sender', 'fullName profileImage');

    // Update conversation
    const otherParticipants = conversation.participants.filter(p => p.toString() !== req.user._id.toString());
    const unreadUpdates = {};
    otherParticipants.forEach(p => {
      unreadUpdates[`unreadCount.${p}`] = (conversation.unreadCount.get(p.toString()) || 0) + 1;
    });
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: content.trim().substring(0, 100),
      lastMessageAt: new Date(),
      ...unreadUpdates
    });

    // Emit via Socket.io to conversation room
    const io = req.app.get('io');
    if (io) {
      io.to(req.params.conversationId).emit('message:new', message);
    }

    // Send notification to other participants
    for (const recipientId of otherParticipants) {
      await createNotification(req.app, {
        recipient: recipientId,
        type: 'message',
        title: `New message from ${message.sender.fullName}`,
        body: content.trim().substring(0, 80),
        link: '/messages'
      });
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
