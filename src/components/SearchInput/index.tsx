import styles from "./SearchInput.module.scss";
import { SearchIcon } from "@/icons/SearchIcon";

export const SearchInput = () => {
  return (
    <div className="">
      <div className={`${styles.inner} relative`}>
        <input
          type="text"
          className={styles.input}
          placeholder="Найдите что-нибудь..."
        />
        <div className={styles.searchIcon}>
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};
