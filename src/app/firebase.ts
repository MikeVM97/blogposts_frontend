import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5q-tCDMdq6A9tdO-845CrXjPEnSCUflM",
  authDomain: "blogposts-valibot.firebaseapp.com",
  projectId: "blogposts-valibot",
  storageBucket: "blogposts-valibot.appspot.com",
  messagingSenderId: "89426461065",
  appId: "1:89426461065:web:07a5009585789458a66158",
  measurementId: "G-58PWF5BGH8",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export async function uploadImage(file: File, alias: string) {
  const storageRef = ref(storage, alias);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}