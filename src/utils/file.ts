import { unlink } from "fs/promises";
import path from "path";

const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const rootDir = path.resolve(process.cwd());
    await unlink(path.join(rootDir, filePath));
  } catch (err) {
    console.error(`Error deleting file: ${filePath}`, (err as Error).message);
  }
};

export { deleteFile };
