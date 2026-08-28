variable "name" {
  description = "Name prefix for security groups"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID to create security groups in"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block of the VPC (used for internal allow rules)"
  type        = string
}

variable "admin_ssh_cidrs" {
  description = "CIDR blocks allowed to SSH into admin/bastion resources"
  type        = list(string)
  default     = ["10.0.0.0/8"]
}

variable "node_ingress_https_cidrs" {
  description = "CIDR blocks allowed to reach worker nodes over HTTPS (e.g. for ingress)"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}