import React, { useEffect, useRef, useState } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import { arrayBufferToImgSrc } from "../utils/image"
import LogoDark from "../components/ui/LogoDark"
import portada from "/images/portada.svg"
import CustomConnectButton from "../components/ui/CustomConnectButton"
import { useNavigate, useParams } from "react-router-dom"
import { Seo } from "../components/utils/seo"
import useStore from "../store/useStore"
import crearActorParaBucket from "../hooks/crearActorParaBucket"
import Avatar from "../components/Avatar"
import SearchAndPost from "../components/SearchAndPost"
import SearchDialog from "../components/SearchDialog"
import Hashtag from "../components/hashtag"

export default function ProfileInfo() {
    const { id } = useParams()
    const navigate = useNavigate()

    const setCanisterId = useStore((state) => state.setCanisterId)
    const setUsername = useStore((state) => state.setUsername)
    const setMyInfo = useStore((state) => state.setMyInfo)
    const canisterId = useStore((state) => state.canisterId)
    const username = useStore((state) => state.username)
    const myinfo = useStore((state) => state.myinfo)
    const [nft] = useCanister("nft")
    const [post] = useCanister("post")
    const [hobbi] = useCanister("hobbi")
    const { principal } = useConnect()
    const [media, setMedia] = useState(null)
    const [mediaType, setMediaType] = useState(1)
    const firstLoad = useRef(true)
    const [loading, setLoading] = useState(false)
    const [postList, setPostList] = useState([])
    const [selected, setSelected] = useState(1)
    const [bucketActor, setBucketActor] = useState(null)
    const [selectedTheme, setSelectedTheme] = useState(1)
    const [textArea, setTextArea] = useState("")
    const handlePublicInfo = async (actor) => {
        try {
            const response = await actor.getPublicInfo()
            debugger
            if (response) {
                const responsePost = await actor.getPaginatePost({
                    qtyPerPage: 10,
                    page: 0,
                })
                setPostList(responsePost.arr)
                setMyInfo(response.Ok)
            }
        } catch (e) {
            console.error(e)
        }
    }
    const handleFollowme = async () => {
        try {
            const actor = await crearActorParaBucket(id);
            const response = await actor.followMe();
        } catch (e) {
            console.error(e)
        }
    }
    const handleUnFollowme = async () => {
        try {
            const actor = await crearActorParaBucket(id);
            const response = await actor.unFollowMe();
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {

                const actor = await crearActorParaBucket(id);
                handlePublicInfo(actor);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        if (firstLoad.current) {
            fetchData()
            firstLoad.current = false
        }
    }, [hobbi, setCanisterId, setUsername, username, canisterId])

    const handleClick = (url, index) => {
        setSelected(index)
        navigate(url)
    }
    const mediaTypeMap = {
        1: "Book",
        2: "Tv",
        3: "Game",
    }
    const handleCreatePost = async () => {
        const actor = await crearActorParaBucket(canisterId)

        try {
            const hashtagRegex = /#(\w+)/g;
            const hashtags = [];
            let match;
            let cleanedText = textArea;

            while ((match = hashtagRegex.exec(textArea)) !== null) {
                hashtags.push(match[1]);
            }

            cleanedText = textArea.replace(hashtagRegex, "").trim();

            const json = {
                access: { Public: null },
                title: media?.title,
                body: cleanedText,
                image: [],
                imagePreview: [],
                hashTags: hashtags,
                image_url: [media?.image],
                media_type: { [mediaTypeMap[selectedTheme]]: null },
            }
            const response = await actor.createPost(json)
            const responsePost = await actor.getPaginatePost({
                qtyPerPage: 10,
                page: 0,
            })
            setMedia(null)
            setTextArea("")
            setPostList(responsePost.arr)
        } catch (e) {
            console.error(e)
        }
    }
    console.log(id, 'iddddddddd');
    return (
        <>
            <Seo
                title={`Hobbi.me | Cargando perfil`}
                description={
                    "Reinventa la forma de socializar y se el dueño de tú información en internet."
                }
                type={"webapp"}
                name={"Hobbi"}
                rel={"https://hobbi.me/profile"}
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
                                    12K
                                </span>
                                <span className="text-[10px] font-normal text-[#E1C9FB]">
                                    Post
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 ml-5 mt-8">
                        <div
                            className="flex gap-4 hover:cursor-pointer"
                            onClick={() => handleClick("/inicio", 1)}
                        >
                            <div
                                className={`flex items-center justify-center h-6 w-6 rounded-md ${selected === 1 ? "bg-[#B577F7]" : "bg-[#0E1425]"
                                    }`}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.6875 8.00012L7.40338 1.28424C7.73288 0.954733 8.26712 0.954733 8.59662 1.28424L15.3125 8.00012M2.375 6.31262V13.9064C2.375 14.3724 2.75276 14.7501 3.21875 14.7501H6.3125V11.0939C6.3125 10.6279 6.69026 10.2501 7.15625 10.2501H8.84375C9.30974 10.2501 9.6875 10.6279 9.6875 11.0939V14.7501H12.7812C13.2472 14.7501 13.625 14.3724 13.625 13.9064V6.31262M5.1875 14.7501H11.375"
                                        stroke={selected === 1 ? "#F7EFFF" : "#505CE6"}
                                        strokeWidth="1.125"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <span
                                className={`text-base font-bold ${selected === 1 ? "text-[#B577F7]" : "text-[#505CE6]"
                                    }`}
                            >
                                Inicio
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col py-24 px-8">
                    <div className="h-[214px] rounded-3xl w-full">
                        <img src={portada} alt="Portada" />
                    </div>
                    <div className="flex pt-7 pl-3 h-24">
                        <div className="relative -top-14">
                            <Avatar
                                avatarData={myinfo.avatar}
                                version="square"
                                size="large"
                            />
                        </div>
                        <div className="flex flex-col pl-5">
                            <div className="flex justify-between">
                                <span className="text-xl font-bold text-[#FFFFFF]">
                                    {myinfo.name}
                                </span>
                                {myinfo.callerIsFollower ?
                                    <div className="flex justify-center items-center text-[#B577F7] border border-[#B577F7] h-8 w-20 rounded-lg ml-60 cursor-pointer " onClick={handleUnFollowme}>Seguido</div> :
                                    <div className="flex justify-center items-center text-[#B577F7] border border-[#B577F7] h-8 w-20 rounded-lg ml-60 cursor-pointer " onClick={handleFollowme}>Seguir</div>
                                }

                            </div>
                            <span className="text-sm font-medium text-[#B577F7] mt-2">
                                {Number(myinfo.followeds)} Seguidos
                                <span className="text-sm font-medium text-[#B577F7] ml-4">
                                    {Number(myinfo.followers)} Seguidores
                                </span>
                            </span>
                        </div>
                    </div>
                    <span className="text-sm font-medium text-[#FDFCFF] w-1/2 ml-3 mb-3 ">
                        {myinfo.bio}
                    </span>
                    {postList.length > 0 &&
                        postList.map((item, index) => (
                            <div
                                key={index}
                                className="flex  bg-[#0E1425] rounded-2xl w-[70%] px-5 pt-5 pb-3 ml-3 mt-4"
                            >
                                <img src={item.image_url[0]} width="40px" />
                                <div className="flex flex-col gap-2 pl-3">
                                    <span className="text-sm font-bold text-[#FDFCFF]">
                                        {item.title}
                                    </span>
                                    <span className="text-sm font-medium text-[#FDFCFF]">
                                        {item.body}
                                    </span>
                                    <div className="flex gap-3 ">
                                        {item.hashTags.length > 1 && (
                                            item.hashTags.map((tag, index) => <Hashtag key={index} name={tag} />)
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    <CustomConnectButton />
                </div>
            </div>
        </>
    )
}
