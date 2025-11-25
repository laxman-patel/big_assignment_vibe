# Multi-Cloud Twitter Clone with Clickstream Analytics

A scalable, multi-cloud microservices application that replicates core Twitter functionality while analyzing user behavior in real-time. This project leverages Kubernetes, Kafka, and a suite of microservices to handle posts, feeds, and clickstream data.

## 🚀 Features

*   **Twitter-like Functionality**: Users can post tweets, view feeds, and interact with content.
*   **Microservices Architecture**: Decoupled services for scalability and maintainability.
*   **Multi-Cloud Deployment**: Infrastructure managed across AWS (EKS, RDS, DynamoDB) and Confluent Cloud (Kafka).
*   **Real-time Analytics**: Stream processing with Kafka and Flink (conceptually) to analyze user clicks and engagement.
*   **Secure Authentication**: JWT-based authentication with PostgreSQL storage.
*   **Modern Frontend**: React-based UI with real-time data visualization.
*   **Infrastructure as Code**: Terraform for provisioning all cloud resources.
*   **GitOps**: ArgoCD for continuous deployment to Kubernetes.

## 🏗️ Architecture

The application consists of the following microservices:

*   **Frontend UI**: React application for users to browse products and view analytics.
*   **Auth Service**: Handles user registration and login (PostgreSQL).
*   **Product Service**: Manages product catalog (PostgreSQL).
*   **Ingest Service**: Receives clickstream data and produces to Kafka.
*   **Feed Service**: Generates user feeds based on activity.
*   **Post Service**: Manages user posts/reviews.
*   **Media Service**: Handles image uploads.
*   **Analytics Service**: Aggregates and serves analytics data.
*   **Sync Service**: Consumes aggregated data and updates read-optimized stores (DynamoDB).
*   **Audit Service**: Logs critical actions for compliance.

### Tech Stack

*   **Languages**: Node.js, JavaScript
*   **Containerization**: Docker
*   **Orchestration**: Kubernetes (EKS)
*   **Messaging**: Apache Kafka (Confluent Cloud)
*   **Databases**: PostgreSQL (AWS RDS), DynamoDB
*   **IaC**: Terraform
*   **CI/CD**: GitHub Actions (implied), ArgoCD

## 🛠️ Prerequisites

*   [Docker](https://www.docker.com/)
*   [Kubernetes CLI (kubectl)](https://kubernetes.io/docs/tasks/tools/)
*   [Terraform](https://www.terraform.io/)
*   [AWS CLI](https://aws.amazon.com/cli/)
*   [Node.js](https://nodejs.org/) (for local development)

## 📦 Installation & Setup

### 1. Infrastructure Provisioning

Navigate to the `terraform` directory and apply the configuration:

```bash
cd terraform
terraform init
terraform apply
```

This will set up the EKS cluster, RDS instance, DynamoDB tables, and other AWS resources.

### 2. Build & Push Images

Use the provided script to build and push Docker images to your registry (replace `puranjay3` with your Docker Hub username in the script if needed):

```bash
./dockerpush.sh
```

### 3. Deploy to Kubernetes

Apply the Kubernetes manifests located in `k8s/manifests`:

```bash
kubectl apply -f k8s/manifests/
```

Alternatively, if using ArgoCD, apply the application manifest:

```bash
kubectl apply -f k8s/argocd/application.yaml
```

## ⚙️ Configuration

Ensure the following secrets are created in your Kubernetes cluster:

*   `rds-secret`: Contains `host`, `username`, `password` for the RDS instance.
*   `kafka-secret` (if applicable): Contains Kafka API keys.

## 🖥️ Usage

1.  **Frontend**: Access the application via the LoadBalancer URL provided by the `frontend-ui` service.
2.  **Signup/Login**: Create an account to generate an auth token.
3.  **Browse**: Click on products to generate clickstream events.
4.  **Analytics**: View real-time stats on the dashboard.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
