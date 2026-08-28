locals {
  name = "${var.project_name}-${var.environment}"

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.tags
  )
}

module "vpc" {
  source = "../../modules/vpc"

  name                   = local.name
  cidr                   = var.vpc_cidr
  azs                    = var.azs
  private_subnet_cidrs   = var.private_subnet_cidrs
  public_subnet_cidrs    = var.public_subnet_cidrs
  single_nat_gateway     = var.environment != "prod"
  cluster_name_for_tags  = "${local.name}-eks"
  tags                   = local.common_tags
}

module "security_group" {
  source = "../../modules/security_group"

  name     = local.name
  vpc_id   = module.vpc.vpc_id
  vpc_cidr = module.vpc.vpc_cidr_block
  tags     = local.common_tags
}

module "eks" {
  source = "../../modules/eks"

  name       = local.name
  cluster_version = var.cluster_version
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids

  extra_node_security_group_ids = [module.security_group.node_extra_security_group_id]

  cluster_endpoint_public_access_cidrs = var.cluster_endpoint_public_access_cidrs

  node_instance_types = var.node_instance_types
  node_desired_size   = var.node_desired_size
  node_min_size       = var.node_min_size
  node_max_size       = var.node_max_size

  tags = local.common_tags
}

module "ecr" {
  source = "../../modules/ecr"

  name_prefix      = local.name
  repository_names = var.ecr_repository_names

  pull_principal_arns = [module.eks.node_iam_role_arn]

  tags = local.common_tags
}

module "iam" {
  source = "../../modules/iam"

  name = local.name

  oidc_provider_arn = module.eks.oidc_provider_arn
  oidc_provider_url = module.eks.oidc_provider

  irsa_namespace             = var.irsa_namespace
  irsa_service_account_name  = var.irsa_service_account_name

  node_iam_role_name = module.eks.node_iam_role_name

  tags = local.common_tags
}