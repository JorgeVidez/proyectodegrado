"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export const useRoleGuard = () => {
  const { loading, hasPermission } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !hasPermission(pathname)) {
      router.replace("/unauthorized")
    }
  }, [loading, pathname])
}
