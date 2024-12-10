import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import nextAuthOptions from "@/utils/authOptions";

interface PublicLayoutProps {
  children: ReactNode
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const session = await getServerSession(nextAuthOptions)

  console.log(session)
  
  if(session) {
    redirect('/dashboard')
  }

  return <>{children}</>
}