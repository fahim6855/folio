import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Folio · Semester Results",
    template: "%s · Folio",
  },
  description:
    "Look up your semester result: marks breakdown, grade, grade point and SGPA. Department of Accounting, University of Dhaka.",
};

export const viewport: Viewport = {
  themeColor: "#0f5c4d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
