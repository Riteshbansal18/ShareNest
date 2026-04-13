const Notification = require('../models/Notification');

// Create a notification and emit via socket if user is online
const createNotification = async (app, { recipient, type, title, body, link = '' }) => {
  try {
    const notification = await Notification.create({ recipient, type, title, body, link });
    const io = app.get('io');
    const onlineUsers = app.get('onlineUsers');
    const socketId = onlineUsers?.get(recipient.toString());
    if (io && socketId) {
      io.to(socketId).emit('notification:new', notification);
    }
    return notification;
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

module.exports = { createNotification };
