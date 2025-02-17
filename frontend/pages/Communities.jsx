import React, { useEffect, useState } from "react"
import { useCanister } from "@connect2ic/react"
import LogoDark from "../components/ui/LogoDark"
import { Seo } from "../components/utils/seo"
import useStore from "../store/useStore"
import Avatar from "../components/Avatar"
import Navigation from "../components/Navigation"

export default function Communities() {
    const myinfo = useStore((state) => state.myinfo)
    const [hobbi] = useCanister("hobbi")
    const [communities, setCommunities] = useState([])

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                // Here you would fetch communities data from your canister
                // For now using placeholder data
                setCommunities([
                    {
                        id: 1,
                        name: "Gamers Unite",
                        members: 1234,
                        description: "A community for gaming enthusiasts"
                    },
                    {
                        id: 2,
                        name: "Book Club",
                        members: 567,
                        description: "Discuss your favorite books"
                    },
                    {
                        id: 3,
                        name: "Movie Buffs",
                        members: 890,
                        description: "For cinema lovers"
                    }
                ])
            } catch (error) {
                console.error("Error fetching communities:", error)
            }
        }

        fetchCommunities()
    }, [hobbi])

    return (
        <>
            <Seo
                title={`Hobbi.me | Comunidades`}
                description={"Explora y únete a comunidades con intereses similares"}
                type={"webapp"}
                name={"Hobbi"}
                rel={"https://hobbi.me/communities"}
            />

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
                    <h1 className="text-2xl font-bold text-[#FDFCFF] mb-8">Comunidades</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {communities.map((community) => (
                            <div 
                                key={community.id}
                                className="bg-[#0E1425] rounded-lg p-6 hover:bg-[#1A2137] transition-colors"
                            >
                                <h2 className="text-xl font-bold text-[#B577F7] mb-2">
                                    {community.name}
                                </h2>
                                <p className="text-[#E1C9FB] mb-4">
                                    {community.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#BCBCBC]">
                                        {community.members} miembros
                                    </span>
                                    <button className="bg-[#B577F7] text-white px-4 py-2 rounded-md hover:bg-[#9B5FD9] transition-colors">
                                        Unirse
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
} 