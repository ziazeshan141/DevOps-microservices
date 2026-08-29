locals {
  access_entries = var.admin_principal_arn == null ? {} : {

    admin = {
      principal_arn = var.admin_principal_arn

      policy_associations = {
        cluster_admin = {

          policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"

          access_scope = {
            type = "cluster"
          }
        }
      }
    }
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.25.0"

  name               = var.cluster_name
  kubernetes_version = var.kubernetes_version

  authentication_mode = "API"

  enable_cluster_creator_admin_permissions = true

  access_entries = local.access_entries

  endpoint_private_access = true
  endpoint_public_access  = true

  endpoint_public_access_cidrs = var.endpoint_public_access_cidrs

  enabled_log_types = [
    "api",
    "audit",
    "authenticator"
  ]

  addons = {

    coredns = {}

    eks-pod-identity-agent = {
      before_compute = true
    }

    kube-proxy = {}

    vpc-cni = {
      before_compute = true
    }
  }

  vpc_id = var.vpc_id

  subnet_ids = var.private_subnet_ids

  eks_managed_node_groups = {

    general = {

      ami_type = "AL2023_x86_64_STANDARD"

      capacity_type = "ON_DEMAND"

      instance_types = var.node_instance_types

      min_size     = var.node_min_size
      desired_size = var.node_desired_size
      max_size     = var.node_max_size

      disk_size = 50

      labels = {
        workload = "general"
      }

      update_config = {
        max_unavailable_percentage = 33
      }
    }
  }

  tags = var.tags
}