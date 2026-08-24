import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

import { apiCatalogItems } from "@/components/catalog/content/apis";

import { getFirebaseAuth, getFirebaseDb } from "./client";

export type RegisterDeveloperInput = {
  email: string;
  password: string;
  idType: string;
  idNumber: string;
  companyName: string;
  reason: string;
  environment: string;
  product: string;
  subject: string;
  description: string;
};

export async function registerDeveloper(input: RegisterDeveloperInput) {
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), input.email, input.password);
  const { uid, email } = credential.user;
  const db = getFirebaseDb();
  const product = apiCatalogItems.find((item) => item.name === input.product);

  try {
    await setDoc(doc(db, "users", uid), {
      email,
      idType: input.idType,
      idNumber: input.idNumber,
      companyName: input.companyName,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "sandboxApps"), {
      userId: uid,
      product: input.product,
      productSlug: product?.slug ?? null,
      environment: "sandbox",
      requestedEnvironment: input.environment,
      reason: input.reason,
      subject: input.subject,
      description: input.description,
      status: "pending_apigee",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("No se pudo guardar el perfil o la app sandbox en Firestore.", error);
  }

  return credential.user;
}
