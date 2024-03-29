import React, {useState, useEffect} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from '@dfinity/principal';

export default function RequireAuth(){
  const location = useLocation()
  const { isConnected, principal } = useConnect()
  const [nft] = useCanister("nft")
  const [hasProfile, setHasProfile] = useState(localStorage.getItem(principal) ? true : false )

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await nft.getTokenIdsForUserDip721(Principal.fromText(principal))
        if(response.length > 0) {
          setHasProfile(true)
        }
        localStorage.setItem(principal, true)
      } catch (error) {
        console.error('Error checking profile:', error)
      } 
    };

    if(isConnected) checkProfile()
  }, [])

  if (!isConnected) {
    return <Navigate to="/connect" />
  }

  return hasProfile ? <Navigate to={`/profile/${principal}`} replace/> : <Outlet />
}
