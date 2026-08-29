# Rename to backend.tf after creating the S3 state bucket.

# terraform {
#   backend "s3" {
#     bucket = "s3-backend-047385030300-us-east-1-an"

#     key = "megamart/dev/terraform.tfstate"

#     region = "us-east-1"

#     encrypt = true

#     use_lockfile = true
#   }
# }