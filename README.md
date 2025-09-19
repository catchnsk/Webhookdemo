# Webhook Management System

A comprehensive webhook management system with React frontend and Spring Boot backend.

## Features

- **Publisher**: Send webhook events to external endpoints
- **Consumer**: Manage webhook subscriptions and endpoints  
- **Events Monitor**: Real-time tracking and monitoring
- **Statistics**: Analytics and performance metrics
- **Admin Panel**: User management and authentication

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

## Backend Integration

The frontend is configured to work with the Spring Boot backend:

- **API Base URL**: `http://localhost:8080/api`
- **Authentication**: Basic Auth (admin/password)
- **CORS**: Enabled for development

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

## Development

The app includes:
- Vite proxy configuration for API calls
- Error handling and user feedback
- Loading states and form validation
- Responsive design with Tailwind CSS

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Update API base URL in production environment
3. Configure CORS settings in Spring Boot backend
4. Set up proper authentication and security
