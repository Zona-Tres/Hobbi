import { create } from "zustand";

const useStore = create((set) => ({
  canisterId: 0,
  username: "",
  myinfo: {},
  setCanisterId: (id) => set((state) => (state.canisterId !== id ? { canisterId: id } : {})),
  setUsername: (username) => set((state) => (state.username !== username ? { username: username } : {})),
  setMyInfo: (data) => set((state) => (state.myinfo !== data ? { myinfo: data } : {}))
}));

export default useStore;