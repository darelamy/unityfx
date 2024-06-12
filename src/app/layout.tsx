import { M_PLUS_Rounded_1c } from "next/font/google";
import "@/styles/globals.scss";
import { Provider } from "@/context/Provider";
import { NextPageContext } from "next";
import { Header } from "@/components/Header";

const m_plus_rounded_1c = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "300", "500", "700", "800"],
});

interface MainLayoutProps {
  params: NextPageContext;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = async ({ children }) => {
  return (
    <html lang="ru">
      <Provider>
        <body className={m_plus_rounded_1c.className}>
          <Header />
          {children}
        </body>
      </Provider>
    </html>
  );
};

export default MainLayout;
