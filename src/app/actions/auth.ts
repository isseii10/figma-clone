"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { signUpSchema } from "~/schemas";
import { db } from "~/server/db";
import bcrypt from "bcrypt";

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
