import React, { useEffect, useState } from "react"
import { useCanister } from "@connect2ic/react"
import LogoDark from "../components/ui/LogoDark"
import { Seo } from "../components/utils/seo"
import useStore from "../store/useStore"
import Avatar from "../components/Avatar"
import Navigation from "../components/Navigation"
import CustomConnectButton from "../components/ui/CustomConnectButton"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { compressAndConvertImage, blobToImageUrl } from "../utils/imageManager"

const communitySchema = z.object({
    name: z.string().min(1, "Community name is required"),
    description: z.string().min(1, "Community description is required"),
    logo: z.any()
})

export default function Communities() {
    const myinfo = useStore((state) => state.myinfo)
    const [hobbi] = useCanister("hobbi")
    const [communities, setCommunities] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [logoPreview, setLogoPreview] = useState(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(communitySchema),
        defaultValues: {
            name: "",
            description: "",
            logo: []
        }
    })

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
            setCommunities([])
        } finally {
            setLoading(false)
        }
    }

    const handleLogoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const compressedLogo = await compressAndConvertImage(file, 20)
        setValue('logo', compressedLogo)
        setLogoPreview(compressedLogo)
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const result = await hobbi.createCommunity({
                logo: data.logo,
                name: data.name,
                description: data.description
            })
            debugger
            if (result.Ok) {
                await fetchCommunities()
                setIsModalOpen(false)
                reset()
                setLogoPreview(null)
            }
        } catch (e) {
            debugger
            // Error silencioso
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCommunities()
    }, [hobbi])
    console.log(communities, 'communities')
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
                            <h2 className="text-xl font-bold text-[#FDFCFF]">Create Community</h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false)
                                    reset()
                                    setLogoPreview(null)
                                }}
                                className="text-[#B577F7] hover:text-[#9B5FD9]"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                {logoPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(new Blob([logoPreview]))}
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
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className="w-full px-3 py-2 bg-[#1A2137] text-[#FDFCFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B577F7]"
                                    placeholder="Community name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#E1C9FB] mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("description")}
                                    className="w-full px-3 py-2 bg-[#1A2137] text-[#FDFCFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B577F7]"
                                    placeholder="Community description"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        reset()
                                        setLogoPreview(null)
                                    }}
                                    className="w-1/2 bg-[#1A2137] text-white px-4 py-2 rounded-md hover:bg-[#242e4a] transition-colors mt-4"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-1/2 bg-[#B577F7] text-white px-4 py-2 rounded-md hover:bg-[#9B5FD9] transition-colors mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {loading ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex w-full bg-[#070A10] max-h-full min-h-screen">
                <div className="flex flex-col w-[300px] h-full border border-[#0E1425]">
                    <div className="h-[86px] flex items-center justify-start pl-10">
                        <LogoDark />
                    </div>
                    <CustomConnectButton />
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
                        <h1 className="text-2xl font-bold text-[#FDFCFF]">Communities</h1>
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

                    <div className="w-full flex flex-col gap-4">
                        {communities.map((community) => (
                            <div
                                key={community.canisterId}
                                className="bg-[#0E1425] rounded-lg p-6 hover:bg-[#1A2137] transition-colors flex w-full"
                            >
                                <div className="w-28 h-28">
                                    <img
                                        src={blobToImageUrl(community.logo)}
                                        alt="Preview"
                                        className="h-28 w-28 object-contain rounded-[10px] mx-auto"
                                    />
                                </div>
                                <div className="flex flex-col w-full ml-3 gap-1">
                                    <span className="text-lg font-bold text-white">
                                        {community.name}
                                    </span>
                                    <span className="text-sm text-[#B577F7]">
                                        {String(community.membersQty).replace('n', '')} members
                                    </span>
                                    <p className="text-[#E1C9FB] mb-4 text-sm">
                                        {community.description}
                                    </p>
                                    {community.hashTags && community.hashTags.length > 0 && (
                                        <div className="flex gap-3 mb-4">
                                            {community.hashTags.map((tag, index) => (
                                                <span key={index} className="text-sm text-[#B577F7] bg-[#1A2137] px-2 py-1 rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
} 