# Docker Quick Start Guide

This guide helps you run the entire Training Management System using Docker.

## Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose included with Docker Desktop

## Quick Start (3 steps)

### 1. Create environment file

```bash
cp .env.example .env
```

Edit `.env` and update these values:
- `MYSQL_ROOT_PASSWORD` - Strong password for MySQL root
- `MYSQL_PASSWORD` - Password for application database user
- `JWT_SECRET` - Long random string (256+ bits)
- `MAIL_USERNAME` and `MAIL_PASSWORD` - Your email credentials

### 2. Build and start all services

```bash
docker-compose up -d
```

This command:
- Builds the Spring Boot backend
- Builds the Angular frontend
- Starts MySQL database
- Starts all 3 containers

### 3. Access the application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8083
- **MySQL**: localhost:3306

## Common Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes (clean database)
```bash
docker-compose down -v
```

### Rebuild after code changes
```bash
# Rebuild everything
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Check container status
```bash
docker-compose ps
```

### Access container shell
```bash
# Backend
docker exec -it tms-backend sh

# MySQL
docker exec -it tms-mysql mysql -u root -p

# Frontend
docker exec -it tms-frontend sh
```

## Troubleshooting

### Backend won't start
```bash
# Check backend logs
docker-compose logs backend

# Common issue: Database not ready
# Solution: Wait 30s for MySQL to initialize, then restart
docker-compose restart backend
```

### Database connection failed
```bash
# Verify MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Verify credentials in .env match
```

### Frontend shows blank page
```bash
# Check if backend is accessible
curl http://localhost:8083/actuator/health

# Check frontend logs
docker-compose logs frontend

# Verify frontend can reach backend
docker exec -it tms-frontend wget -O- http://backend:8083/actuator/health
```

### Port already in use
```bash
# Find what's using the port
lsof -i :80    # Frontend
lsof -i :8083  # Backend
lsof -i :3306  # MySQL

# Stop the conflicting service or change ports in docker-compose.yml
```

## Production Deployment with Docker

### Build for production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Push to container registry
```bash
# Tag images
docker tag tms-backend:latest yourusername/tms-backend:v1.0.0
docker tag tms-frontend:latest yourusername/tms-frontend:v1.0.0

# Push to Docker Hub
docker push yourusername/tms-backend:v1.0.0
docker push yourusername/tms-frontend:v1.0.0
```

### Deploy to cloud with Docker
```bash
# Railway
railway up

# Render
# Upload docker-compose.yml via dashboard

# AWS ECS
# Use AWS CLI to deploy containers
```

## Development Workflow

### Hot reload for frontend
```bash
# Instead of Docker, run frontend locally for hot reload
cd "Genc Training Portal Client"
npm start

# Keep backend and DB in Docker
docker-compose up -d mysql backend
```

### Debug backend
```bash
# Run backend with debug port exposed
# Add to docker-compose.yml under backend:
#   ports:
#     - "8083:8083"
#     - "5005:5005"
#   environment:
#     JAVA_OPTS: "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
```

## Health Checks

All services have built-in health checks:

```bash
# Check all services health
docker-compose ps

# Individual health endpoints
curl http://localhost:8083/actuator/health  # Backend
curl http://localhost/health                 # Frontend
docker exec tms-mysql mysqladmin ping -h localhost  # MySQL
```

## Data Persistence

MySQL data is persisted in a Docker volume:

```bash
# List volumes
docker volume ls

# Backup database
docker exec tms-mysql mysqldump -u root -p tms_db > backup.sql

# Restore database
docker exec -i tms-mysql mysql -u root -p tms_db < backup.sql
```

## Resource Limits

To set resource limits, add to services in docker-compose.yml:

```yaml
services:
  backend:
    # ... existing config
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Next Steps

- See [DEPLOYMENT.md](DEPLOYMENT.md) for cloud deployment options
- Configure environment variables for production
- Set up CI/CD with GitHub Actions
- Enable HTTPS with reverse proxy (Nginx/Traefik)
