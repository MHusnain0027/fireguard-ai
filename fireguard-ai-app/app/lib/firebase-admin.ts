import "server-only";

import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseAdminApp =
  getApps()[0] ??
  initializeApp({
    projectId: "fireguard-ai-ec9ce",
  });

export const firebaseAdminAuth = getAuth(firebaseAdminApp);
