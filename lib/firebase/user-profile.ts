import { doc, getDoc, setDoc } from "firebase/firestore";

import { getFirebaseDb } from "./client";

export type UserProfile = {
  displayName: string;
  companyName: string;
  idType: string;
  idNumber: string;
  phone: string;
  email: string;
  notifyBeforeExpiration: boolean;
};

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(getFirebaseDb(), "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    displayName: asString(data.displayName),
    companyName: asString(data.companyName),
    idType: asString(data.idType),
    idNumber: asString(data.idNumber),
    phone: asString(data.phone),
    email: asString(data.email),
    notifyBeforeExpiration: data.notifyBeforeExpiration === true,
  };
}

export async function saveUserProfile(
  uid: string,
  input: Pick<UserProfile, "displayName" | "companyName" | "idType" | "idNumber" | "phone">,
) {
  await setDoc(
    doc(getFirebaseDb(), "users", uid),
    {
      displayName: input.displayName,
      companyName: input.companyName,
      idType: input.idType,
      idNumber: input.idNumber,
      phone: input.phone,
    },
    { merge: true },
  );
}

export async function saveNotifyBeforeExpiration(uid: string, notifyBeforeExpiration: boolean) {
  await setDoc(doc(getFirebaseDb(), "users", uid), { notifyBeforeExpiration }, { merge: true });
}
