import dayjs from "dayjs";
import "dayjs/locale/ru";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export const formatDate = (date: Date): string => {
  return dayjs(date).locale("ru").format("D MMM. YYYY [г.] в HH:mm");
};
