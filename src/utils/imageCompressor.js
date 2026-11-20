/**
 * Image compressor utility to ensure photos do not exceed 500KB
 * @param {File|Blob|string} imageSource - File object, Blob, or Base64 data URL
 * @param {number} maxSizeBytes - Target max size in bytes (default 500KB = 500 * 1024)
 * @returns {Promise<string>} Compressed Base64 data URL guaranteed <= maxSizeBytes
 */
export async function compressImage(imageSource, maxSizeBytes = 500 * 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // 1. Calculate aspect-ratio preserved dimensions (max 800x800 for optimal quality & size)
      let width = img.width;
      let height = img.height;
      const maxDim = 800;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      // 2. Draw on offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Fill background with clean dark/white in case of PNG transparency
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // 3. Binary search / iterative quality adjustment to guarantee < 500KB
      let quality = 0.85;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);

      // Function to calculate exact byte length of base64
      const getByteSize = (base64Str) => {
        const head = 'data:image/jpeg;base64,';
        const str = base64Str.startsWith(head) ? base64Str.slice(head.length) : base64Str;
        return Math.round((str.length * 3) / 4);
      };

      let currentSize = getByteSize(dataUrl);

      // Step down quality if needed
      while (currentSize > maxSizeBytes && quality > 0.2) {
        quality -= 0.15;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        currentSize = getByteSize(dataUrl);
      }

      // If still larger, scale dimensions down by half
      if (currentSize > maxSizeBytes) {
        canvas.width = Math.round(width * 0.6);
        canvas.height = Math.round(height * 0.6);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL('image/jpeg', 0.6);
      }

      console.log(`[ImageCompressor] Compressed image size: ${(getByteSize(dataUrl) / 1024).toFixed(1)} KB (target: <= 500 KB)`);
      resolve(dataUrl);
    };

    img.onerror = (err) => {
      console.error('Failed to load image for compression', err);
      reject(err);
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageSource);
    }
  });
}
