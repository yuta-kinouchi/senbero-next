variable "aws_region" {
  description = "The AWS region to create resources in"
  default     = "ap-northeast-1"
}

variable "bucket_name" {
  description = "The name of the S3 bucket"
  default     = "senbero-next"
}

variable "app_name" {
  description = "The name of your Next.js application"
  default     = "senbero-next"
}