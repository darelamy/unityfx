import styles from "./Home.module.scss";
import { VideoPlayIcon } from "@/icons/VideoPlayIcon";
import { ProgramsList } from "@/components/ProgramsList";
import { Metadata, NextPage } from "next";
import { GoalIcon } from "@/icons/GoalIcon";
import { StarIcon } from "@/icons/StarIcon";
import { FeaturesList } from "@/components/FeaturesList";
import { ArrowIcon } from "@/icons/ArrowIcon";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unity FX",
  icons: {
    icon: "/logo.svg",
  },
};

const Home: NextPage = () => {
  return (
    <main>
      <section className={styles.intro}>
        <div
          className={`${styles.introText} container flex flex-col items-center`}
        >
          <div className="flex items-center gap-5">
            <VideoPlayIcon />
            <h2 className={styles.introTitle}>
              Добро пожаловать в <span>Unity FX</span>
            </h2>
          </div>
          <p className={styles.introDesc}>
            Мы рады приветствовать вас в мире <span>творчества</span> и{" "}
            <span>профессионализма</span> в области <span>видеомонтажа</span>!
          </p>
        </div>
        <div className={styles.programsList}>
          <div className="container">
            <ProgramsList />
          </div>
        </div>
      </section>
      <section className={styles.ourGoal}>
        <div className="container flex items-center gap-32">
          <img
            src="/img/goalBlock.png"
            alt="goal img"
            className={styles.ourGoalImg}
          />
          <div>
            <div className={`${styles.ourGoalTop} flex items-center gap-8`}>
              <GoalIcon />
              <h3 className={styles.ourGoalTitle}>Наша цель</h3>
            </div>
            <p className={styles.ourGoalDesc}>
              Мы стремимся создать <span>уникальное</span> сообщество, где{" "}
              <span>видеомонтажеры </span>
              могут обмениваться <span>идеями</span>, <span>советами</span>, а
              также находить вдохновение и новые <span>возможности</span> для{" "}
              <span>развития </span>своего творчества.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.features}>
        <div className="container">
          <div className={`${styles.featuresTop} flex items-center gap-8`}>
            <StarIcon />
            <h3 className={styles.featuresTitle}>Возможности платформы</h3>
          </div>
          <FeaturesList />
        </div>
      </section>
      <section className={styles.registerNow}>
        <div className="container">
          <div className="flex gap-24">
            <img
              src="/img/registerNowBlock.png"
              alt="register now"
              className={styles.registerNowImg}
            />
            <div
              className={`${styles.registerNowBlock} flex flex-col items-center justify-between`}
            >
              <div>
                <div className="flex items-center gap-4">
                  <ArrowIcon />
                  <h3 className={styles.registerNowTitle}>
                    Регистрируйтесь сейчас
                  </h3>
                </div>
                <p className={styles.registerNowDesc}>
                  Регистрация займет всего <span>несколько</span> минут и
                  откроет перед вами мир
                  <span> возможностей</span> и <span>профессионального</span>{" "}
                  роста. Присоединяйтесь к нашему сообществу уже{" "}
                  <span>сегодня</span>!
                </p>
              </div>
              <Link href="/register" className={styles.registerNowBtn}>
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Home;
