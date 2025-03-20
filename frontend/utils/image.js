import Compressor from "compressorjs"
import imageCompression from 'browser-image-compression';



const DefauttMaxWidth = 768
export const ImageMaxWidth = 768
export const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
}

export function arrayBufferToImgSrc(arrayBuffer, imgType = "jpeg") {
  const byteArray = new Uint8Array(arrayBuffer)
  const picBlob = new Blob([byteArray], { type: `image/${imgType}` })
  const picSrc = URL.createObjectURL(picBlob)
  return picSrc
}

async function readFileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function readFileToUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

export async function fileToCanisterBinaryStoreFormat(file) {
  const arrayBuffer = await readFileToArrayBuffer(file)
  return Array.from(new Uint8Array(arrayBuffer))
}
export async function getRotatedImage(imageSrc, rotation) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const rotRad = getRadianAngle(rotation);
  
  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // Return the rotated image as data URL or Uint8Array
  return canvas.toDataURL('image/jpeg');
}
export const resizeImage = (file, maxWidth) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      const img = new Image()
      img.src = reader.result
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const scale = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * scale
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            resolve(blob)
          },
          "image/jpeg",
          0.1 // Compresión del 70%
        )
      }
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

onDrop: async (acceptedFiles) => {
  if (acceptedFiles.length > 0) {
    try {
      const firstFile = acceptedFiles[0]
      
      // Get the image orientation to apply the proper rotation
      const orientation = await getOrientation(firstFile)
      const rotation = ORIENTATION_TO_ANGLE[orientation]

      // Resize image first, then apply rotation
      const compressedFile = await resizeImage(firstFile, ImageMaxWidth)

      // Convert to a URL after compression
      let imageDataUrl = await readFileToUrl(compressedFile)

      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      }

      setFile(imageDataUrl)
    } catch (error) {
      console.error(error)
    }
  }
}


export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // draw rotated image
  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement('canvas')

  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )
  
  // As a blob
  // return new Promise((resolve, reject) => {
  //   croppedCanvas.toBlob((file) => {
  //     resolve(URL.createObjectURL(file))
  //   }, 'image/jpeg')
  // })

  // As Base64 string
  // return croppedCanvas.toDataURL('image/jpeg')

  // As Uint8Array
  const dataUrl = croppedCanvas.toDataURL('image/jpeg')
  const base64Data = dataUrl.split(',')[1]
  const uint8Array = new Uint8Array(atob(base64Data).split('').map(char => char.charCodeAt(0)))
  return Array.from(uint8Array)
}

export async function urlToUint8Array(url) {
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    // Check if the content type is an image
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("image")) {
      throw new Error("The URL does not point to an image.");
    }

    const blob = await response.blob();

    // Compress the image
    const compressedBlob = await imageCompression(blob, {
      maxSizeMB: 1, // Limit the file size to 1MB
      maxWidthOrHeight: 800, // You can specify max width or height for resizing
      useWebWorker: true // Use Web Workers for better performance
    });

    // Convert the compressed image to Uint8Array
    const arrayBuffer = await compressedBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    return uint8Array;
  } catch (error) {
    // Error silencioso
    return new Uint8Array();
  }
}