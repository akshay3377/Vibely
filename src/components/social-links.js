import React from "react";

import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  NewEmailIcon,
} from "@/icons";

const socials = [
  {
    icon: <GithubIcon className="h-6 w-6  fill-black  dark:fill-white" />,
    url: "https://github.com/akshay3377",
  },
  {
    icon: <LinkedinIcon className="h-6 w-6 fill-black  dark:fill-white" />,
    url: "https://www.linkedin.com/in/akshay1313/",
  },
  {
    icon: <NewEmailIcon className="h-6 w-6 fill-black  dark:fill-white" />,
    url: "mailto:workwithakshay777@gmail.com",
  },
  {
    icon: <InstagramIcon className="h-6 w-6 fill-black  dark:fill-white" />,
    url: "https://www.instagram.com/akshay13.__",
  },
];

export default function SocialLinks() {
  return (
    <div>
      <div className="flex gap-3">
        {socials.map((social, idx) => (
          <a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className=" bg-ghost p-2 rounded-md hover:scale-110 active:scale-95 transition-transform duration-200"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
