"use client";

import styles from "./EditProfileForm.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import React, { BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";
import { IUser } from "@/types/User";
import { useRouter } from "next/navigation";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { useSession } from "next-auth/react";
import { EditProfileSchema } from "@/zod-schemas";
import { UpdateAvatarModal } from "@/components/UpdateAvatarPopup";

type EditProfileFormValues = z.infer<typeof EditProfileSchema>;

interface EditProfileFormProps {
  user?: IUser;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  const [error, setError] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl);

  const { data: session, status, update } = useSession();

  const router = useRouter();

  const form = useForm<EditProfileFormValues>({
    mode: "onChange",
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      login: user?.login,
      desc: user?.desc,
    },
  });

  const onSubmit = async (
    values: EditProfileFormValues,
    event?: BaseSyntheticEvent
  ) => {
    event?.preventDefault();

    try {
      const { data } = await axios.patch("/api/update-profile", {
        login: values.login,
        desc: values.desc,
      });

      await update({
        login: values.login,
        desc: values.desc,
      });

      router.push(`/@${data?.user.login}`);
      router.refresh();
    } catch (err: any) {
      setError(err.response.data);
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-10 flex-wrap">
          <div
            className={`${styles.avatarContainer} relative flex justify-center`}
          >
            <div className={styles.avatar}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" />
              ) : (
                <DefaultAvatar />
              )}
            </div>
            <UpdateAvatarModal
              handleChangeAvatar={(avatarUrl) => setAvatarUrl(avatarUrl)}
            />
          </div>
          <div className="flex flex-col">
            <div
              className={`${styles.inputFieldsContainer} flex flex-col gap-5`}
            >
              {error && (
                <AnimatePresence>
                  <motion.div
                    className={styles.error}
                    layout
                    initial={{ opacity: 0, x: -400, scale: 0.5 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 200, scale: 1.2 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    {error}
                  </motion.div>
                </AnimatePresence>
              )}
              <div className={styles.inputContainer}>
                <div className="flex flex-col">
                  {form.formState.errors.login && (
                    <p className="formFieldError">
                      {form.formState.errors.login?.message}
                    </p>
                  )}
                  <label htmlFor="login" className={styles.label}>
                    Логин
                  </label>
                  <input
                    id="login"
                    {...form.register("login")}
                    className={styles.input}
                    type="text"
                    placeholder="Логин"
                  />
                </div>
              </div>
              <div className={styles.inputContainer}>
                <div className="flex flex-col">
                  {form.formState.errors.desc && (
                    <p className="formFieldError">
                      {form.formState.errors.desc?.message}
                    </p>
                  )}
                  <label htmlFor="desc" className={styles.label}>
                    Описание
                  </label>
                  <textarea
                    id="desc"
                    {...form.register("desc")}
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Описание в профиле"
                  />
                </div>
              </div>
            </div>
            <div className={`${styles.buttons} flex flex-wrap gap-6 mt-10`}>
              <button
                className={styles.submitButton}
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Сохранить
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => router.back()}
              >
                Отменить
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
