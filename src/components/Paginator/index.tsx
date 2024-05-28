"use client";

import React from "react";
import styles from "./Paginator.module.scss";
import { ArrowRightIcon } from "@/icons/ArrowRightIcon";

interface PaginatorProps {
  postsPerPage: number;
  totalPosts: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Paginator: React.FC<PaginatorProps> = ({
  postsPerPage,
  totalPosts,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${
            i === currentPage ? styles.activePage : styles.page
          } flex items-center justify-center`}
        >
          <span>{i}</span>
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className={`${styles.paginator} flex justify-center`}>
      <div className="flex items-center gap-7">
        {generatePageNumbers()}
        {currentPage < totalPages && (
          <div className="flex gap-3">
            <button
              className={`${styles.nextPage} flex items-center justify-center`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <div>
                <ArrowRightIcon />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
