import { Request } from "express";

// Maximum file size limit in MB
const MAX_FILE_SIZE_MB = 20;

export const imageParser = (req: Request): string => {
  if (Array.isArray(req.files)) {
    const validFiles = req.files.map((file: Express.Multer.File) => {
      if (!file.mimetype.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const fileSizeInMb = file.size / (1024 * 1024);
      if (fileSizeInMb > MAX_FILE_SIZE_MB) {
        throw new Error(
          `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB`
        );
      }

      return file.filename;
    });

    if (validFiles.length === 0) {
      throw new Error("No valid image files uploaded");
    }

    return validFiles.join(",");
  } else {
    return "";
  }
};
