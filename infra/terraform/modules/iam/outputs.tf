output "irsa_ecr_read_role_arn" {
  description = "ARN of the IRSA role for ECR read-only access"
  value       = aws_iam_role.irsa_ecr_read.arn
}

output "node_cloudwatch_policy_arn" {
  description = "ARN of the CloudWatch policy attached to the node role"
  value       = aws_iam_policy.node_cloudwatch.arn
}

output "ci_ecr_push_policy_arn" {
  description = "ARN of the CI/CD ECR push policy (null if disabled)"
  value       = var.enable_ci_ecr_push_policy ? aws_iam_policy.ci_ecr_push[0].arn : null
}