// hooks/useImageUpload.ts
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import imageCompression from 'browser-image-compression';
import { useState } from 'react';

const s3Client = typeof window !== 'undefined'
  ? new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

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
      setUploadProgress(0);

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        preserveExif: false,
      });

      const fileName = `restaurant_${id}_${Date.now()}.${compressedFile.name.split('.').pop()}`;

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
          Key: fileName,
          Body: compressedFile,
          ContentType: compressedFile.type
        },
      });

      upload.on("httpUploadProgress", (progress) => {
        const percentUploaded = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress(percentUploaded);
      });

      const result = await upload.done();
      setUploadProgress(100);
      return result.Location;
    } catch (error) {
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