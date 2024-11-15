import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import Cropper from "react-easy-crop"
import imageCompression from "browser-image-compression"
import { FiZoomIn, FiRotateCcw } from "react-icons/fi"
import {
  FaUser,
  FaBookOpen,
  FaImage,
  FaCropAlt,
  FaExchangeAlt,
} from "react-icons/fa"
import { getOrientation } from "get-orientation/browser"
import {
  ORIENTATION_TO_ANGLE,
  ImageMaxWidth,
  resizeImage,
  getRotatedImage,
  readFileToUrl,
  getCroppedImg,
  urlToUint8Array,
  arrayBufferToImgSrc,
} from "../utils/image"
import Particles from "../components/Particles"
import Illustration from "/images/img-create-profile.svg"
import Header from "../components/ui/Header"
import { useNavigate } from "react-router-dom"
import { Seo } from "../components/utils/seo"
import iconArrow from "/images/iconArrow.svg"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Definir el esquema de validación de Zod
const profileSchema = z.object({
  username: z.string().nonempty("Username is required"),
  bio: z.string().nonempty("Bio is required"),
  picture: z.any().optional(),
})

function CreateProfile() {
  const [nft, { loading }] = useCanister("nft")
  const [hobbi] = useCanister("hobbi")
  const { principal } = useConnect()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const [file, setFile] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        try {
          const firstFile = acceptedFiles[0]

          const orientation = await getOrientation(firstFile)
          const rotation = ORIENTATION_TO_ANGLE[orientation]

          const compressedFile = await resizeImage(firstFile, ImageMaxWidth)

          let imageDataUrl = await readFileToUrl(compressedFile)

          if (rotation) {
            imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
          }

          setFile(imageDataUrl)
        } catch (error) {
          console.error(error)
        }
      }
    },
  })

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        file,
        croppedAreaPixels,
        rotation,
      )
      setCroppedImage(croppedImage)
      setFile(null)
    } catch (e) {
      console.error(e)
    }
  }

  // Configuración de React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  })
  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1])
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0]
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i)
    }

    return new Blob([uint8Array], { type: mimeString })
  }

  const uint8ArrayToBlob = (uint8Array, mimeType) => {
    return new Blob([uint8Array], { type: mimeType })
  }
  const arrayBufferToUint8Array = (arrayBuffer) => {
    return new Uint8Array(arrayBuffer) // Convierte el ArrayBuffer a Uint8Array
  }
  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      let imageBlob = null

      // Comprobamos que croppedImage sea un Uint8Array
      let uint8Array = null
      if (ArrayBuffer.isView(croppedImage)) {
        uint8Array = croppedImage // Si ya es un Uint8Array, lo usamos
      } else if (Array.isArray(croppedImage)) {
        uint8Array = new Uint8Array(croppedImage) // Convertimos el array regular en un Uint8Array
      } else {
        console.error("croppedImage is not a valid type")
        return // Salimos si el tipo no es válido
      }

      // Convertir el Uint8Array en un Blob
      imageBlob = uint8ArrayToBlob(uint8Array, "image/jpeg")

      // Comprimir la imagen
      const compressedImageBlob = await imageCompression(imageBlob, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        initialQuality: 1,
      })

      // Convertir el Blob comprimido en un Uint8Array
      const arrayBuffer = await compressedImageBlob.arrayBuffer()
      const croppedImageArray = new Uint8Array(arrayBuffer)

      // Preparar los datos del perfil
      const profileData = {
        bio: data.bio,
        name: data.username,
        thumbnail: [], // Si no tienes un thumbnail, lo puedes dejar vacío como en el ejemplo anterior
        email: [],
        avatar: [croppedImageArray], // Aquí estamos enviando un array que contiene el Uint8Array
      }

      // Enviar los datos del perfil
      await hobbi.signUp(profileData).then((result) => {
        
        if (result) {
          
         navigate('/profile/{principal}') 
        }
      })
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const loadingSvg = () => (
    <svg
      className="inline w-6 h-6 text-gray-200 animate-spin fill-purple-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="https://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  )

  return (
    <>
      <Seo
        title={"Hobbi.me | Crear perfil"}
        description={
          "Reinventa la forma de socializar y sé el dueño de tu información en internet."
        }
        type={"webapp"}
        name={"Hobbi"}
        rel={"https://hobbi.me/create-profile"}
      />
      <div className="flex flex-col min-h-screen w-full overflow-hidden relative">
        <section className="absolute inset-0">
          <img
            src={Illustration}
            alt="Hero Illustration"
            className="w-full h-full object-cover"
          />
        </section>

        <div className="fixed z-20 flex flex-col w-[414px] min-h-[395px] justify-start p-6 rounded-3xl border border-[#E2E8F0] bg-[#F7EFFF] top-1/2 right-8 transform -translate-y-1/2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-start justify-start space-y-4"
          >
            {!file && (
              <div className="space-y-2 w-full flex">
                {croppedImage && (
                  <div className="w-16 h-16 rounded-full overflow-hidden inline-block">
                    <img
                      src={arrayBufferToImgSrc(croppedImage)}
                      className="w-full h-full object-cover mb-2"
                    />
                  </div>
                )}
                <div
                  {...getRootProps({ className: "dropzone" })}
                  className="hover:cursor-pointer h-10 w-[123px] rounded-md bg-[#FFFFFF] border-[#E2E8F0] flex items-center justify-center "
                >
                  <p>Upload photo</p>
                  <input name="picture" {...getInputProps()} />
                </div>
              </div>
            )}
            {file && !croppedImage && (
              <>
                <span className="flex items-center justify-start space-x-2 w-full">
                  <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900">
                    Crop your picture
                  </p>
                </span>
                <div className="relative w-96 h-72">
                  <Cropper
                    image={file}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="flex items-center w-full space-x-2">
                  <FiZoomIn className="inline text-purple-800" />
                  <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900">
                    Zoom
                  </p>
                  <input
                    className="w-full"
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                  />
                </div>
                <div className="flex items-center w-full space-x-2">
                  <FiRotateCcw className="inline text-purple-800" />
                  <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900">
                    Rotation
                  </p>
                  <input
                    className="w-full"
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(e.target.value)}
                  />
                </div>
                <div className="flex w-full justify-between items-center">
                  <div className="flex gap-2">
                    <img src={iconArrow} />
                    <span className="text-sm font-normal text-[#B577F7]">
                      Atras
                    </span>
                  </div>

                  <div
                    onClick={showCroppedImage}
                    className="hover:cursor-pointer h-10 w-20 flex items-center justify-center rounded-md bg-[#B577F7] text-white hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out"
                  >
                    <span className="text-sm font-medium text-white">
                      Aplicar{" "}
                    </span>
                  </div>
                </div>
              </>
            )}
            {!file && (
              <>
                <div className="space-y-2 w-full">
                  <label htmlFor="username" className="font-medium text-sm">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500">
                      @
                    </span>
                    <input
                      id="username"
                      className="h-9 w-full rounded-md border border-[#CBD5E1] pl-6"
                      type="text"
                      {...register("username")}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 w-full">
                  <label
                    htmlFor="bio"
                    className="font-medium text-sm rounded-md"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    className="rounded-md w-full h-20 border border-[#CBD5E1]"
                    {...register("bio")}
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-xs">{errors.bio.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-28 flex items-center justify-center rounded-md bg-[#B577F7] text-white hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out"
                >
                  {isLoading ? (
                    loadingSvg()
                  ) : (
                    <span className="text-sm font-medium text-white">
                      Crear perfil
                    </span>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateProfile
