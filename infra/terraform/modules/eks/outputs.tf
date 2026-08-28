output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  value     = module.eks.cluster_certificate_authority_data
  sensitive = true
}

output "cluster_arn" {
  value = module.eks.cluster_arn
}

output "oidc_provider" {
  description = "OIDC provider URL (without https://) - used for IRSA trust policies"
  value       = module.eks.oidc_provider
}

output "oidc_provider_arn" {
  description = "ARN of the OIDC provider - used for IRSA trust policies"
  value       = module.eks.oidc_provider_arn
}

output "node_security_group_id" {
  description = "Security group ID automatically created and managed by the EKS module"
  value       = module.eks.node_security_group_id
}

output "node_iam_role_name" {
  description = "IAM role name of the default managed node group"
  value       = module.eks.eks_managed_node_groups["default"].iam_role_name
}

output "node_iam_role_arn" {
  description = "IAM role ARN of the default managed node group"
  value       = module.eks.eks_managed_node_groups["default"].iam_role_arn
}