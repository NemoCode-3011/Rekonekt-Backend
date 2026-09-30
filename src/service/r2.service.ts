import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2 from "src/config/r2";

export const uploadToR2 = async (
  file: Express.Multer.File
) => {
  const fileName = `${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await r2.send(command);

  const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

  return fileUrl;
};