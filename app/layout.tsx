import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"
import { queryFetcher, contactQuery, menuQuery, bannerQuery, footerLogoQuery, headerLogoQuery } from "./queries";
import { frFR } from "@clerk/localizations"
import "./globals.css";
import "./homepage.css";
import "./services.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Banner from "./components/Banners";
import { PageTransitionProvider } from "./components/PageTransition";
import { Nunito } from 'next/font/google'
import { AuthProvider } from "./AuthContext";
import { Contact } from "@/sanity.types";

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-nunito' })


export const metadata: Metadata = {
  title: "Maison de la Famille de St-François",
  description: "Viens prendre une pause!",
  authors: [{ name: "Maison de la Famille de St-François" }],
  keywords: ["Maison de la Famille de St-François", "MF", "St-François", "Famille", "Maison"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tabsQuery = await queryFetcher(menuQuery)
  const contacts = await queryFetcher(contactQuery)
  const banner = await queryFetcher(bannerQuery)
  const footerLogo = await queryFetcher(footerLogoQuery)
  const logo: Contact = await queryFetcher(headerLogoQuery)

  const tabs = tabsQuery.flatMap((tab: { pages: string[] }) => tab.pages)

  return (
    <ClerkProvider localization={frFR}>
      <AuthProvider>
        <html lang="en" className={nunito.variable}>
          <body>
            <PageTransitionProvider logo={footerLogo}>
              <Header tabs={tabs} logo={logo} />
              <Banner banner={banner[0]?.bannerList ?? []} />
              {children}
              <Footer tabs={tabs} contacts={contacts} logo={footerLogo} />
            </PageTransitionProvider>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  );
}
