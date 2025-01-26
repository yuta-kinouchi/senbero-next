// hooks/useImageUpload.ts
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import imageCompression from 'browser-image-compression';
import { useState } from 'react';

const getS3Client = () => {
  if (typeof window === 'undefined') return null;
  
  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials are not properly configured');
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
};

// S3Clientのインスタンスを作成
const s3Client = getS3Client();

export const useImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, id: string): Promise<string> => {
    try {
      if (!s3Client) {
        throw new Error('S3 client is not initialized');
      }

      setUploadProgress(0);

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        preserveExif: false,
      });

      const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
      if (!bucketName) {
        throw new Error('S3 bucket name is not configured');
      }

      const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `restaurant_${id}_${Date.now()}.${fileExtension}`;

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: bucketName,
          Key: fileName,
          Body: compressedFile,
          ContentType: compressedFile.type
        },
      });

      upload.on("httpUploadProgress", (progress) => {
        if (progress.loaded && progress.total) {
          const percentUploaded = Math.round((progress.loaded / progress.total) * 100);
          setUploadProgress(percentUploaded);
        }
      });

      const result = await upload.done();
      setUploadProgress(100);
      
      // Location プロパティがない場合のフォールバック
      return result.Location || `https://${bucketName}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error: any) { // any型の使用は避けたいですが、エラーの型が不明確な場合があります
      console.error("Upload error:", error);
      throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
    }
  };

  return {
    uploadProgress,
    imagePreview,
    imageFile,
    handleFileChange,
    uploadImage,
  };
};