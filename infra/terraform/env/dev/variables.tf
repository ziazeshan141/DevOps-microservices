variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "megamart"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "10.20.0.0/16"
}

variable "azs" {
  description = "Availability zones"
  type        = list(string)
  default     = []
}

variable "single_nat_gateway" {
  description = "Use one NAT gateway"
  type        = bool
  default     = true
}

variable "kubernetes_version" {
  description = "EKS Kubernetes version"
  type        = string
  default     = "1.36"
}

variable "eks_endpoint_public_access_cidrs" {
  description = "CIDRs allowed to access EKS public endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "node_instance_types" {
  description = "EKS worker node instance types"
  type        = list(string)
  default     = ["t3.large"]
}

variable "node_min_size" {
  type    = number
  default = 2
}

variable "node_desired_size" {
  type    = number
  default = 2
}

variable "node_max_size" {
  type    = number
  default = 6
}

variable "eks_admin_principal_arn" {
  description = "Optional IAM principal for EKS admin access"
  type        = string
  default     = null
  nullable    = true
}

variable "github_repository" {
  description = "GitHub repo OWNER/REPOSITORY"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch"
  type        = string
  default     = "Test"
}

variable "ecr_image_retention_count" {
  description = "Number of ECR images to keep"
  type        = number
  default     = 30
}