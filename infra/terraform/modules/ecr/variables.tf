variable "repository_names" {
  description = "List of ECR repository names."
  type        = list(string)
}

variable "image_retention_count" {
  description = "Number of tagged images retained in each ECR repository."
  type        = number
  default     = 30
}

variable "image_tag_mutability" {
  description = "Whether image tags can be overwritten."
  type        = string
  default     = "MUTABLE"

  validation {
    condition = contains(
      ["MUTABLE", "IMMUTABLE"],
      var.image_tag_mutability
    )

    error_message = "image_tag_mutability must be MUTABLE or IMMUTABLE."
  }
}

variable "scan_on_push" {
  description = "Enable ECR image scanning when images are pushed."
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags applied to ECR repositories."
  type        = map(string)
  default     = {}
}