resource "aws_ecr_repository" "this" {
  for_each = toset(var.repository_names)

  name                 = "${var.name_prefix}/${each.value}"
  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-${each.value}"
  })
}

resource "aws_ecr_lifecycle_policy" "this" {
  for_each   = aws_ecr_repository.this
  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images after ${var.untagged_expire_days} days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = var.untagged_expire_days
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Keep only the last ${var.max_tagged_image_count} tagged images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = var.max_tagged_image_count
        }
        action = { type = "expire" }
      }
    ]
  })
}

data "aws_iam_policy_document" "repo_policy" {
  for_each = length(var.pull_principal_arns) > 0 || length(var.push_principal_arns) > 0 ? aws_ecr_repository.this : {}

  dynamic "statement" {
    for_each = length(var.pull_principal_arns) > 0 ? [1] : []
    content {
      sid    = "AllowPull"
      effect = "Allow"
      principals {
        type        = "AWS"
        identifiers = var.pull_principal_arns
      }
      actions = [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ]
    }
  }

  dynamic "statement" {
    for_each = length(var.push_principal_arns) > 0 ? [1] : []
    content {
      sid    = "AllowPush"
      effect = "Allow"
      principals {
        type        = "AWS"
        identifiers = var.push_principal_arns
      }
      actions = [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ]
    }
  }
}

resource "aws_ecr_repository_policy" "this" {
  for_each   = data.aws_iam_policy_document.repo_policy
  repository = aws_ecr_repository.this[each.key].name
  policy     = each.value.json
}