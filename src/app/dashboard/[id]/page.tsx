import { auth } from "~/server/auth";

type ParamsType = Promise<{ id: string }>;

export default async function Page({ params }: { params: ParamsType }) {
  const { id } = await params;
  const session = await auth();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is the dashboard page.</p>
    </div>
  );
}
