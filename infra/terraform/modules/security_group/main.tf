module "alb" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "6.0.0"

  name = "${var.name}-alb"

  description = "Public ALB security group for MegaMart"

  vpc_id = var.vpc_id

  ingress_rules = {

    http = {
      from_port   = 80
      to_port     = 80
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"

      description = "HTTP from internet"
    }

    https = {
      from_port   = 443
      to_port     = 443
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"

      description = "HTTPS from internet"
    }
  }

  egress_rules = {

    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"

      description = "All outbound traffic"
    }
  }

  tags = var.tags
}

module "data" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "6.0.0"

  name = "${var.name}-data"

  description = "Data services access from EKS nodes"

  vpc_id = var.vpc_id

  ingress_rules = {

    postgres = {
      from_port    = 5432
      to_port      = 5432
      ip_protocol  = "tcp"

      referenced_security_group_id = var.eks_node_security_group_id

      description = "PostgreSQL from EKS nodes"
    }

    redis = {
      from_port   = 6379
      to_port     = 6379
      ip_protocol = "tcp"

      referenced_security_group_id = var.eks_node_security_group_id

      description = "Redis from EKS nodes"
    }

    rabbitmq = {
      from_port   = 5672
      to_port     = 5672
      ip_protocol = "tcp"

      referenced_security_group_id = var.eks_node_security_group_id

      description = "RabbitMQ from EKS nodes"
    }
  }

  egress_rules = {

    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"

      description = "All outbound traffic"
    }
  }

  tags = var.tags
}