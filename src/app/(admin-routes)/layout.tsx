import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar/sidebar";

interface PrivateLayoutProps {
  children: ReactNode
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await getServerSession(nextAuthOptions)

  if(!session) {
    redirect('/')
  }

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-full w-[250px] bg-gray-800">
        <Sidebar />
      </div>
      <div className="ml-[350px] flex w-full p-6">
        {children}
      </div>
    </div>
  )
}