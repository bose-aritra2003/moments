import '@/styles/globals.css'
import {Inter} from 'next/font/google'
import {cn} from "@/lib/utils";
import Navbar from "@/components/Navbar";
import {ReactNode} from "react";
import Providers from "@/components/Providers";

export const metadata = {
  title: 'Moments - Home',
  description: 'Sharing Stories, Shaping Community',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://moments-connect.vercel.app',
    title: "Moments - Home",
    siteName: 'Moments',
    description: "Sharing Stories, Shaping Community",
    images: [
      {
        url: '/icon.svg',
        width: 256,
        height: 256,
      }
    ],
  },
  twitter: {
    title: "Moments - Home",
    description: "Sharing Stories, Shaping Community",
    card: "summary_large_image",
    images: [
      {
        url: '/apple-icon.png',
        width: 256,
        height: 256,
      }
    ],
  }
}

const inter = Inter({ subsets: ['latin'] })

const RootLayout = ({ children, authModal }: { children: ReactNode, authModal: ReactNode }) => {
  return (
    <html lang='en'>
      <body className={cn(
        "min-h-screen bg-gray-50 antialiased",
        inter.className
      )}>
        <Providers>
          {/*@ts-expect-error server component*/}
          <Navbar />
          {authModal}
          <div className="container max-w-7xl mx-auto h-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
export default RootLayout;