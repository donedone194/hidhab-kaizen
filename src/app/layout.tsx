import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hidhabkaizen.dz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hidhab Kaizen | هضاب كايزن - متجر التسوق الإلكتروني بالدفع عند الاستلام",
    template: "%s | Hidhab Kaizen",
  },
  description:
    "متجر هضاب كايزن الإلكتروني - منتجات أصلية مختارة بعناية مع خدمة التوصيل السريع لـ 58 ولاية جزائرية والدفع كاش عند استلام الطرد ومعاينته. Boutique en ligne algérienne avec paiement à la livraison sur 58 wilayas.",
  keywords: [
    "Hidhab Kaizen",
    "هضاب كايزن",
    "تسوق إلكتروني الجزائر",
    "الدفع عند الاستلام الجزائر",
    "توصيل 58 ولاية",
    "achat en ligne algerie",
    "livraison 58 wilayas",
    "paiement a la livraison algerie",
    "e-commerce dz",
    "yalidine express",
    "منتجات هضاب كايزن",
    "متجر جزائري موثوق",
  ],
  authors: [{ name: "Hidhab Kaizen" }],
  creator: "Hidhab Kaizen",
  publisher: "Hidhab Kaizen",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/logo.png" }],
    shortcut: ["/logo.png"],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    alternateLocale: ["fr_DZ"],
    url: siteUrl,
    title: "Hidhab Kaizen | هضاب كايزن - تسوق إلكتروني وتوصيل لـ 58 ولاية",
    description:
      "متجر هضاب كايزن الإلكتروني في الجزائر. توصيل سريع وموثوق لجميع الولايات 58 والدفع نقداً عند الاستلام.",
    siteName: "Hidhab Kaizen",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hidhab Kaizen هضاب كايزن",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hidhab Kaizen | هضاب كايزن",
    description: "متجر هضاب كايزن الإلكتروني الجزائري - توصيل 58 ولاية ودفع عند الاستلام.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google4717de1ac4b922f5",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "Hidhab Kaizen - هضاب كايزن",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "متجر هضاب كايزن الإلكتروني - تسوق إلكتروني مع خدمة الدفع عند الاستلام والتوصيل إلى 58 ولاية جزائرية",
  currenciesAccepted: "DZD",
  paymentAccepted: "Cash on Delivery, الدفع عند الاستلام",
  telephone: "+213675667808",
  priceRange: "DZD",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cité Gaoua",
    addressLocality: "Sétif",
    postalCode: "19000",
    addressCountry: "DZ",
  },
  hasMap: "https://maps.app.goo.gl/yxLAurbfNevjkxTW6",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.2053397,
    longitude: 5.4097239,
  },
  areaServed: {
    "@type": "Country",
    name: "Algeria",
  },
  sameAs: [
    "https://www.facebook.com/people/Hidhab-Kaizen/100063169392492/",
    "https://www.instagram.com/hidhab_kaizen/",
    "https://www.tiktok.com/@hidhabkaizen",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${ibmPlex.variable} ${inter.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased selection:bg-orange-500 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
