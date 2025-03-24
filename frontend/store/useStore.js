import { create } from "zustand"
import { persist } from "zustand/middleware"

const replacer = (key, value) => {
  if (typeof value === "bigint") {
    return value.toString() + "n"
  }
  return value
}

const reviver = (key, value) => {
  if (typeof value === "string" && value.endsWith("n")) {
    return BigInt(value.slice(0, -1))
  }
  return value
}

const useStore = create(
  persist(
    (set) => ({
      canisterId: "", // Almacenar como string para evitar problemas con BigInt
      username: "",
      myinfo: {},
      setCanisterId: (id) =>
        set((state) => (state.canisterId !== id ? { canisterId: id } : {})),
      setUsername: (username) =>
        set((state) =>
          state.username !== username ? { username: username } : {},
        ),
      setMyInfo: (data) =>
        set((state) => (state.myinfo !== data ? { myinfo: data } : {})),
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
      serialize: (state) => JSON.stringify(state, replacer), // convertir BigInt a string antes de almacenar
      deserialize: (str) => JSON.parse(str, reviver), // convertir string a BigInt al recuperar
    },
  ),
)

export default useStore
