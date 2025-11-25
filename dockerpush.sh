DOCKER_USER="puranjay3"

# Auth Service
docker build -t $DOCKER_USER/auth-service:latest ./services/auth-service
docker push $DOCKER_USER/auth-service:latest

# Post Service
docker build -t $DOCKER_USER/post-service:latest ./services/post-service
docker push $DOCKER_USER/post-service:latest

# Media Service
docker build -t $DOCKER_USER/media-service:latest ./services/media-service
docker push $DOCKER_USER/media-service:latest

# Feed Service
docker build -t $DOCKER_USER/feed-service:latest ./services/feed-service
docker push $DOCKER_USER/feed-service:latest

# Analytics Service
docker build -t $DOCKER_USER/analytics-service:latest ./services/analytics-service
docker push $DOCKER_USER/analytics-service:latest

# Frontend UI
docker build -t $DOCKER_USER/frontend-ui:latest ./services/frontend-ui
docker push $DOCKER_USER/frontend-ui:latest

# Audit Service
docker build -t $DOCKER_USER/audit-service:latest ./services/audit-service
docker push $DOCKER_USER/audit-service:latest

# Sync Service
docker build -t $DOCKER_USER/sync-service:latest ./services/sync-service
docker push $DOCKER_USER/sync-service:latest