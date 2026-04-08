import { WebSocketServer } from 'ws';
import { authenticate } from './auth.js';

// Store active WebSocket connections by user ID
global.websocketConnections = new Map();

class WebSocketMiddleware {
  constructor(server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });
    
    this.setupWebSocketServer();
  }

  setupWebSocketServer() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection attempt');
      
      // Extract token from query params or headers
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token') || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        ws.close(1008, 'Authentication token required');
        return;
      }

      // Verify token and get user
      this.authenticateWebSocket(ws, token);
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  }

  async authenticateWebSocket(ws, token) {
    try {
      const normalizedToken = typeof token === 'string' ? token.replace(/^Bearer\s+/i, '').trim() : token;
      // Verify JWT token
      const payload = await this.verifyToken(normalizedToken);
      
      const userId = payload?.sub || payload?.id;
      if (!payload || !userId) {
        ws.close(1008, 'Invalid token');
        return;
      }

      // Get user from database
      const user = await this.getUser(userId);
      
      if (!user) {
        ws.close(1008, 'User not found');
        return;
      }

      // Attach user to WebSocket
      ws.user = user;
      ws.userId = user.id;

      // Store connection
      global.websocketConnections.set(user.id, ws);
      console.log(`User ${user.email} connected via WebSocket`);

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        data: {
          message: 'Connected to SmartRecruit notifications',
          userId: user.id,
          timestamp: new Date().toISOString()
        }
      }));

      // Setup message handlers
      this.setupMessageHandlers(ws);

      // Handle disconnection
      ws.on('close', () => {
        global.websocketConnections.delete(user.id);
        console.log(`User ${user.email} disconnected from WebSocket`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for user ${user.email}:`, error);
        global.websocketConnections.delete(user.id);
      });

    } catch (error) {
      console.error('WebSocket authentication error:', error);
      ws.close(1008, 'Authentication failed');
    }
  }

  setupMessageHandlers(ws) {
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'ping':
            ws.send(JSON.stringify({
              type: 'pong',
              data: { timestamp: new Date().toISOString() }
            }));
            break;
            
          case 'mark_read':
            await this.handleMarkAsRead(ws, message.data);
            break;
            
          case 'get_unread_count':
            await this.handleGetUnreadCount(ws);
            break;
            
          default:
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Unknown message type' }
            }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Invalid message format' }
        }));
      }
    });
  }

  async handleMarkAsRead(ws, data) {
    try {
      const { notificationId } = data;
      
      if (!notificationId) {
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Notification ID required' }
        }));
        return;
      }

      // Mark notification as read using NotificationService
      const { NotificationService } = await import('../services/notifications.js');
      const notification = await NotificationService.markAsRead(notificationId, ws.userId);

      ws.send(JSON.stringify({
        type: 'notification_marked_read',
        data: { notification }
      }));

    } catch (error) {
      console.error('Mark as read error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Failed to mark notification as read' }
      }));
    }
  }

  async handleGetUnreadCount(ws) {
    try {
      const { NotificationService } = await import('../services/notifications.js');
      const result = await NotificationService.getUserNotifications(ws.userId, { limit: 1 });

      ws.send(JSON.stringify({
        type: 'unread_count',
        data: { count: result.unread_count }
      }));

    } catch (error) {
      console.error('Get unread count error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Failed to get unread count' }
      }));
    }
  }

  async verifyToken(token) {
    try {
      const { verifyToken } = await import('../utils/auth.js');
      return verifyToken(token);
    } catch (error) {
      console.warn('Token verification error:', error.message);
      return null;
    }
  }

  async getUser(userId) {
    try {
      const { db } = await import('../config/database.js');
      return await db('users')
        .where('id', userId)
        .where('is_active', true)
        .first();
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Send notification to specific user
  static async sendToUser(userId, notification) {
    const ws = global.websocketConnections.get(userId);
    
    if (ws && ws.readyState === 1) { // WebSocket.OPEN
      ws.send(JSON.stringify({
        type: 'notification',
        data: notification
      }));
      return true;
    }
    
    return false;
  }

  // Send notification to multiple users
  static async sendToUsers(userIds, notification) {
    const results = [];
    
    for (const userId of userIds) {
      const sent = await this.sendToUser(userId, notification);
      results.push({ userId, sent });
    }
    
    return results;
  }

  // Broadcast to all connected users
  static async broadcast(notification, excludeUsers = []) {
    const results = [];
    
    for (const [userId, ws] of global.websocketConnections) {
      if (excludeUsers.includes(userId)) continue;
      
      if (ws.readyState === 1) { // WebSocket.OPEN
        ws.send(JSON.stringify({
          type: 'notification',
          data: notification
        }));
        results.push({ userId, sent: true });
      } else {
        results.push({ userId, sent: false });
      }
    }
    
    return results;
  }

  // Get connection statistics
  static getStats() {
    const totalConnections = global.websocketConnections.size;
    const connections = Array.from(global.websocketConnections.entries()).map(([userId, ws]) => ({
      userId,
      readyState: ws.readyState,
      connectedAt: ws.connectedAt
    }));
    
    return {
      totalConnections,
      connections
    };
  }
}

export { WebSocketMiddleware };
