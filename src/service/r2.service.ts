import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2 from "src/config/r2";

export const uploadToR2 = async (file: Express.Multer.File) => {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) {
    throw new Error("R2_PUBLIC_URL is not configured");
  }

  const objectKey = randomUUID();

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await r2.send(command);

  const fileUrl = `${publicUrl.replace(/\/+$/, "")}/${objectKey}`;

  return fileUrl;
};