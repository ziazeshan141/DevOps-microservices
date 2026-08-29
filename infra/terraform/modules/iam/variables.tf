variable "name" {
  type = string
}

variable "github_repository" {
  type = string
}

variable "github_branch" {
  type = string
}

variable "ecr_repository_arns" {
  type = list(string)
}

variable "tags" {
  type = map(string)
}