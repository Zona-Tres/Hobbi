import React, {useState, useEffect} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from '@dfinity/principal';

export default function RequireAuth(){
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(localStorage.getItem("hobbi_has_profile"))
  const { isConnected, principal } = useConnect()
  const [nft] = useCanister("nft")

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await nft.getTokenIdsForUserDip721(Principal.fromText(principal))

        if(response.length > 0) {
          setHasProfile(true)
          localStorage.setItem("hobbi_has_profile", true)
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      } finally {
        console.log('finished...')
        setLoading(false)
      }
    };

    if(isConnected && !hasProfile) {
      console.log("checking..")
      checkProfile()
    } else {setLoading(false)}

  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return isConnected ? (hasProfile ?
    <Outlet />
  : <Navigate to="/create-profile" state={{ from: location }} replace />)
  : <Navigate to="/connect" state={{ from: location }} replace />
}
