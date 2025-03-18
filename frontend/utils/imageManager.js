

export const compressAndConvertImage = (input, maxSizeKB, maxWidth = 300, maxHeight = 300) => {
    
    return new Promise((resolve, reject) => {
        if (!input) return reject(new Error("No file provided"));
        let file;
        if (input instanceof Uint8Array) {
            file = new Blob([input], { type: "image/jpeg" }); 
        } else if (input instanceof File || input instanceof Blob) {
            file = input;
        } else if (Array.isArray(input)) {
            const uint8Array = new Uint8Array(input);
            file = new Blob([uint8Array], { type: "image/jpeg" });
        } 
        else {
            return reject(new Error("Unsupported input type"));
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const aspectRatio = width / height;
                    if (width > height) {
                        width = maxWidth;
                        height = maxWidth / aspectRatio;
                    } else {
                        height = maxHeight;
                        width = maxHeight * aspectRatio;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                let quality = 0.7;
                const compressImage = () => {
                    canvas.toBlob((blob) => {
                        if (!blob) return reject(new Error("Failed to create blob"));

                        if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
                            quality -= 0.1;
                            compressImage();
                        } else {
                            const reader = new FileReader();
                            reader.readAsArrayBuffer(blob);
                            reader.onload = () => {
                                const uint8Array = new Uint8Array(reader.result);
                                resolve(uint8Array);
                            };
                            reader.onerror = reject;
                        }
                    }, "image/jpeg", quality);
                };

                compressImage();
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

export const  blobToImageUrl = (imageData) => {
    if (!imageData || !imageData.length) return null;
    const blob = new Blob([imageData], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
};

