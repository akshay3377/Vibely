import SocialLinks from "./social-links";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full p-4 ">
      <div className="container mx-auto   flex flex-col-reverse sm:flex-row items-base   justify-between gap-8">
        <div className=" text-md font-medium">
          <p className="text-center"> Crafted with ❤️ Akshay | ©2025 </p>
        </div>

        {/* Right: Socials */}
        <div className="flex flex-col justify-center items-center">
          <SocialLinks />
          <Link
            href="/sitemap.xml"
            className="hover:underline text-center  flex justify-end font-medium text-sm my-4"
          >
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}
