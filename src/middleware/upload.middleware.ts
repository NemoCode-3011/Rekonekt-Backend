import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "audio/mpeg",
  "audio/wav",
  "video/mp4",
  "video/webm",
];

const createUploader = (maxSize: number) => {
  return multer({
    storage,
    limits: {
      fileSize: maxSize,
    },
    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Unsupported file type"));
      }

      cb(null, true);
    },
  });
};

export const uploadMediaFile = createUploader(
  10 * 1024 * 1024
);