import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useCanister } from "@connect2ic/react"
import useStore from "../../store/useStore"
import createBucketActor from "../../hooks/createBucketActor"
import { toast } from "react-toastify"

export const withDataRefresh = (WrappedComponent) => {
  return function WithDataRefreshComponent(props) {
    const location = useLocation()
    const [hobbi] = useCanister("hobbi")
    const setCanisterId = useStore((state) => state.setCanisterId)
    const setUsername = useStore((state) => state.setUsername)
    const setMyInfo = useStore((state) => state.setMyInfo)
    const username = useStore((state) => state.username)

    const handlePublicInfo = async (actor) => {
      try {
        const response = await actor.getMyInfo()
        if (response) {
          setMyInfo(response)
        }
      } catch {
        toast.error("An error occurred while loading user information")
      }
    }

    useEffect(() => {
      const refreshData = async () => {
        try {
          const result = await hobbi.signIn()

          if (result.Ok) {
            if (result.Ok.name !== username) {
              setUsername(result.Ok.name)
            }

            const newCanisterId = result.Ok.userCanisterId.toText()
            setCanisterId(newCanisterId)

            const actor = await createBucketActor(newCanisterId)
            handlePublicInfo(actor)
          }
        } catch (error) {
          toast.error("An error occurred while refreshing data")
        }
      }

      refreshData()
    }, [location.pathname])

    return <WrappedComponent {...props} />
  }
} 