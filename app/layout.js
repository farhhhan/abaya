import localFont from "next/font/local";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const arsenal = localFont({
  src: [
    { path: "../public/fonts/Arsenal-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Arsenal-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-arsenal"
});

const nunito = localFont({
  src: [
    { path: "../public/fonts/Nunito-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/Nunito-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Nunito-SemiBold.ttf", weight: "600", style: "normal" }
  ],
  variable: "--font-nunito"
});

export const metadata = {
  title: "SO Abaya | Premium Collections",
  description: "Discover the finest Abaya and modest fashion collections at SO Abaya.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${arsenal.variable} font-body antialiased text-black bg-white`} >
        <AnnouncementBar />
        <Toaster position="top-center" />
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
