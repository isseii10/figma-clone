import { Liveblocks } from "@liveblocks/node";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

const livevblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });

export const POST = async (req: Request) => {
  const userSession = await auth();

  // Get the users room, and invitations to rooms
  const user = await db.user.findUniqueOrThrow({
    where: { id: userSession?.user.id },
  });

  const session = livevblocks.prepareSession(user.id, {
    userInfo: {
      name: user.email ?? "Anonymous",
    },
  });

  session.allow(`room:${"test"}`, session.FULL_ACCESS);

  const { status, body } = await session.authorize();

  return new Response(body, { status });
};
