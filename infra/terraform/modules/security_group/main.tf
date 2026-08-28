resource "aws_security_group" "node_extra" {
  name        = "${var.name}-node-extra-sg"
  description = "Additional rules for EKS worker nodes"
  vpc_id      = var.vpc_id

  tags = merge(var.tags, {
    Name = "${var.name}-node-extra-sg"
  })
}

resource "aws_security_group_rule" "node_extra_ingress_vpc" {
  type              = "ingress"
  from_port         = 0
  to_port           = 65535
  protocol          = "tcp"
  cidr_blocks       = [var.vpc_cidr]
  security_group_id = aws_security_group.node_extra.id
  description       = "Allow all TCP traffic from within the VPC"
}

resource "aws_security_group_rule" "node_extra_ingress_https" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = var.node_ingress_https_cidrs
  security_group_id = aws_security_group.node_extra.id
  description       = "Allow HTTPS from configured CIDRs"
}

resource "aws_security_group_rule" "node_extra_egress_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node_extra.id
  description       = "Allow all outbound traffic"
}

resource "aws_security_group" "admin_access" {
  name        = "${var.name}-admin-access-sg"
  description = "SG for admin/bastion access to cluster resources"
  vpc_id      = var.vpc_id

  ingress {
    description = "SSH from trusted CIDRs only"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.admin_ssh_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.name}-admin-access-sg"
  })
}