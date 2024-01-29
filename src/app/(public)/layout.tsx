'use client'

import { redirect } from "next/navigation"
import { useEffect, useState } from 'react';
import { useUser } from "../contexts/useUser";

export const useMounted = (): { hasMounted: boolean } => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return { hasMounted };
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { auth } = useUser();
  const { hasMounted } = useMounted();

  if(hasMounted && auth?.authenticated) {
    redirect('/home')
  }

  return <>{children}</>
}
