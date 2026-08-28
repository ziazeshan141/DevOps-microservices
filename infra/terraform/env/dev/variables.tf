variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "myapp"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "azs" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "cluster_version" {
  type    = string
  default = "1.30"
}

variable "node_instance_types" {
  type    = list(string)
  default = ["t3.medium"]
}

variable "node_desired_size" {
  type    = number
  default = 2
}

variable "node_min_size" {
  type    = number
  default = 1
}

variable "node_max_size" {
  type    = number
  default = 4
}

variable "ecr_repository_names" {
  description = "List of ECR repository names to create (1 frontend + 24 backend microservices)"
  type        = list(string)
  default = [
    "frontend",
    "address-service",
    "admin-service",
    "analytics-service",
    "api-gateway",
    "auth-service",
    "cart-service",
    "catalog-service",
    "checkout-service",
    "fraud-service",
    "inventory-service",
    "media-service",
    "notification-service",
    "order-service",
    "payment-service",
    "pricing-service",
    "product-service",
    "promotion-service",
    "rating-service",
    "recommendation-service",
    "review-service",
    "search-service",
    "shipping-service",
    "user-service",
    "wishlist-service",
  ]
}

variable "cluster_endpoint_public_access_cidrs" {
  type    = list(string)
  default = ["0.0.0.0/0"] # tighten in production
}

variable "irsa_namespace" {
  type    = string
  default = "default"
}

variable "irsa_service_account_name" {
  type    = string
  default = "app-service-account"
}

variable "tags" {
  type    = map(string)
  default = {}
}