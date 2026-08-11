import "server-only";

const firebaseApiKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
  "AIzaSyALjoxEuLZtGzeMNWGBNolNBvnmVt1Uhvk";

type FirebaseLookupResponse = {
  users?: Array<{
    localId?: string;
    email?: string;
  }>;
};

export type VerifiedFirebaseUser = {
  uid: string;
  email: string;
};

export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<VerifiedFirebaseUser> {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );

  const payload = (await response
    .json()
    .catch(() => ({}))) as FirebaseLookupResponse;
  const user = payload.users?.[0];

  if (!response.ok || !user?.localId) {
    throw new Error("UNAUTHORIZED");
  }

  const email = user.email?.trim().toLowerCase() ?? "";
  const allowedEmails = (process.env.FIREBASE_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length > 0 && !allowedEmails.includes(email)) {
    throw new Error("FORBIDDEN");
  }

  return {
    uid: user.localId,
    email,
  };
}
