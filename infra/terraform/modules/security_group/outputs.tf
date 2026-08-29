output "alb_security_group_id" {
  description = "Security group ID for the public ALB."
  value       = module.alb.id
}

output "data_security_group_id" {
  description = "Security group ID for data services."
  value       = module.data.id
}