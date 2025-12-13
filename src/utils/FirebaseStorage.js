import { storage } from '../firebase-config';
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';

export class FirebaseStorage {
    static async uploadPhoto(dataUrl, userId) {
        try {
            const fileName = `photos/${userId}/${Date.now()}.jpg`;
            const storageRef = ref(storage, fileName);

            await uploadString(storageRef, dataUrl, 'data_url');
            const downloadURL = await getDownloadURL(storageRef);

            return downloadURL;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    static async uploadVideo(dataUrl, userId) {
        try {
            const fileName = `videos/${userId}/${Date.now()}.mp4`;
            const storageRef = ref(storage, fileName);

            await uploadString(storageRef, dataUrl, 'data_url');
            const downloadURL = await getDownloadURL(storageRef);

            return downloadURL;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    static async uploadFile(file, userId, type = 'photos') {
        try {
            const fileName = `${type}/${userId}/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            return downloadURL;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
}
