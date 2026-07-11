// hooks/useImageUpload.ts
import imageCompression from 'browser-image-compression';
import { useState } from 'react';

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

      const formData = new FormData();
      formData.append('image', compressedFile, compressedFile.name);

      const response = await fetch(`/api/restaurants/${id}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || '画像のアップロードに失敗しました');
      }

      const { url } = await response.json();
      setUploadProgress(100);
      return url;
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
