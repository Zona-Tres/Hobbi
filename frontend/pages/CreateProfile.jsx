import React, {useState, useEffect} from "react";
import { useDropzone } from "react-dropzone"
import { useCanister } from "@connect2ic/react";

import Header from "../components/ui/Header";
import { resizeImage, fileToCanisterBinaryStoreFormat } from "../utils/image";

function CreateProfile() {
    const [nft] = useCanister("nft");
    const [file, setFile] = useState(null);

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
              setFile(newFile)
            } catch (error) {
              console.error(error)
            }
          }
        }
    })

		const handleSubmit = async (e) => {
			console.log(e.target)
		}

    return(
		<>
			{/* <Header /> */}
			<div className="mt-2">
				<form onSubmit={handleSubmit}>
					<label htmlFor="nickname">Nickname:</label>
					<input id="nickname" required className="border border-gray-500 px-2" type="text"/>

					<button className="w-full" {...getRootProps({ className: "dropzone" })}>
							<p className="bg-gray-950 hover:bg-gray-900 text-white p-2">Pick an image</p>
							<input required {...getInputProps()} />
					</button>
					<p className="mt-2 border-b border-gray-500">{file ? file.name : "No file selected"}</p>
				</form>
			</div>
    </>
		)
}

export default CreateProfile