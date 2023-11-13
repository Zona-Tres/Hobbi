import React, {useState, useEffect} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCanister, useConnect } from "@connect2ic/react"

export default function RequireAuth(){
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const { isConnected, principal } = useConnect()
  const [nft] = useCanister("nft")

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await nft.getTokenIdsForUserDip721(principal)
        console.log(response);

        setHasProfile(response.data.hasProfile)
      } catch (error) {
        console.error('Error checking profile:', error)
      } finally {
        setLoading(false)
      }
    };

    if(isConnected) {
      checkProfile()
    } else {
      setLoading(false)
    }

  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return isConnected ? (hasProfile ? 
    <Outlet />
  : <Navigate to="/create-profile" state={{ from: location }} replace />) 
  : <Navigate to="/connect" state={{ from: location }} replace />
}