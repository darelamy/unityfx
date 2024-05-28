import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Страница не найдена",
  icons: {
    icon: "/favicons/not-found-page.svg",
  },
};

const NotFound = () => {
  return (
    <div className="font-bold text-center mt-20">
      <p className="not-fount-title">Ошибка 404</p>
      <p className="not-fount-desc">Страница не найдена</p>
    </div>
  );
};

export default NotFound;
