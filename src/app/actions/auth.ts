"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { signUpSchema } from "~/schemas";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { signIn, signOut } from "~/server/auth";
import { AuthError } from "next-auth";

export async function signout() {
  await signOut();
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // Credentials is provider's name defined by auth/config.ts
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { email, password } = await signUpSchema.parseAsync({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      return "User already exists";
    }

    const hash = await bcrypt.hash(password, 10);
    await db.user.create({
      data: {
        email,
        password: hash,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return error.errors.map((err) => err.message).join(", ");
    }
  }

  redirect("/signin");
}
