data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  cluster_name = "${var.project_name}-${var.environment}"

  azs = length(var.azs) > 0 ? var.azs : slice(
    data.aws_availability_zones.available.names,
    0,
    3
  )

  public_subnets = [
    for index, az in local.azs :
    cidrsubnet(var.vpc_cidr, 8, index)
  ]

  private_subnets = [
    for index, az in local.azs :
    cidrsubnet(var.vpc_cidr, 8, index + 10)
  ]

  ecr_repositories = [
    "auth-service",
    "user-service",
    "product-service",
    "catalog-service",
    "inventory-service",
    "cart-service",
    "order-service",
    "payment-service",
    "shipping-service",
    "notification-service",
    "review-service",
    "rating-service",
    "search-service",
    "recommendation-service",
    "pricing-service",
    "promotion-service",
    "wishlist-service",
    "address-service",
    "checkout-service",
    "api-gateway",
    "admin-service",
    "media-service",
    "analytics-service",
    "fraud-service",
    "frontend"
  ]

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}