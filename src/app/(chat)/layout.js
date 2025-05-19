// import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "../../styles/chat.globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Notification from "@/components/notification";
import { Toaster } from "react-hot-toast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  // weight :["400" , '700']
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Vibely | Chat app",
  icons: [
    {
      rel: "icon",
      url: "/images/timeline.webp",
      sizes: "32x32",
      type: "image/webp",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />

          <Notification />
        </ThemeProvider>
      </body>
    </html>
  );
}
