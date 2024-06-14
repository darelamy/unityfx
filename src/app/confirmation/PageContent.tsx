"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/src/app/api/apiUrl";
import { signIn } from "next-auth/react";

import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Confirmation.module.scss";
import { WarningIcon } from "@/icons/WarningIcon";
import { CancelIcon } from "@/icons/CancelIcon";
import { RefreshIcon } from "@/icons/RefreshIcon";

export const PageContent = () => {
  const [confirmationCode, setConfirmationCode] = React.useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [error, setError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [isRequestingCode, setIsRequestingCode] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const router = useRouter();
  const inputRefs = React.useRef<HTMLInputElement[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);

          setIsRequestingCode(false);
          return 0;
        }
        const newTime = prevTime - 1;
        sessionStorage.setItem("timeLeft", newTime.toString());
        return newTime;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const { data } = await axios.post(`${apiUrl}/api/auth/confirm`, {
        confirmationCode: confirmationCode.join(""),
        tempToken: Cookies.get("tempToken"),
      });

      if (data) {
        await signIn("credentials", {
          email: data.email,
          password,
          callbackUrl: "/posts",
        });
        router.push("/posts");

        sessionStorage.removeItem("password");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("timeLeft");
        Cookies.remove("tempToken");
      }
    } catch (err) {
      setError("Кажется, вы ввели неверный код подтверждения");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value.length <= 1) {
      const newCode = [...confirmationCode];
      newCode[index] = value;
      setConfirmationCode(newCode);

      if (value !== "") {
        const nextIndex = index < 5 ? index + 1 : index;
        inputRefs.current[nextIndex].focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && confirmationCode[index] === "") {
      const newCode = [...confirmationCode];
      newCode[index - 1] = "";
      setConfirmationCode(newCode);
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text");
    const newCode = [...confirmationCode];
    for (let i = 0; i < Math.min(newCode.length, pasteData.length); i++) {
      newCode[i] = pasteData[i];
    }

    setConfirmationCode(newCode);
  };

  const handleRequestCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsRequestingCode(true);

    await axios
      .post(`${apiUrl}/api/auth/request-new-code`, {
        email: sessionStorage.getItem("email"),
      })
      .then(() => {
        setTimeLeft(60);
        sessionStorage.setItem("timeLeft", "60");
      })
      .catch(({ response }) => {
        const timeLeft = (response.data.timeLeft / 1000).toFixed(0);

        setTimeLeft(+timeLeft);
        sessionStorage.setItem("timeLeft", String(timeLeft));
      });
    startTimer();

    setIsRequestingCode(false);
  };

  const handleCancelRegistration = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      await axios.delete(`${apiUrl}/api/auth/cancel-registration`, {
        data: { email: sessionStorage.getItem("email") },
      });

      sessionStorage.removeItem("email");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("timeLeft");
      Cookies.remove("tempToken");

      router.push("/register");
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    (async () => {
      const code = confirmationCode.join("");

      if (code.length === 6) {
        await handleSubmit();
      }
    })();
  }, [confirmationCode]);

  React.useEffect(() => {
    const storedPassword = sessionStorage.getItem("password");

    if (storedPassword) setPassword(storedPassword);
  }, []);

  React.useEffect(() => {
    const storedTimeLeft = sessionStorage.getItem("timeLeft");
    const parsedTimeLeft = parseInt(storedTimeLeft as string);

    if (!isNaN(parsedTimeLeft) && parsedTimeLeft > 0) {
      setTimeLeft(parsedTimeLeft);
      setIsRequestingCode(true);
      startTimer();
    } else {
      setTimeLeft(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="container flex justify-center">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="flex items-center justify-between flex-wrap gap-5 mb-10">
          <button
            className={styles.formButton}
            onClick={handleCancelRegistration}
          >
            <CancelIcon />
            <span>Отменить</span>
          </button>
          <div className={`${styles.breadCrumb} flex items-center`}>
            <span>Регистрация</span>
            <span className={styles.breadCrumbSeparator}>/</span>
            <span className={styles.breadCrumbActive}>Подтверждение</span>
          </div>
        </div>
        <p className={styles.text}>
          Введите код подтверждения, отправленный на указанную электронную почту
        </p>
        <div
          className={`${styles.codeInputsContainer} flex justify-between gap-2`}
        >
          {confirmationCode.map((value, index) => (
            <input
              autoFocus={index === 0}
              className={`${styles.input} ${
                value ? styles.inputActive : ""
              } flex justify-center items-center text-center`}
              key={index}
              ref={(ref: any) => (inputRefs.current[index] = ref)}
              type="text"
              value={value}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isSubmitting}
              maxLength={1}
            />
          ))}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-5 mt-5">
          <span className={styles.requestCodeTitle}>Не пришел код?</span>
          {timeLeft > 0 ? (
            <p className={styles.requestCodeBlockTime}>
              Повторный запрос через: {timeLeft} сек
            </p>
          ) : (
            timeLeft === 0 &&
            !isRequestingCode && (
              <button
                className={`${styles.formButton} ${styles.formButtonRequestCode}`}
                onClick={handleRequestCode}
                disabled={isRequestingCode}
              >
                <RefreshIcon />
                <span>Отправить повторно</span>
              </button>
            )
          )}
        </div>
        {error && (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              initial={{ opacity: 0, x: -400, scale: 0.5 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 200, scale: 1.2 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <div
                className={`${styles.error} flex items-center justify-center`}
                onClick={() => setError("")}
              >
                <div className="flex items-center gap-2">
                  <div>
                    <WarningIcon />
                  </div>
                  <p className={styles.errorText}>{error}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </form>
    </div>
  );
};
