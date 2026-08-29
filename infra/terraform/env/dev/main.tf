module "vpc" {
  source = "../../modules/vpc"

  name               = local.cluster_name
  cidr               = var.vpc_cidr
  azs                = local.azs
  public_subnets     = local.public_subnets
  private_subnets    = local.private_subnets
  cluster_name       = local.cluster_name
  single_nat_gateway = var.single_nat_gateway

  tags = local.common_tags
}

module "ecr" {
  source = "../../modules/ecr"

  repository_names      = local.ecr_repositories
  image_retention_count = var.ecr_image_retention_count

  tags = local.common_tags
}

module "iam" {
  source = "../../modules/iam"

  name                = local.cluster_name
  github_repository   = var.github_repository
  github_branch       = var.github_branch
  ecr_repository_arns = module.ecr.repository_arns

  tags = local.common_tags
}

module "eks" {
  source = "../../modules/eks"

  cluster_name                 = local.cluster_name
  kubernetes_version           = var.kubernetes_version
  vpc_id                       = module.vpc.vpc_id
  private_subnet_ids           = module.vpc.private_subnet_ids
  endpoint_public_access_cidrs = var.eks_endpoint_public_access_cidrs

  node_instance_types = var.node_instance_types
  node_min_size       = var.node_min_size
  node_desired_size   = var.node_desired_size
  node_max_size       = var.node_max_size

  admin_principal_arn = var.eks_admin_principal_arn

  tags = local.common_tags
}

module "security_groups" {
  source = "../../modules/security_group"

  name                       = local.cluster_name
  vpc_id                     = module.vpc.vpc_id
  eks_node_security_group_id = module.eks.node_security_group_id

  tags = local.common_tags
}