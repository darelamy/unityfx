"use client";

import React, { useState } from "react";
import styles from "./Paginator.module.scss";
import { ArrowRightIcon } from "@/icons/ArrowRightIcon";

export const Paginator = ({ postsPerPage, totalPosts, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${i === currentPage ? styles.activePage : styles.page} flex items-center justify-center`}
        >
          <span>{i}</span>
        </button>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className={`${styles.paginator} flex justify-center`}>
      <div className="flex items-center gap-7">
        {generatePageNumbers()}
        <div className="flex gap-3">
          <button
            className={`${styles.selectPageBtn} flex items-center justify-center`}
          >
            <span>...</span>
          </button>
          <button
            className={`${styles.nextPage} flex items-center justify-center`}
          >
            <div>
              <ArrowRightIcon />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
