import React, { useState, useEffect, useRef } from "react";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import gsap from "gsap";
import periodsData from "../data/periods";
import styles from "./TimelineBlock.module.scss";
import { Period } from "../types/types";
import type { Swiper as SwiperClass } from "swiper";
import leftIcon from "../assets/icons/left.png";
import rightIcon from "../assets/icons/right.png";
import leftSwipe from "../assets/icons/swipe-left.png";
import rightSwipe from "../assets/icons/swipe-right.png";

const TimelineBlock: React.FC = () => {
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const startYearRef = useRef<HTMLSpanElement>(null);
  const endYearRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const periods: Period[] = periodsData;
  const totalPeriods = periods.length;
  const angleStep = 360 / totalPeriods;

  const handlePointClick = (index: number) => {
    setCurrentPeriodIndex(index);
  };

  const handlePrev = () => {
    setCurrentPeriodIndex((prev) => (prev === 0 ? totalPeriods - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPeriodIndex((prev) => (prev === totalPeriods - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (startYearRef.current && endYearRef.current) {
      gsap.to([startYearRef.current, endYearRef.current], {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (startYearRef.current)
            startYearRef.current.textContent =
              periods[currentPeriodIndex].startYear.toString();
          if (endYearRef.current)
            endYearRef.current.textContent =
              periods[currentPeriodIndex].endYear.toString();
          gsap.to([startYearRef.current, endYearRef.current], {
            opacity: 1,
            duration: 0.3,
          });
        },
      });
    }

    if (circleRef.current) {
      const targetRotation = -currentPeriodIndex * angleStep;
      gsap.to(circleRef.current, {
        rotation: targetRotation,
        duration: 0.8,
        ease: "power3.out",
        transformOrigin: "center",
      });
    }
  }, [currentPeriodIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.timelineBlock}>
      <div className={styles.verticalLine}></div>
      <div className={styles.horizontalLine}></div>
      <div className={styles.header}>
        <div className={styles.line}></div>
        <h2 className={styles.title}>Исторические даты</h2>
      </div>

      <div className={styles.years}>
        <div className={styles.yearsBox}>
          <span
            className={`${styles.year} ${styles.yearStart}`}
            ref={startYearRef}
          >
            {periods[currentPeriodIndex].startYear}
          </span>
          <span className={`${styles.year} ${styles.yearEnd}`} ref={endYearRef}>
            {periods[currentPeriodIndex].endYear}
          </span>
        </div>
        <div className={styles.circle} ref={circleRef}>
          {periods.map((_, index) => {
            const angle = index * angleStep - 90;
            const x = 50 + 50 * Math.cos((angle * Math.PI) / 180);
            const y = 50 + 50 * Math.sin((angle * Math.PI) / 180);
            return (
              <React.Fragment key={index}>
                <div
                  className={`${styles.point} ${
                    index === currentPeriodIndex ? styles.pointActive : ""
                  }`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => handlePointClick(index)}
                >
                  {index === currentPeriodIndex && (
                    <span
                      className={styles.verticalText}
                      style={{
                        transform: `rotate(${angle - 300}deg)`,
                      }}
                    >
                      {currentPeriodIndex + 1}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className={styles.bottomBox}>
        <div className={styles.pointLabel}>
          {periods[currentPeriodIndex].form}
        </div>
        <div className={styles.nav}>
          <span className={styles.navCounter}>{`${
            currentPeriodIndex + 1
          }/${totalPeriods}`}</span>
          <div className={styles.navButtonsBox}>
            <button className={`${styles.navButton}`} onClick={handlePrev}>
              <img src={leftIcon} />
            </button>
            <button className={`${styles.navButton}`} onClick={handleNext}>
              <img src={rightIcon} />
            </button>
          </div>
        </div>
        <div className={styles.slider}>
          <div
            className={`${styles.swiperPrev} ${
              isBeginning ? styles.disabled : ""
            }`}
          >
            <img src={leftSwipe} />
          </div>
          <div
            className={`${styles.swiperNext} ${isEnd ? styles.disabled : ""}`}
          >
            <img src={rightSwipe} />
          </div>
          <Swiper
            modules={[Navigation]}
            slidesPerView={3}
            spaceBetween={150}
            navigation={{
              nextEl: `.${styles.swiperNext}`,
              prevEl: `.${styles.swiperPrev}`,
            }}
            onSwiper={(swiper: SwiperClass) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper: SwiperClass) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
          >
            {periods[currentPeriodIndex].events.map((event, index) => (
              <SwiperSlide className={styles.swiperSlide} key={index}>
                <div className={styles.swiperSlideYear}>{event.year}</div>
                <div className={styles.swiperSlideContent}>{event.content}</div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TimelineBlock;
