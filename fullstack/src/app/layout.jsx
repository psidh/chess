import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import RecoilRoot from "./RecoilRoot";
const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});
export const metadata = {
  title: "ChessNext",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${inter.variable} antialiased bg-black text-white`}
      >
        <RecoilRoot>
          <Toaster />
          {children}
        </RecoilRoot>
      </body>
    </html>
  );
}