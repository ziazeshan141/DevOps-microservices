variable "name_prefix" {
  description = "Prefix applied to each repository name, e.g. '<name_prefix>/<repo>'"
  type        = string
}

variable "repository_names" {
  description = "List of ECR repository names to create"
  type        = list(string)
}

variable "image_tag_mutability" {
  description = "MUTABLE or IMMUTABLE"
  type        = string
  default     = "IMMUTABLE"
}

variable "scan_on_push" {
  type    = bool
  default = true
}

variable "untagged_expire_days" {
  description = "Days after which untagged images are expired"
  type        = number
  default     = 14
}

variable "max_tagged_image_count" {
  description = "Maximum number of tagged images (prefix 'v') to retain before expiring the oldest"
  type        = number
  default     = 20
}

variable "pull_principal_arns" {
  description = "IAM role/user ARNs allowed to pull images (e.g. the EKS node role)"
  type        = list(string)
  default     = []
}

variable "push_principal_arns" {
  description = "IAM role/user ARNs allowed to push images (e.g. a CI/CD role)"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}