output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.vpc.private_subnet_ids
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "eks_node_security_group_id" {
  value = module.eks.node_security_group_id
}

output "github_actions_role_arn" {
  description = "GitHub Actions OIDC IAM role."
  value       = module.iam.github_actions_role_arn
}

output "ecr_repository_urls" {
  value = module.ecr.repository_urls
}

output "alb_security_group_id" {
  value = module.security_groups.alb_security_group_id
}

output "data_security_group_id" {
  value = module.security_groups.data_security_group_id
}