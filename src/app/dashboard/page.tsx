"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import UserMenu from "~/components/dashboard/UserMenu";
import CreateRoom from "~/components/dashboard/CreateRoom";

const Page = async () => {
  const session = await auth();
  const user = await db.user.findUniqueOrThrow({
    where: { id: session?.user.id },
    include: { ownedRooms: true, RoomInvites: { include: { room: true } } },
  });
  return (
    <div className="flex h-screen w-full">
      <div className="flex h-screen min-w-[264px] flex-col border-r border-gray-200 bg-white p-2">
        <UserMenu email={user?.email} />
      </div>
      <div className="flex h-screen w-full flex-col">
        <div className="flex min-h-[50px] items-center border-b border-gray-200 bg-white pl-8">
          <h2 className="text-[13px]">Recents</h2>
        </div>
        <div className="flex h-full flex-col gap-10 p-8">
          <CreateRoom />
        </div>
      </div>
    </div>
  );
};

export default Page;
