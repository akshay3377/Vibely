
import { Inter } from "next/font/google";
import "../../styles/chat.globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Notification from "@/components/notification";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  // weight :["400" , '700']
});

export const metadata = {
  title: "Vibely | Chat app",
  icons: [
    {
      rel: "icon",
      url: "/icon512_maskable.png",
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
          {/* <Toaster /> */}

          <Notification />
        </ThemeProvider>
      </body>
    </html>
  );
}
