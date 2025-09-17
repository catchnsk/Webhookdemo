# Webhook Management System Backend

A Spring Boot application for managing webhook events, subscriptions, and delivery with MSSQL database integration.

## Features

- **Webhook Event Management**: Create, track, and retry webhook deliveries
- **Subscription Management**: Manage webhook endpoints and event subscriptions
- **Admin Authentication**: Secure admin registration and login
- **Statistics & Analytics**: Comprehensive webhook performance metrics
- **Async Processing**: Non-blocking webhook delivery with retry mechanisms
- **MSSQL Integration**: Full database persistence with JPA/Hibernate

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Microsoft SQL Server 2019 or higher
- SQL Server Management Studio (optional, for database management)

## Database Setup

1. Install Microsoft SQL Server
2. Create a new database named `webhook_db`
3. Update the database connection settings in `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=webhook_db;encrypt=true;trustServerCertificate=true
    username: your_username
    password: your_password
```

## Running the Application

1. Clone the repository
2. Navigate to the backend directory
3. Update database credentials in `src/main/resources/application.yml`
4. Run the application:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

## API Endpoints

### Webhook Events
- `POST /api/events` - Create a new webhook event
- `GET /api/events` - Get all webhook events
- `GET /api/events/paginated` - Get paginated events with filtering
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events/{id}/retry` - Retry a failed event
- `GET /api/events/stats` - Get webhook statistics
- `DELETE /api/events/{id}` - Delete an event

### Webhook Subscriptions
- `POST /api/subscriptions` - Create a new subscription
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/active` - Get active subscriptions
- `GET /api/subscriptions/{id}` - Get subscription by ID
- `PUT /api/subscriptions/{id}` - Update a subscription
- `DELETE /api/subscriptions/{id}` - Delete a subscription
- `GET /api/subscriptions/search?query={query}` - Search subscriptions

### Admin Management
- `POST /api/admin/register` - Register a new admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/{id}` - Get admin by ID
- `PUT /api/admin/{id}` - Update admin details

## Authentication

The API uses HTTP Basic Authentication. Default credentials:
- Username: `admin`
- Password: `password`

For production, update the credentials in `application.yml` or use environment variables.

## Configuration

Key configuration options in `application.yml`:

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=webhook_db
    username: ${DB_USERNAME:sa}
    password: ${DB_PASSWORD:YourPassword123}
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

## Features

### Async Webhook Delivery
- Webhooks are delivered asynchronously using Spring's `@Async`
- Failed webhooks are automatically retried with exponential backoff
- Configurable retry attempts and timeouts

### Database Schema
The application automatically creates the following tables:
- `webhook_events` - Stores webhook delivery events
- `webhook_subscriptions` - Manages webhook subscriptions
- `subscription_events` - Maps events to subscriptions
- `admins` - Admin user management

### Monitoring
- Health checks available at `/api/actuator/health`
- Metrics available at `/api/actuator/metrics`
- Application info at `/api/actuator/info`

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package
java -jar target/webhook-management-0.0.1-SNAPSHOT.jar
```

### Environment Variables
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `SERVER_PORT` - Application port (default: 8080)

## Integration with Frontend

This backend is designed to work with the React frontend. Update the frontend's API base URL to point to this Spring Boot application:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Security Considerations

- Passwords are encrypted using BCrypt
- CORS is configured for development (update for production)
- SQL injection protection via JPA/Hibernate
- Input validation using Bean Validation

## Troubleshooting

1. **Database Connection Issues**: Verify SQL Server is running and credentials are correct
2. **Port Conflicts**: Change the server port in `application.yml`
3. **Memory Issues**: Increase JVM heap size with `-Xmx` parameter
4. **SSL Issues**: Update `trustServerCertificate=true` in connection string for development