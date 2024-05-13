import styles from "./FeaturesListItem.module.scss";

interface FeaturesListItemProps {
  children: React.ReactNode;
  title: string;
  desc: string;
  isLast: boolean;
}

export const FeaturesListItem: React.FC<FeaturesListItemProps> = ({
  children,
  title,
  desc,
  isLast,
}) => {
  return (
    <div className="flex">
      <div
        className={`${styles.featureListItem} relative flex items-center justify-center`}
      >
        <div className={styles.background}></div>
        <div className="absolute">{children}</div>
      </div>
      <div>
        <p className={styles.title}>{title}</p>
        <p
          className={styles.desc}
          style={{ borderBottom: isLast ? "none" : "1px solid #E3E2E2FF" }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
};
