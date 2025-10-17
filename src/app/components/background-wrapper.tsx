"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {/* Background only for non-auth pages */}
      {!isAuthPage && (
        <>
          {/* Castle background */}
          <div
            className="fixed inset-0 -z-20 w-full h-full"
            style={{
              backgroundImage: "url('/black-white-castle-bg-main.png')",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
            }}
          ></div>

          {/* Platinum overlay */}
          <div className="fixed inset-0 bg-[#E5E5E5]/85 -z-10 pointer-events-none"></div>
        </>
      )}

      {/* Main content */}
      <main className="relative z-0 bg-transparent">{children}</main>
    </>
  );
}
