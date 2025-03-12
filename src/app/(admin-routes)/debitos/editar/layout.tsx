import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar/sidebar";
import nextAuthOptions from "@/utils/authOptions";

interface PrivateLayoutProps {
  children: ReactNode
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await getServerSession(nextAuthOptions)

  if(session?.user.role === 'USER') {
    redirect('/debitos/lista')
  }

  return (
    <>
      {children}
    </>
  )
}