import { UploadIcon } from "@/icons/UploadIcon";
import { UserIcon } from "@/icons/UserIcon";
import { TalkIcon } from "@/icons/TalkIcon";
import { SolidSearchIcon } from "@/icons/SolidSearchIcon";
import { CommunityIcon } from "@/icons/CommunityIcon";
import { PresetIcon } from "@/icons/PresetIcon";

import styles from "./FeaturesList.module.scss";
import { FeaturesListItem } from "@/components/FeaturesListItem";

export const FeaturesList = () => {
  const features = [
    {
      id: 1,
      icon: <UploadIcon />,
      title: "Публикация своих работ",
      desc: "Делитесь своими лучшими видео-проектами с сообществом и получайте обратную связь от других пользователей. Публикуйте свои работы, чтобы показать свое мастерство и вдохновить других.",
    },
    {
      id: 2,
      icon: <UserIcon />,
      title: "Создание персонального профиля",
      desc: "Создайте свой уникальный профиль с портфолио и контактными данными для представления вашего опыта и навыков в области видео-монтажа. Вы можете отредактировать свой профиль в любой момент.",
    },
    {
      id: 3,
      icon: <TalkIcon />,
      title: "Обсуждение контента",
      desc: "Участвуйте в дискуссиях, комментируйте работы других пользователей и делитесь своими мыслями и идеями по поводу видео-материалов. Обсуждайте техники монтажа, эффекты, истории успеха и многое другое.",
    },
    {
      id: 4,
      icon: <SolidSearchIcon />,
      title: "Поиск по тематике и тегам",
      desc: "Используйте поиск для быстрого доступа к интересующему вас контенту. Фильтруйте материалы по тематике, ключевым словам и тегам, чтобы найти релевантный контент для вашей работы и интересов.",
    },
    {
      id: 5,
      icon: <CommunityIcon />,
      title: "Обучение и обмен опытом",
      desc: "Получайте новые знания и навыки от опытных мастеров индустрии. Обменивайтесь опытом, участвуйте в дискуссиях и помогайте другим участникам развиваться в области видео-монтажа.",
    },
    {
      id: 6,
      icon: <PresetIcon />,
      title: "Готовые проекты и пресеты",
      desc: "Воспользуйтесь готовыми проектами и пресетами для ускорения процесса монтажа. Найдите шаблоны, эффекты и настройки, которые помогут вам создать профессиональные видео без лишних затрат времени.",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {features.map((feature) => (
        <FeaturesListItem
          key={feature.id}
          title={feature.title}
          desc={feature.desc}
          isLast={feature.id === features.at(-1)?.id}
        >
          <div className={styles.icon}>{feature.icon}</div>
        </FeaturesListItem>
      ))}
    </div>
  );
};
