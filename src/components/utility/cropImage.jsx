export default async function getCroppedImg(imageSrc, pixelCrop, targetWidth, quality) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate the target height to maintain the aspect ratio
      const targetHeight = (targetWidth * pixelCrop.height) / pixelCrop.width;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        targetWidth,
        targetHeight
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = new Date().toISOString();
        window.URL.revokeObjectURL(blob); 
        resolve(blob);
      }, "image/jpeg", quality); // Adjust the quality for jpeg compression
    };

    image.onerror = (err) => {
      reject(err);
    };
  });
}
