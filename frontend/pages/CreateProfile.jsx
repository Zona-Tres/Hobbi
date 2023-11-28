import React, {useState } from "react"
import { useDropzone } from "react-dropzone"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"

import Cropper from 'react-easy-crop'
import { FiZoomIn, FiRotateCcw } from "react-icons/fi";
import { FaUser, FaBookOpen, FaImage, FaCropAlt, FaExchangeAlt } from "react-icons/fa"
import { getOrientation } from 'get-orientation/browser'
import { 
  ORIENTATION_TO_ANGLE, ImageMaxWidth, resizeImage, getRotatedImage, 
  readFileToUrl, getCroppedImg, urlToUint8Array } from "../utils/image"

import Particles from '../components/Particles'
import Illustration from '/images/glow-bottom.svg'
import Header from "../components/ui/Header"
import { useNavigate } from "react-router-dom"

function CreateProfile() {
    const [nft, {loading}] = useCanister("nft")
    const {principal} = useConnect()
    const navigate = useNavigate();

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
          "image/jpeg": [".jpg", ".jpeg"]
        },
        onDrop: async acceptedFiles => {
          if (acceptedFiles.length > 0) {
            try {
              const firstFile = acceptedFiles[0]
              const newFile = await resizeImage(firstFile, ImageMaxWidth)
              let imageDataUrl = await readFileToUrl(newFile)

              const orientation = await getOrientation(firstFile)
              const rotation = ORIENTATION_TO_ANGLE[orientation]
              if (rotation) {
                imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
              }
              setFile(imageDataUrl)
            } catch (error) {
              console.error(error)
            }
          }
        }
    })

    const showCroppedImage = async () => {
      try {
        const croppedImage = await getCroppedImg(
          file,
          croppedAreaPixels,
          rotation
        )
        console.log('done', { croppedImage })
        setCroppedImage(croppedImage)
        setFile(null)
      } catch (e) {
        console.error(e)
      }
    }

		const handleSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)

      const fileArray = await urlToUint8Array(croppedImage)
      const minter = Principal.fromText(principal)
      const nftMetadata = [
        {
          data: Array.from(fileArray),
          purpose: {Rendered: null},
          key_val_data:
          [
            {key: "user", val: {TextContent: e.target[0].value}},
            {key: "bio", val: {TextContent: e.target[1].value}},
            {key: "post", val: {BlobContent: []}},
            {key: "helps", val: {Nat8Content: 0}}
          ]
        }
      ]

      try {
        await nft.mintDip721(minter, nftMetadata).then((result) => {
          if(result.Ok) {
            navigate('/dashboard')
          } else {
            
          } 
        })
      } catch (e) {

      } finally {
        setIsLoading(false)
      }
      
		}

    const loadingSvg = () => {
      return (
        <svg className="inline w-6 h-6 text-gray-200 animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="https://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      )
    }

    return(
      <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <Header />
      <section className="relative grow">
        {/* Particles */}
        <Particles className="absolute inset-0 z-10" />

        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
            <img src={Illustration} className="max-w-none" width={2146} alt="Hero Illustration" />
          </div>
        </div>


        {/* Content */}
        <div className="relative z-20 flex flex-col w-full items-center justify-center min-h-screen p-20">
          <h1 className="h2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900/60 via-slate-800 to-slate-700/60 pb-4 mb-4 px-40 text-center">Tu experiencia en Hobbi inicia creando tu perfil!</h1>
          <div className="w-[32rem] rounded-3xl bg-slate-100 items-center py-10 px-10 bg-opacity-40 border border-purple-800">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-4">
              <div className="space-y-2 w-full">
                <span className="flex items-center justify-start space-x-2">
                  <FaUser className="inline text-purple-800"/>
                  <label htmlFor="nickname" className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900"> Pick a nickname</label>
                </span>
                <input id="nickname" required className="border border-gray-500 px-2 w-full rounded-full outline-purple-950" type="text"/>
              </div>
              <div className="space-y-2 w-full">
                <span className="flex items-center justify-start space-x-2">
                  <FaBookOpen className="inline text-purple-800"/>
                  <label htmlFor="bio" className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900">Tell the world about yourself!</label>
                </span>
                <textarea id="bio" required className="border border-gray-500 p-2 w-full rounded-2xl outline-purple-950" type="text"/>
              </div>
              {!file && !croppedImage && 
              <div className="space-y-2 w-full">
                <span className="flex items-center justify-start space-x-2 w-full mb-2">
                  <FaImage className="inline text-purple-800"/>
                  <label htmlFor="picture" className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900">Upload an avatar</label>
                </span>
                <div {...getRootProps({ className: "dropzone" })} className="hover:cursor-pointer hover:border-slate-800 w-full h-96 border-2 border-dashed border-purple-900 flex items-center justify-center">
                  <p>Drop your picture or click to browse your files</p>
                  <input name="picture" {...getInputProps()} />
                </div>
              </div>}
              {file && !croppedImage &&
              <>
                <span className="flex items-center justify-start space-x-2 w-full">
                  <FaCropAlt className="inline text-purple-800"/>
                  <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900">Crop your picture</p>
                </span>   
                <div className="relative w-96 h-96 ">
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
                    <FiZoomIn className="inline text-purple-800"/>
                    <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900">Zoom</p>
                    <input className="w-full" type="range" min={1} max={3} step={0.1} value={zoom} onChange={e => setZoom(e.target.value)}/>
                  </div>
                  <div className="flex items-center w-full space-x-2">
                    <FiRotateCcw className="inline text-purple-800"/>
                    <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900">Rotation</p>
                    <input className="w-full" type="range" min={0} max={360} step={1} value={rotation} onChange={e => setRotation(e.target.value)}/>
                  </div>
                  <a className="btn-sm cursor-pointer w-full text-slate-50 bg-slate-900 hover:bg-slate-700 transition duration-150 ease-in-out" onClick={showCroppedImage}>Show Result</a>                  
              </>}
              {croppedImage &&
              <div className="w-full space-y-2">
                <span className="flex items-center justify-start space-x-2 w-full mb-2">
                  <FaImage className="inline text-purple-800"/>
                  <label htmlFor="picture" className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900">Upload an avatar</label>
                </span>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <img src={croppedImage} width={250} className="mb-2"/>
                  <a {...getRootProps({ className: "dropzone" })} className="btn-sm cursor-pointer w-full text-slate-50 bg-slate-900 hover:bg-slate-700 transition duration-150 ease-in-out">
                    <span className="flex items-center justify-start">
                      <FaExchangeAlt className="inline mr-2"/>
                      <p className="text-white">Change</p>
                    </span>
                    <input name="picture" {...getInputProps()} />
                  </a>
                </div>
              </div>}
              <span className="border-b border-purple-800 mt-2 w-full"/>
              <button type="submit" disabled={isLoading} className="btn-sm w-full px-4 py-2 text-slate-300 hover:text-white transition duration-150 ease-in-out group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none">
                {isLoading ? loadingSvg() : 
                  <span className="relative inline-flex items-center text-xl">
                    <svg className="shrink-0 fill-slate-300 mr-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                      <path d="m1.999 0 1 2-1 2 2-1 2 1-1-2 1-2-2 1zM11.999 0l1 2-1 2 2-1 2 1-1-2 1-2-2 1zM11.999 10l1 2-1 2 2-1 2 1-1-2 1-2-2 1zM6.292 7.586l2.646-2.647L11.06 7.06 8.413 9.707zM0 13.878l5.586-5.586 2.122 2.121L2.12 16z" />
                    </svg>
                    Crear perfil
                  </span>
                }
              </button>
            </form>
          </div>
        </div>
        </section>
      </div>
		)
}

export default CreateProfile