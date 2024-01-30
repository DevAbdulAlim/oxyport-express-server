import { Request } from "express";

const MAX_FILE_SIZE_MB = 1024 * 20;

export const imageParser = (req: Request): string => {
  if (Array.isArray(req.files)) {
    const validFiles = req.files
      .filter((file: Express.Multer.File) => file.fieldname === "images[]")
      .map((file: Express.Multer.File) => {
        // Check image mimetype
        if (!file.mimetype.startsWith("image/")) {
          throw new Error("Only image files are allowed");
        }
        // Check image size
        const fileSizeInMb = file.size / (1024 * 1024); // Convert file size to MB
        if (fileSizeInMb > MAX_FILE_SIZE_MB) {
          throw new Error(
            `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB`
          );
        }
        return file.filename;
      });

    return validFiles.join(",");
  } else {
    return "";
  }
};
