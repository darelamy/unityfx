import styles from "./PageTitle.module.scss";

interface PageTitleProps {
  title: string;
  children?: React.ReactNode;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, children }) => {
  return children ? (
    <div className="flex flex-col items-center">
      <h3 className={styles.pageTitle} style={{ marginBottom: 10 }}>
        {title}
      </h3>
      {children}
    </div>
  ) : (
    <h3 className={styles.pageTitle}>{title}</h3>
  );
};
