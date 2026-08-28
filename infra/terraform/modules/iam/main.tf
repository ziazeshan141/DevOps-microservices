data "aws_iam_policy_document" "irsa_ecr_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [var.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${var.oidc_provider_url}:sub"
      values   = ["system:serviceaccount:${var.irsa_namespace}:${var.irsa_service_account_name}"]
    }

    condition {
      test     = "StringEquals"
      variable = "${var.oidc_provider_url}:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "irsa_ecr_read" {
  name               = "${var.name}-irsa-ecr-read"
  assume_role_policy = data.aws_iam_policy_document.irsa_ecr_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "irsa_ecr_read" {
  role       = aws_iam_role.irsa_ecr_read.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

data "aws_iam_policy_document" "node_cloudwatch" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
      "cloudwatch:PutMetricData"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "node_cloudwatch" {
  name   = "${var.name}-node-cloudwatch"
  policy = data.aws_iam_policy_document.node_cloudwatch.json
  tags   = var.tags
}

resource "aws_iam_role_policy_attachment" "node_cloudwatch" {
  role       = var.node_iam_role_name
  policy_arn = aws_iam_policy.node_cloudwatch.arn
}

data "aws_iam_policy_document" "ci_ecr_push" {
  count = var.enable_ci_ecr_push_policy ? 1 : 0

  statement {
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "ci_ecr_push" {
  count  = var.enable_ci_ecr_push_policy ? 1 : 0
  name   = "${var.name}-ci-ecr-push"
  policy = data.aws_iam_policy_document.ci_ecr_push[0].json
  tags   = var.tags
}