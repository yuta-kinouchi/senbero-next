import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parseForm } from '@/lib/parseForm';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;

  // Vercel(AWS Lambda基盤)ではAWS_REGION/AWS_ACCESS_KEY_ID等の名前は
  // ランタイムの予約環境変数と衝突し上書きできないため、専用の変数名を使う。
  const region = process.env.S3_UPLOAD_REGION;
  const accessKeyId = process.env.S3_UPLOAD_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_UPLOAD_SECRET_ACCESS_KEY;
  const bucketName = process.env.S3_BUCKET_NAME;

  if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error('AWS credentials/bucket are not configured on the server');
    return res.status(500).json({ error: 'Image upload is not configured' });
  }

  try {
    const { files } = await parseForm(req);
    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!file) {
      return res.status(400).json({ error: 'image file is required' });
    }

    const fileExtension = file.originalFilename?.split('.').pop() || 'jpg';
    const fileName = `restaurant_${id}_${Date.now()}.${fileExtension}`;

    const s3Client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: fileName,
        Body: fs.createReadStream(file.filepath),
        ContentType: file.mimetype || undefined,
      },
    });

    const result = await upload.done();
    const url = result.Location || `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

    return res.status(200).json({ url });
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    return res.status(500).json({ error: '画像のアップロードに失敗しました' });
  }
}
