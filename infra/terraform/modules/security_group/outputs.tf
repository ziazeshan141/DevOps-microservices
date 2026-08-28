output "node_extra_security_group_id" {
  description = "ID of the additional node security group"
  value       = aws_security_group.node_extra.id
}

output "admin_access_security_group_id" {
  description = "ID of the admin/bastion access security group"
  value       = aws_security_group.admin_access.id
}