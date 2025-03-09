import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/provider';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: "AI Father | Grok 2",
  description: "AI Father is your AI sidekick from xAI, here to help you deploy smart contracts with ThirdWeb like a pro.",
  openGraph: {
    title: "AI Father | Grok 2",
    description: "Hey there, vitsing! I'm Grok 2, your AI sidekick from xAI, here to help you deploy smart contracts with ThirdWeb like a pro.",
    url: "https://aifather.chat",
    siteName: "AI Father",
    images: [
      {
        url: "https://aifather.chat/preview.png",
        width: 1200,
        height: 630,
        alt: "AI Father",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Father | Grok 2",
    description: "Hey there, vitsing! I'm Grok 2, your AI sidekick from xAI, here to help you deploy smart contracts with ThirdWeb like a pro.",
    images: ["https://aifather.chat/preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
