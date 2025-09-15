import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AlphaExam - India's Best Online Mock Testing Platform",
  description:
    "Take mock tests for mathematical olympiads, JEE, NEET and other competitive exams. 1,000,000+ questions in our question bank.",
  keywords:
    "mock tests, olympiad, JEE, NEET, competitive exams, mathematics, online testing",
  authors: [{ name: "AlphaExam Team" }],
  creator: "AlphaExam",
  publisher: "AlphaExam",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "AlphaExam",
    title: "AlphaExam - India's Best Online Mock Testing Platform",
    description:
      "Take mock tests for mathematical olympiads, JEE, NEET and other competitive exams.",
    images: [
      {
        url: "/ogimage.png",
        width: 1200,
        height: 630,
        alt: "AlphaExam - India's Best Online Mock Testing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaExam - India's Best Online Mock Testing Platform",
    description:
      "Take mock tests for mathematical olympiads, JEE, NEET and other competitive exams.",
    images: ["/ogimage.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>

          <script
            type="text/javascript"
            id="MathJax-script"
            async
            src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                window.MathJax = {
                  tex: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']],
                    processEscapes: true,
                    processEnvironments: true
                  },
                  options: {
                    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
                  },
                  startup: {
                    ready: () => {
                      console.log('MathJax is loaded and ready.');
                      window.MathJax.startup.defaultReady();
                    }
                  }
                };
              `,
            }}
          />
        </head>
        <body
          className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
