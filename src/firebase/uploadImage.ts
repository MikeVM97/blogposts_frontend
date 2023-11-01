import { app } from "firebase/firebase"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"

export const storage = getStorage(app)

export async function uploadImage(file: File, alias: string) {
	const storageRef = ref(storage, alias)
	await uploadBytes(storageRef, file)
	const url = await getDownloadURL(storageRef)
	return url
}
