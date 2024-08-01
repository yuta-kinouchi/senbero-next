# Configure the AWS Provider
provider "aws" {
  region = "ap-northeast-1"  # お使いのリージョンに変更してください
}

# S3バケットの作成
resource "aws_s3_bucket" "nextjs_uploads" {
  bucket = "senbero-next" 
}

# オブジェクト所有権の設定
resource "aws_s3_bucket_ownership_controls" "nextjs_uploads" {
  bucket = aws_s3_bucket.nextjs_uploads.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}


# バケットポリシーの追加
resource "aws_s3_bucket_policy" "allow_public_read" {
  bucket = aws_s3_bucket.nextjs_uploads.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.nextjs_uploads.arn}/*"
      },
    ]
  })
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

# バケットのACLを公開読み取り可能に設定
resource "aws_s3_bucket_acl" "nextjs_uploads" {
  depends_on = [aws_s3_bucket_ownership_controls.nextjs_uploads]

  bucket = aws_s3_bucket.nextjs_uploads.id
  acl    = "public-read"
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

