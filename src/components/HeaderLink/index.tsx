import Link from "next/link";
import styles from "./HeaderLink.module.scss";

interface HeaderLinkProps {
  text: string;
  children: React.ReactNode;
  href: string;
}

export const HeaderLink: React.FC<HeaderLinkProps> = ({
  text,
  children,
  href,
}) => {
  return (
    <Link href={href} className={`${styles.link} flex items-center gap-1`}>
      {children}
      <span>{text}</span>
    </Link>
  );
};
