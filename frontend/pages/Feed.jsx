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
import createBucketActor from "../hooks/createBucketActor"
import Avatar from "../components/Avatar"
import SearchAndPost from "../components/SearchAndPost"
import SearchDialog from "../components/SearchDialog"
import Hashtag from "../components/hashtag"
import Navigation from "../components/Navigation"

export default function Feed() {
    const { id } = useParams()
    const navigate = useNavigate()

    const setCanisterId = useStore((state) => state.setCanisterId)
    const setUsername = useStore((state) => state.setUsername)
    const setMyInfo = useStore((state) => state.setMyInfo)
    const canisterId = useStore((state) => state.canisterId)
    const username = useStore((state) => state.username)
    const myinfo = useStore((state) => state.myinfo)
    const [hobbi] = useCanister("hobbi")
    const [media, setMedia] = useState(null)
    const firstLoad = useRef(true)
    const [loading, setLoading] = useState(false)
    const [postList, setPostList] = useState([])
    const [hashtagRankingList, setHashtagRankingList] = useState([])
    const [selected, setSelected] = useState(1)
    const [selectedTheme, setSelectedTheme] = useState(1)
    const [textArea, setTextArea] = useState("")
    const handlePublicInfo = async (actor) => {
        try {
            const response = await actor.getMyInfo()
            if (response) {
                setMyInfo(response)
            }
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const result = await hobbi.signIn();

                if (result.Ok) {
                    if (result.Ok.name !== username) {
                        setUsername(result.Ok.name);
                    }

                    const newCanisterId = result.Ok.userCanisterId.toText();
                    setCanisterId(newCanisterId);

                    const actor = await createBucketActor(newCanisterId);
                    handlePublicInfo(actor);
                }
                const response = await hobbi.getMyFeed({
                    qtyPerPage: 10,
                    page: 0,
                });
                if (response) {
                    setPostList(response.arr)
                }
                const hashtagRanking = await hobbi.getRankingHashTags();
                if (hashtagRanking) {
                    setHashtagRankingList(hashtagRanking)
                }

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
    const formatBigIntToDate = (bigIntValue) => {
        const milliseconds = Number(bigIntValue / 1000000n);
        const date = new Date(milliseconds);
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayOfWeek = daysOfWeek[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const timeFormatted = date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return `${dayOfWeek}, ${day} ${month} ${year} | ${timeFormatted}`;
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
console.log(postList,'postList')
    return (
        <>
            <Seo
                title={`Hobbi.me | Loading profile`}
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
                    <div onClick={() => window.location.href = `/myprofile`} className="w-[266px] h-[148px] rounded-[16px] bg-[#0E1425] mt-5 ml-5 px-8 py-5 cursor-pointer">
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

                <div className="flex flex-col py-16 px-8">
                    <div className="flex gap-3 items-center">
                        <span className=" text-xl font-medium text-[#FDFCFF] ml-3">
                            Themes
                        </span>
                        <div className="flex gap-4 mt-3 ml-3">
                            <div
                                onClick={() => setSelectedTheme(1)}
                                className={`flex gap-4 items-center justify-center w-20 h-7 rounded-3xl cursor-pointer ${selectedTheme === 1
                                    ? "bg-[#4F239E] text-[#FDFCFF]"
                                    : "bg-[#FDFCFF] text-[#4F239E]"
                                    }`}
                            >
                                Books
                            </div>
                            <div
                                onClick={() => setSelectedTheme(2)}
                                className={`flex gap-4 items-center justify-center w-24 h-7 rounded-3xl cursor-pointer ${selectedTheme === 2
                                    ? "bg-[#4F239E] text-[#FDFCFF]"
                                    : "bg-[#FDFCFF] text-[#4F239E]"
                                    }`}
                            >
                                TV Shows
                            </div>
                            <div
                                onClick={() => setSelectedTheme(3)}
                                className={`flex gap-4 items-center justify-center w-28 h-7 rounded-3xl cursor-pointer ${selectedTheme === 3
                                    ? "bg-[#4F239E] text-[#FDFCFF]"
                                    : "bg-[#FDFCFF] text-[#4F239E]"
                                    }`}
                            >
                                Video Games
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col min-h-20 gap-6 py-4 items-center bg-[#B577F7] rounded-2xl px-3 w-full mt-5 ml-3">
                        <SearchDialog
                            isOpened={true}
                            setMedia={setMedia}
                            mediaType={selectedTheme}
                        />
                        {media && (
                            <div className="flex justify-start w-full gap-3">
                                <div className="rounded-xl">
                                    <img src={media.image} width="30px" />
                                </div>
                                <div className="flex flex-col justify-start items-start gap-3">
                                    <span className="text-xl font-bold text-[#FFFFFF]">
                                        {media.title}
                                    </span>
                                    <span className="text-lg font-medium text-[#FFFFFF]">
                                        {media.sub}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center bg-[#FDFCFF] rounded-lg px-2 py-1 h-12  w-full">
                            <Avatar avatarData={myinfo.avatar} size="small" />

                            <input
                                type="text"
                                value={textArea}
                                onChange={(e) => setTextArea(e.target.value)}
                                placeholder="Share with us"
                                className="flex-grow bg-transparent focus:outline-none text-gray-700 pl-2"
                            />
                            {textArea !== "" && (
                                <div
                                    className="ml-2 hover:cursor-pointer"
                                    onClick={() => handleCreatePost()}
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3.47779 2.40479C3.21306 2.32789 2.92747 2.40242 2.73407 2.59889C2.54068 2.79536 2.47066 3.08209 2.55174 3.34558L4.98402 11.2505H13.4998C13.914 11.2505 14.2498 11.5863 14.2498 12.0005C14.2498 12.4147 13.914 12.7505 13.4998 12.7505H4.98403L2.55183 20.6551C2.47076 20.9186 2.54077 21.2054 2.73417 21.4018C2.92756 21.5983 3.21315 21.6728 3.47789 21.5959C10.1765 19.6499 16.3972 16.5819 21.923 12.6092C22.119 12.4683 22.2352 12.2416 22.2352 12.0002C22.2352 11.7588 22.119 11.5322 21.923 11.3913C16.3971 7.41866 10.1764 4.3507 3.47779 2.40479Z"
                                            fill="#B577F7"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="text-sm font-medium text-[#FDFCFF] ml-3 mt-2">
                        Most commented topics
                    </span>
                    <div className="flex gap-3 mt-3 ml-3">
                        {hashtagRankingList.length > 0 && (
                            hashtagRankingList.map((tag, index) => <Hashtag key={index} name={tag} />)
                        )}
                    </div>
                    {postList.length > 0 &&
                        postList.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col  bg-[#0E1425] rounded-2xl w-[70%] px-5 pt-5 pb-3 ml-3 mt-4 w-full"
                            >
                                <div className="flex justify-between">
                                    <span
                                        onClick={() => window.location.href = `/profile/${item.autor.toText()}`}
                                        className="text-sm font-medium text-[#FDFCFF] cursor-pointer"
                                    >
                                        @{item.userName}
                                    </span>
                                    <span className="text-sm font-medium text-[#BCBCBC]">{formatBigIntToDate(item.date)}</span>
                                </div>

                                <span className="text-sm font-bold text-[#FDFCFF]">
                                    {item.title}
                                </span>
                                <span className="text-sm font-medium text-[#FDFCFF]">
                                    {item.body}
                                </span>
                                <div className="flex gap-3 mt-2">
                                    {item.hashTags.length > 1 && (
                                        item.hashTags.map((tag, index) => <Hashtag key={index} name={tag} />)
                                    )}
                                </div>
                                <img className="mt-3 rounded-md" src={item.image_url[0]} width="100px" />
                            </div>
                        ))}
                    <CustomConnectButton />
                </div>
            </div>
        </>
    )
}
