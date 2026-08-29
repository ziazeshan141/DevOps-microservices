output "repository_urls" {
  description = "Map of repository names to ECR URLs."

  value = {
    for name, repository in aws_ecr_repository.this :
    name => repository.repository_url
  }
}

output "repository_arns" {
  description = "ARNs of ECR repositories."

  value = [
    for repository in aws_ecr_repository.this :
    repository.arn
  ]
}

output "repository_names" {
  description = "Names of ECR repositories."

  value = keys(aws_ecr_repository.this)
}