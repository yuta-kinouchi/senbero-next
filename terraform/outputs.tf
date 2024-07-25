output "s3_bucket_name" {
  value       = aws_s3_bucket.nextjs_uploads.id
  description = "The name of the S3 bucket"
}

output "iam_user_name" {
  value       = aws_iam_user.nextjs_s3_user.name
  description = "The name of the IAM user"
}

output "access_key_id" {
  value       = aws_iam_access_key.nextjs_s3_key.id
  sensitive   = true
  description = "The access key ID"
}

output "secret_access_key" {
  value       = aws_iam_access_key.nextjs_s3_key.secret
  sensitive   = true
  description = "The secret access key"
}