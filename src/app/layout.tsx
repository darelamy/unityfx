"use client";

import { M_PLUS_Rounded_1c } from "next/font/google";
import "@/styles/globals.scss";
import { Header } from "@/components/Header";
import { usePathname } from "next/navigation";

const m_plus_rounded_1c = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <html lang="ru">
      <body className={m_plus_rounded_1c.className}>
        <Header pathname={pathname} />
        {children}
      </body>
    </html>
  );
};

export default MainLayout;
