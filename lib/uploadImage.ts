import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;
  const fileUploaded = await storage.createFile(
    "6719e5b2001f13e58220", //bucket Id Of storage
    ID.unique(),
    file
  );
  return fileUploaded;
};
export default uploadImage;
