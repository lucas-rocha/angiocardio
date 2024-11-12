import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session = await getServerSession(nextAuthOptions)

  return (
    <h1>Ola</h1>
  )
}