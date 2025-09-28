import './globals.css';

// Root layout is minimal - all i18n logic is handled in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
