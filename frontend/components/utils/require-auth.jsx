import React, {useState, useEffect} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from '@dfinity/principal';

export default function RequireAuth(){
  const location = useLocation()
  const { isConnected, principal } = useConnect()
  const [hobbi] = useCanister("hobbi")
  const [hasProfile, setHasProfile] = useState( false )

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await hobbi.signIn()
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
  return hasProfile ? <Navigate to={`/dashboard/${principal}`} replace/> : <Outlet />
}
