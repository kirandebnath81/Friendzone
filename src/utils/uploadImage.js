import { toast } from "react-toastify";
import { v4 } from "uuid";

//image compress
import imgConfig from "../config/imgConfig";
import { readAndCompressImage } from "browser-image-resizer";

//firebase
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebaseConfig";

const uploadImage = async (
  file,
  folder,
  startLoading,
  stopLoading,
  handler
) => {
  startLoading();
  try {
    const metadata = {
      contentType: file.type,
    };

    const resizedImg = await readAndCompressImage(file, imgConfig);

    const storageRef = ref(storage, `${folder}/${file.name + v4()}`);

    const snapshot = await uploadBytes(storageRef, resizedImg, metadata);

    const url = await getDownloadURL(snapshot.ref);
    handler(url);
    stopLoading();
  } catch (error) {
    stopLoading();
    console.log(error);
    toast.error("Something went wrong");
  }
};

export default uploadImage;
