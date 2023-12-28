import Compressor from "compressorjs"

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

export const resizeImage = async (file, maxWidth) => {
  return new Promise(resolve => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: maxWidth || DefauttMaxWidth,
      mimeType: "image/jpeg",
      success(result) {
        resolve(result)
      },
      error(err) {
        resolve(err)
      }
    })
  })
}

export async function getRotatedImage (imageSrc, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const orientationChanged =
    rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270
  if (orientationChanged) {
    canvas.width = image.height
    canvas.height = image.width
  } else {
    canvas.width = image.width
    canvas.height = image.height
  }

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(image, -image.width / 2, -image.height / 2)

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file))
    }, 'image/png')
  })
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

export function urlToUint8Array(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        return response.blob();
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          resolve(uint8Array);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsArrayBuffer(blob);
      })
      .catch(error => {
        reject(error);
      });
  });
}