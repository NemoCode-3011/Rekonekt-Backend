import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import r2 from "../config/r2";
import { isFileReferenced } from "./fileUsage.service";

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

// The file name inside the bucket, or null for links that are not ours
// (for example YouTube videos).
export const keyFromUrl = (fileUrl: string) => {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
  if (!base || !fileUrl.startsWith(`${base}/`)) return null;

  return fileUrl.slice(base.length + 1);
};

export const deleteFromR2 = async (key: string) => {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }),
  );
};

// Deletes the file only if nothing in the database still uses it.
export const removeFileIfUnused = async (fileUrl: string) => {
  const key = keyFromUrl(fileUrl);
  if (!key || (await isFileReferenced(key))) return false;

  await deleteFromR2(key);
  return true;
};