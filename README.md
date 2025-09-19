# Webhook Management System

A comprehensive webhook management system with React frontend, Spring Boot backend, and Kafka message processing.

## Features

- **Publisher**: Send webhook events to external endpoints
- **Consumer**: Manage webhook subscriptions and endpoints  
- **Events Monitor**: Real-time tracking and monitoring
- **Statistics**: Analytics and performance metrics
- **Admin Panel**: User management and authentication
- **Kafka Integration**: Asynchronous message processing for scalability

## Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## Backend & Kafka Integration

The system uses Apache Kafka for asynchronous webhook processing:

- **API Base URL**: `http://localhost:8080/api`
- **Authentication**: Basic Auth (admin/password)
- **CORS**: Enabled for development
- **Kafka Topics**: 
  - `webhook-events`: New webhook events
  - `webhook-notifications`: Status notifications
  - `webhook-retries`: Retry processing

### Prerequisites

1. **Apache Kafka**: Download and start Kafka server
```bash
# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka Server
bin/kafka-server-start.sh config/server.properties
```

2. **SQL Server**: Database for persistence

### API Endpoints Used:

- `POST /api/events` - Publish webhook events
- `GET /api/events` - Get all events
- `POST /api/events/{id}/retry` - Retry failed events
- `GET /api/events/stats` - Get statistics
- `POST /api/subscriptions` - Create subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `PUT /api/subscriptions/{id}` - Update subscription
- `DELETE /api/subscriptions/{id}` - Delete subscription
- `POST /api/admin/register` - Register admin
- `POST /api/admin/login` - Admin login

### Kafka Features

- **Asynchronous Processing**: Webhook events are processed via Kafka queues
- **Retry Mechanism**: Failed webhooks are automatically retried with exponential backoff
- **Real-time Notifications**: Status updates are published to notification topics
- **Scalability**: Multiple consumer instances can process events in parallel
- **Reliability**: Message acknowledgment ensures no events are lost

## Development

The app includes:
- Vite proxy configuration for API calls
- Error handling and user feedback
- Loading states and form validation
- Responsive design with Tailwind CSS
- Kafka-powered real-time processing indicators

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Update API base URL in production environment
3. Configure CORS settings in Spring Boot backend
4. Set up proper authentication and security
5. Configure Kafka cluster for production
6. Set up monitoring for Kafka topics and consumers
