description: Step-by-step guide to deploy the scalable multi-cloud clickstream application.
Deployment Workflow
This guide outlines the steps to deploy the entire application stack, from infrastructure provisioning to service deployment.

Prerequisites
Tools: Ensure you have the following installed:
terraform
kubectl
helm
argocd CLI (optional but recommended)
minikube or a cloud provider K8s cluster access
Credentials:
AWS Credentials (if using AWS resources)
GCP Credentials (if using GCP resources)
Confluent Cloud API Keys (for Kafka)
Step 1: Infrastructure Provisioning (Terraform)
Navigate to the Terraform directory:

cd terraform
Initialize Terraform:

terraform init
Plan the infrastructure: Review what will be created.

terraform plan
Apply the configuration: Provision the resources (EKS/GKE clusters, Kafka topics, etc.).

terraform apply
Note: This may take several minutes.

Configure kubectl: After Terraform completes, update your local kubeconfig to point to the new cluster.

For AWS EKS: aws eks update-kubeconfig --region <region> --name <cluster_name>
For GCP GKE: gcloud container clusters get-credentials <cluster_name> --region <region>
Step 2: Install ArgoCD
Create the ArgoCD namespace:

kubectl create namespace argocd
Install ArgoCD:

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
Access the ArgoCD UI:

Port-forward the server:
kubectl port-forward svc/argocd-server -n argocd 8080:443
Open https://localhost:8080 in your browser.
Username: admin
Password: Get the initial password:
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
Step 3: Deploy Services via ArgoCD
Apply the App of Apps pattern (or individual manifests): We will apply the manifests located in k8s/manifests.

kubectl apply -f k8s/manifests/observability.yaml
kubectl apply -f k8s/manifests/ingest-service.yaml
kubectl apply -f k8s/manifests/product-service.yaml
kubectl apply -f k8s/manifests/audit-service.yaml
kubectl apply -f k8s/manifests/sync-service.yaml
# Add other service manifests as needed
Sync Applications:

Go to the ArgoCD UI.
You should see the applications (ingest-service, product-service, etc.) appearing.
If they are "OutOfSync", click "Sync" to deploy them to the cluster.
Step 4: Verify Deployment
Check Pods:

kubectl get pods --all-namespaces
Ensure all pods are in Running state.

Access Services:

Use kubectl port-forward to access specific services locally for testing.
Example for Ingest Service:
kubectl port-forward svc/ingest-service 8000:80
Step 5: Observability
Access Grafana:

Port-forward Grafana:
kubectl port-forward svc/kube-prometheus-stack-grafana -n monitoring 3000:80
Open http://localhost:3000.
Default login: admin / prom-operator.
Access Kibana (if ELK is deployed):

Port-forward Kibana:
kubectl port-forward svc/elk-kibana -n elk 5601:5601
Open http://localhost:5601.