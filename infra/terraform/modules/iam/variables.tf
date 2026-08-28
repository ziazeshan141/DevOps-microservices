variable "name" {
  description = "Name prefix for IAM resources"
  type        = string
}

variable "oidc_provider_arn" {
  description = "ARN of the EKS cluster's OIDC provider (for IRSA trust policies)"
  type        = string
}

variable "oidc_provider_url" {
  description = "OIDC provider URL without the https:// prefix"
  type        = string
}

variable "irsa_namespace" {
  description = "Kubernetes namespace of the service account allowed to assume the IRSA role"
  type        = string
  default     = "default"
}

variable "irsa_service_account_name" {
  description = "Kubernetes service account name allowed to assume the IRSA role"
  type        = string
  default     = "app-service-account"
}

variable "node_iam_role_name" {
  description = "Name of the EKS worker node IAM role (to attach extra policies like CloudWatch)"
  type        = string
}

variable "enable_ci_ecr_push_policy" {
  description = "Whether to create a standalone IAM policy for CI/CD ECR push access"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}