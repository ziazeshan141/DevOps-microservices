# ============================================================
# EKS Access Entries
# ============================================================

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


# ============================================================
# EBS CSI DRIVER - POD IDENTITY IAM ROLE
# ============================================================

data "aws_iam_policy_document" "ebs_csi_pod_identity_assume_role" {

  statement {
    sid    = "AllowEksPodIdentity"
    effect = "Allow"

    actions = [
      "sts:AssumeRole",
      "sts:TagSession"
    ]

    principals {
      type = "Service"

      identifiers = [
        "pods.eks.amazonaws.com"
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:RequestTag/kubernetes-namespace"

      values = [
        "kube-system"
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:RequestTag/kubernetes-service-account"

      values = [
        "ebs-csi-controller-sa"
      ]
    }
  }
}


resource "aws_iam_role" "ebs_csi" {

  name = "${var.cluster_name}-ebs-csi-role"

  assume_role_policy = data.aws_iam_policy_document.ebs_csi_pod_identity_assume_role.json

  tags = var.tags
}


resource "aws_iam_role_policy_attachment" "ebs_csi" {

  role = aws_iam_role.ebs_csi.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEBSCSIDriverPolicyV2"
}


# ============================================================
# EKS
# ============================================================

module "eks" {

  source  = "terraform-aws-modules/eks/aws"
  version = "21.25.0"

  name               = var.cluster_name
  kubernetes_version = var.kubernetes_version

  authentication_mode = "API"

  enable_cluster_creator_admin_permissions = true

  access_entries = local.access_entries


  # ==========================================================
  # API ENDPOINT
  # ==========================================================

  endpoint_private_access = true
  endpoint_public_access  = true

  endpoint_public_access_cidrs = var.endpoint_public_access_cidrs


  # ==========================================================
  # CONTROL PLANE LOGGING
  # ==========================================================

  enabled_log_types = [
    "api",
    "audit",
    "authenticator"
  ]


  # ==========================================================
  # EKS ADDONS
  # ==========================================================

  addons = {

    coredns = {}

    eks-pod-identity-agent = {
      before_compute = true
    }

    kube-proxy = {}

    vpc-cni = {
      before_compute = true
    }


    # --------------------------------------------------------
    # Amazon EBS CSI Driver
    # --------------------------------------------------------

    aws-ebs-csi-driver = {

      most_recent = true

      pod_identity_association = [
        {
          service_account = "ebs-csi-controller-sa"
          role_arn        = aws_iam_role.ebs_csi.arn
        }
      ]
    }
  }


  # ==========================================================
  # NETWORK
  # ==========================================================

  vpc_id = var.vpc_id

  subnet_ids = var.private_subnet_ids


  # ==========================================================
  # MANAGED NODE GROUP
  # ==========================================================

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


  # ==========================================================
  # TAGS
  # ==========================================================

  tags = var.tags
}