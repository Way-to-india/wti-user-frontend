"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import WTIndiaLogo from "@/app/../../public/assets/images/logo1.png";

const Logo = () => {
  const router = useRouter();
  return (
    <Image
      src={WTIndiaLogo}
      width={250}
      alt="Way to India Logo"
      onClick={() => router.push("/")}
      className="cursor-pointer"
      priority
    />
  );
};

export default Logo;
