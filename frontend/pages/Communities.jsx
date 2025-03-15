import React, { useEffect, useState } from "react"
import { useCanister } from "@connect2ic/react"
import LogoDark from "../components/ui/LogoDark"
import { Seo } from "../components/utils/seo"
import useStore from "../store/useStore"
import Avatar from "../components/Avatar"
import Navigation from "../components/Navigation"
import imageCompression from "browser-image-compression"

export default function Communities() {
    const myinfo = useStore((state) => state.myinfo)
    const [hobbi] = useCanister("hobbi")
    const [communities, setCommunities] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [communityName, setCommunityName] = useState("")
    const [communityDescription, setCommunityDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [logo, setLogo] = useState([])

    const fetchCommunities = async () => {
        try {
            setLoading(true)
            const response = await hobbi.getPaginateCommunities({
                qtyPerPage: 10,
                page: 0,
            })
            if (response && response.Ok) {
                setCommunities(response.Ok.arr || [])
            } else {
                setCommunities([])
            }
        } catch (error) {
            console.error("Error fetching communities:", error)
            setCommunities([])
        } finally {
            setLoading(false)
        }
    }

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
    
                const maxWidth = 300; 
                const maxHeight = 300; 
    
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
                        if (blob.size > 60 * 1024 && quality > 0.1) {
                            quality -= 0.1; // Reducir calidad
                            compressImage();
                        } else {
                            const reader = new FileReader();
                            reader.readAsArrayBuffer(blob);
                            reader.onload = () => {
                                const uint8Array = new Uint8Array(reader.result);
                                setLogo(uint8Array);
                            };
                        }
                    }, "image/jpeg", quality);
                };
    
                compressImage();
            };
        };
    };

    const handleCreateCommunity = async () => {
        if (!communityName || !communityDescription) return;
        
        try {
            setLoading(true)
            const result = await hobbi.createCommunity({
                logo: logo,
                name: communityName, 
                description: communityDescription
            })
            
            if (result.Ok) {
                await fetchCommunities() // Refresh the communities list
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
            setCommunityName("")
            setCommunityDescription("")
            setIsModalOpen(false)
        }
    }

    useEffect(() => {
        fetchCommunities()
    }, [hobbi])
    return (
        <>
            <Seo
                title={`Hobbi.me | Communities`}
                description={"Explore and join communities with similar interests"}
                type={"webapp"}
                name={"Hobbi"}
                rel={"https://hobbi.me/communities"}
            />


            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#0E1425] rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#FDFCFF]">Crear Comunidad</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-[#B577F7] hover:text-[#9B5FD9]"
                                >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>

                                {logo.length > 0 && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(new Blob([logo]))}
                                            alt="Preview"
                                            className="w-[300px] h-[200px] object-cover rounded-[10px] mx-auto"
                                        />
                                    </div>
                                )}
                                <label className="block text-sm font-medium text-[#E1C9FB] mb-1">
                                    Logo
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="w-full px-3 py-2 bg-[#1A2137] text-[#FDFCFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B577F7]"
                                    />
                                <label className="block text-sm font-medium text-[#E1C9FB] mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={communityName}
                                    onChange={(e) => setCommunityName(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#1A2137] text-[#FDFCFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B577F7]"
                                    placeholder="Nombre de la comunidad"
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#E1C9FB] mb-1">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    value={communityDescription}
                                    onChange={(e) => setCommunityDescription(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#1A2137] text-[#FDFCFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B577F7]"
                                    placeholder="Descripción de la comunidad"
                                    />
                            </div>
                            <button
                                onClick={handleCreateCommunity}
                                disabled={loading || !communityName || !communityDescription}
                                className={`w-full bg-[#B577F7] text-white px-4 py-2 rounded-md hover:bg-[#9B5FD9] transition-colors mt-4 ${
                                    (loading || !communityName || !communityDescription) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex w-full bg-[#070A10] max-h-full min-h-screen">
                <div className="flex flex-col w-[300px] h-full border border-[#0E1425]">
                    <div className="h-[86px] flex items-center justify-start pl-10">
                        <LogoDark />
                    </div>
                    <div className="w-[266px] h-[148px] rounded-[16px] bg-[#0E1425] mt-5 ml-5 px-8 py-5">
                        <div className="flex justify-start gap-4 items-center">
                            <Avatar avatarData={myinfo.avatar} />
                            <span className="text-md font-bold text-[#B577F7]">
                                @{myinfo.name}
                            </span>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-[16px] font-bold text-[#E1C9FB]">
                                    {Number(myinfo.followers)}
                                </span>
                                <span className="text-[10px] font-normal text-[#E1C9FB]">
                                    Follower
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[16px] font-bold text-[#E1C9FB]">
                                    {Number(myinfo.followeds)}
                                </span>
                                <span className="text-[10px] font-normal text-[#E1C9FB]">
                                    Following
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[16px] font-bold text-[#E1C9FB]">
                                    {Number(myinfo.postQty)}
                                </span>
                                <span className="text-[10px] font-normal text-[#E1C9FB]">
                                    Post
                                </span>
                            </div>
                        </div>
                    </div>
                    <Navigation />
                </div>

                <div className="flex flex-col py-16 px-8 w-full">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-[#FDFCFF]">Comunidades</h1>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#B577F7] text-white px-4 py-2 rounded-md hover:bg-[#9B5FD9] transition-colors"
                        >
                            Create
                        </button>
                    </div>
                    
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="w-8 h-8 border-4 border-[#B577F7] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {communities.map((community) => (
                            <div 
                                key={community.canisterId}
                                className="bg-[#0E1425] rounded-lg p-6 hover:bg-[#1A2137] transition-colors"
                                >
                                <h2 className="text-xl font-bold text-[#B577F7] mb-2">
                                    {community.name}
                                </h2>
                                <p className="text-[#E1C9FB] mb-4">
                                    {community.description}
                                </p>
                                <div className="mt-2">
                                    <img
                                        src={URL.createObjectURL(new Blob([community.logo]))}
                                        alt="Preview"
                                        className="w-[300px] h-[200px] object-cover rounded-[10px] mx-auto"
                                    />
                                </div>
                                {community.hashTags && community.hashTags.length > 0 && (
                                    <div className="flex gap-3 mb-4">
                                        {community.hashTags.map((tag, index) => (
                                            <span key={index} className="text-sm text-[#B577F7] bg-[#1A2137] px-2 py-1 rounded">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#BCBCBC]">
                                        {String(community.membersQty).replace('n', '')} miembros
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
} 