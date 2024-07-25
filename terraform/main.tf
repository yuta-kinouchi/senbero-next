# Configure the AWS Provider
provider "aws" {
  region = "ap-northeast-1"  # お使いのリージョンに変更してください
}

# S3バケットの作成
resource "aws_s3_bucket" "nextjs_uploads" {
  bucket = "senbero-next" 
}

# バケットの公開アクセスをブロック
resource "aws_s3_bucket_public_access_block" "nextjs_uploads" {
  bucket = aws_s3_bucket.nextjs_uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# バケットのCORS設定
resource "aws_s3_bucket_cors_configuration" "nextjs_uploads" {
  bucket = aws_s3_bucket.nextjs_uploads.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT"]
    allowed_origins = ["http://localhost:3000", "https://yourdomain.com"]  # 必要に応じて変更してください
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# IAMユーザーの作成（S3アクセス用）
resource "aws_iam_user" "nextjs_s3_user" {
  name = "nextjs-s3-user"
}

# IAMポリシーの作成
resource "aws_iam_user_policy" "nextjs_s3_policy" {
  name = "nextjs-s3-policy"
  user = aws_iam_user.nextjs_s3_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Resource = [
          aws_s3_bucket.nextjs_uploads.arn,
          "${aws_s3_bucket.nextjs_uploads.arn}/*"
        ]
      }
    ]
  })
}

# アクセスキーの作成
resource "aws_iam_access_key" "nextjs_s3_key" {
  user = aws_iam_user.nextjs_s3_user.name
}