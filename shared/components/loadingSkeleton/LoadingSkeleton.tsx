"use client";

import React from "react";
import styles from "./LoadingSkeleton.module.scss"; // Создайте соответствующий CSS-модуль

interface LoadingSkeletonProps {
  height?: string | number;
  width?: string | number;
  borderRadius?: string;
  className?: string;
  isCircle?: boolean;
  style?: React.CSSProperties;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  height = "100%",
  width = "100%",
  borderRadius = "8px",
  className = "",
  isCircle = false,
  style,
}) => {
  const skeletonStyle = {
    height,
    width,
    borderRadius: isCircle ? "50%" : borderRadius,
    ...style,
  };

  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={skeletonStyle}
      aria-hidden="true"
    />
  );
};