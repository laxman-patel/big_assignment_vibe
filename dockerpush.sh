DOCKER_USER="puranjay3"

# Auth Service
docker build -t $DOCKER_USER/auth-service:v2 ./services/auth-service
docker push $DOCKER_USER/auth-service:v2

# Post Service
docker build -t $DOCKER_USER/post-service:v2 ./services/post-service
docker push $DOCKER_USER/post-service:v2

# Media Service
docker build -t $DOCKER_USER/media-service:v2 ./services/media-service
docker push $DOCKER_USER/media-service:v2

# Feed Service
docker build -t $DOCKER_USER/feed-service:v2 ./services/feed-service
docker push $DOCKER_USER/feed-service:v2

# Analytics Service
docker build -t $DOCKER_USER/analytics-service:v2 ./services/analytics-service
docker push $DOCKER_USER/analytics-service:v2

# Frontend UI
docker build -t $DOCKER_USER/frontend-ui:v2 ./services/frontend-ui
docker push $DOCKER_USER/frontend-ui:v2
