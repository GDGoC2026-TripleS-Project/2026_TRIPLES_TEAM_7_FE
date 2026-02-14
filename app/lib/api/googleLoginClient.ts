"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export async function signInWithGoogleAndGetIdToken() {
  const provider = new GoogleAuthProvider();

  // 원하는 추가 스코프가 있으면:
  // provider.addScope("https://www.googleapis.com/auth/userinfo.email");

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const idToken = await user.getIdToken(true);

  return { idToken, user };
}
