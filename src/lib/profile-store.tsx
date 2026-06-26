"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Profile } from "./types";

interface ProfileStore {
  uid: string;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  ready: boolean;
}

const Ctx = createContext<ProfileStore>({
  uid: "",
  profile: null,
  setProfile: () => {},
  ready: false,
});

const UID_KEY = "nxt.uid";
const PROFILE_KEY = "nxt.profile";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState("");
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let storedUid = localStorage.getItem(UID_KEY);
    if (!storedUid) {
      storedUid = `u_${crypto.randomUUID().slice(0, 12)}`;
      localStorage.setItem(UID_KEY, storedUid);
    }
    setUid(storedUid);
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      try {
        setProfileState(JSON.parse(raw));
      } catch {
        localStorage.removeItem(PROFILE_KEY);
      }
    }
    setReady(true);
  }, []);

  const setProfile = useCallback((next: Profile | null) => {
    setProfileState(next);
    if (next) localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    else localStorage.removeItem(PROFILE_KEY);
  }, []);

  const value = useMemo(
    () => ({ uid, profile, setProfile, ready }),
    [uid, profile, setProfile, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProfile() {
  return useContext(Ctx);
}
