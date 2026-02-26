"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Default entry: send users to login
    router.replace("/login");
  }, [router]);

  return (
    <div>
      <p>Redirecting to login...</p>
    </div>
  );
}

