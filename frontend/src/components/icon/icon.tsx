import React, { useState } from "react";
import styles from "./icon.module.css";

interface IconProps {
  width: number;
  height?: number;
  backgroundColor: string;
  backgroundHoveredColor: string;
  title?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Icon = ({
  width,
  height = width,
  backgroundColor,
  backgroundHoveredColor,
  title,
  onClick,
  children,
}: IconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      title={title}
      className={styles.containerIcon}
      style={{
        width: width,
        height: height,
        backgroundColor: isHovered ? backgroundHoveredColor : backgroundColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default Icon;
