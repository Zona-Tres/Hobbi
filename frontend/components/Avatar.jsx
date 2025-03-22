import React, { useState, useEffect } from "react"

const Avatar = ({ avatarData, version = "default", size = "default" }) => {
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    if (avatarData && avatarData.length > 0) {
      const blob = new Blob(avatarData, { type: "image/jpeg" })
      const objectUrl = URL.createObjectURL(blob)
      setAvatarUrl(objectUrl)

      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [avatarData])

  if (!avatarUrl) {
    return <div>Loading...</div>
  }

  // Definir estilos en función del tamaño
  const sizeStyles = {
    small: { width: "24px", height: "24px" },
    default: { width: "52px", height: "52px" },
    large: { width: "99px", height: "99px" },
  }

  const styles = {
    ...sizeStyles[size], // Selecciona el tamaño basado en `size`
    borderRadius: version === "square" ? "11.59px" : "50%",
  }

  return <img src={avatarUrl} alt="Avatar" style={styles} />
}

export default Avatar
