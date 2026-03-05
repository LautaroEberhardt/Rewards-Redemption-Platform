"use server";

import { revalidateTag } from "next/cache";

export async function revalidarPremios() {
  try {
    revalidateTag("premios", "default");
  } catch (error) {
    console.error("Error al revalidar premios:", error);
  }
}
