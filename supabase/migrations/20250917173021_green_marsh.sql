-- Insert sample admin user (password: password)
INSERT INTO admins (email, name, password, role, created_at, updated_at) 
VALUES ('admin@webhook.com', 'Admin User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', GETDATE(), GETDATE())
ON DUPLICATE KEY UPDATE email = email;

-- Insert sample webhook subscriptions
INSERT INTO webhook_subscriptions (name, url, secret, is_active, created_at, updated_at)
VALUES 
    ('User Management Webhook', 'https://api.example.com/webhooks/user-events', 'webhook_secret_123', 1, GETDATE(), GETDATE()),
    ('Order Processing Webhook', 'https://api.partner.com/notifications', 'webhook_secret_456', 0, GETDATE(), GETDATE())
ON DUPLICATE KEY UPDATE name = name;

-- Insert sample subscription events
INSERT INTO subscription_events (subscription_id, event_name)
SELECT s.id, 'user.created' FROM webhook_subscriptions s WHERE s.name = 'User Management Webhook'
UNION ALL
SELECT s.id, 'user.updated' FROM webhook_subscriptions s WHERE s.name = 'User Management Webhook'
UNION ALL
SELECT s.id, 'user.deleted' FROM webhook_subscriptions s WHERE s.name = 'User Management Webhook'
UNION ALL
SELECT s.id, 'order.created' FROM webhook_subscriptions s WHERE s.name = 'Order Processing Webhook'
UNION ALL
SELECT s.id, 'order.completed' FROM webhook_subscriptions s WHERE s.name = 'Order Processing Webhook'
UNION ALL
SELECT s.id, 'order.cancelled' FROM webhook_subscriptions s WHERE s.name = 'Order Processing Webhook';

-- Insert sample webhook events
INSERT INTO webhook_events (url, method, headers, payload, status, attempts, max_attempts, response_time, created_at, updated_at)
VALUES 
    ('https://api.example.com/webhooks/user-created', 'POST', '{"Content-Type": "application/json", "X-Webhook-Secret": "secret123"}', '{"userId": "123", "action": "user.created"}', 'SUCCESS', 1, 3, 150, DATEADD(hour, -2, GETDATE()), DATEADD(hour, -2, GETDATE())),
    ('https://api.partner.com/notifications', 'POST', '{"Content-Type": "application/json"}', '{"orderId": "456", "status": "completed"}', 'FAILED', 3, 3, NULL, DATEADD(hour, -1, GETDATE()), DATEADD(minute, -30, GETDATE()));

-- Update the failed event with error message
UPDATE webhook_events 
SET error_message = 'Connection timeout' 
WHERE url = 'https://api.partner.com/notifications' AND status = 'FAILED';