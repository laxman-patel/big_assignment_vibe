module "aws_infra" {
  source = "./aws"
  region = var.aws_region
}

module "gcp_infra" {
  source = "./gcp"
  region = var.gcp_region
}


