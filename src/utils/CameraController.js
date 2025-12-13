import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export class CameraController {
    static async takePhoto() {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera
            });
            return image.dataUrl;
        } catch (error) {
            console.error('Camera error:', error);
            throw error;
        }
    }

    static async recordVideo() {
        // Note: Capacitor Camera doesn't support video recording directly
        // For video, we need to use Capacitor Media plugin or native code
        try {
            const video = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera
            });
            return video.dataUrl;
        } catch (error) {
            console.error('Video error:', error);
            throw error;
        }
    }

    static async pickFromGallery() {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Photos
            });
            return image.dataUrl;
        } catch (error) {
            console.error('Gallery error:', error);
            throw error;
        }
    }

    static async pickVideo() {
        // Capacitor Camera doesn't support video picking, so we use HTML input
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';

            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Convert to data URL
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error('Failed to read video'));
                    reader.readAsDataURL(file);
                } else {
                    reject(new Error('No video selected'));
                }
            };

            input.oncancel = () => reject(new Error('Video selection cancelled'));
            input.click();
        });
    }

    static async requestPermissions() {
        try {
            const permissions = await Camera.requestPermissions();
            return permissions.camera === 'granted';
        } catch (error) {
            console.error('Permission error:', error);
            return false;
        }
    }
}
