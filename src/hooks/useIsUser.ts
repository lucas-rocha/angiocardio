import { useSession } from "next-auth/react";

export function useIsUser() {
  const { data: session } = useSession()
  return session?.user.role === 'USER'
}