import React, { useEffect, useRef, useState, useCallback} from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import { arrayBufferToImgSrc } from "../utils/image"
import LogoDark from "../components/ui/LogoDark"
import portada from "/images/portada.svg"
import CustomConnectButton from "../components/ui/CustomConnectButton"
import { useNavigate, useParams } from "react-router-dom"
import { Seo } from "../components/utils/seo"
import useStore from "../store/useStore"
import Avatar from "../components/Avatar"
import SearchAndPost from "../components/SearchAndPost"
import SearchDialog from "../components/SearchDialog"
import Hashtag from "../components/hashtag"
import Navigation from "../components/Navigation"
import createBucketActor from "../hooks/createBucketActor"

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
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);

    const observer = useRef();
    const loadMorePosts = async () => {
        console.log("solicitando mas post")
        if (!hasNext || loading) return;
        setLoading(true);
        try {
            const nextPage = currentPage + 1;
            const response = await hobbi.getMyFeed({
                qtyPerPage: 25,
                page: nextPage,
            });
            if (response) {
                setPostList(prev => [...prev, ...response.arr]);
                setHasNext(response.hasNext);
                setCurrentPage(nextPage);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const lastPostRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNext) {
                    loadMorePosts();
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasNext]
    );

    const handlePublicInfo = async (actor) => {
        try {
            setIsLoading(true);
            const response = await actor.getPublicInfo()
            if (response) {
                const responsePost = await actor.getPaginatePost({
                    qtyPerPage: 25,
                    page: currentPage,
                })
                setPostList(responsePost.arr)
                setMyInfo(response.Ok)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    }
    const handleFollowme = async () => {
        try {
            setIsLoading(true);
            const actor = await createBucketActor(id);
            const response = await actor.followMe();
            if (response) {
                setIsLoading(true);
                handlePublicInfo(actor)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    }
    const handleUnFollowme = async () => {
        try {
            setIsLoading(true);
            const actor = await createBucketActor(id);
            const response = await actor.unFollowMe();
            if (response) {
                setIsLoading(true);
                handlePublicInfo(actor)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {

                const actor = await createBucketActor(id);
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
        const actor = await createBucketActor(canisterId)

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
    return (
        <>
            <Seo
                title={`Hobbi.me | Profile`}
                description={
                    "Reinvent the way you socialize and own your information on the internet."
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
                                {myinfo.callerIsFollower ? (
                                    <div
                                        className={`flex justify-center items-center text-[#B577F7] border border-[#B577F7] h-8 w-20 rounded-lg ml-60 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={!isLoading ? handleUnFollowme : null} // Deshabilita el clic si está cargando
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-t-[#B577F7] border-[#f3f3f3] rounded-full animate-spin"></div>
                                        ) : (
                                            'Following'
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className={`flex justify-center items-center text-[#B577F7] border border-[#B577F7] h-8 w-20 rounded-lg ml-60 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={!isLoading ? handleFollowme : null} // Deshabilita el clic si está cargando
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-t-[#B577F7] border-[#f3f3f3] rounded-full animate-spin"></div>
                                        ) : (
                                            'Follow'
                                        )}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-medium text-[#B577F7] mt-2">
                                {Number(myinfo.followeds)} Following
                                <span className="text-sm font-medium text-[#B577F7] ml-4">
                                    {Number(myinfo.followers)} Followers
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
                                ref={index === postList.length - 1 ? lastPostRef : null}
                                className="flex  bg-[#0E1425] rounded-2xl w-[70%] px-5 pt-5 pb-3 ml-3 mt-4"
                            >
                                <img className="rounded-lg object-cover" src={item.image_url[0]} width="70px" />
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
                </div>
            </div>
        </>
    )
}
