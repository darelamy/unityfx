import React from "react";

interface ViewsIconProps {
  viewsCount: number;
}

export const ViewIcon: React.FC<ViewsIconProps> = ({ viewsCount }) => {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="29.000000"
        height="29.000000"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="clip101_242">
            <rect
              id="svg"
              width="29.000000"
              height="29.000000"
              fill="white"
              fillOpacity="0"
            />
          </clipPath>
        </defs>
        <g clipPath="url(#clip101_242)">
          <ellipse
            id="circle"
            cx="14.875000"
            cy="17.227295"
            rx="3.625000"
            ry="3.460227"
            fill="#000000"
            fillOpacity="0"
          />
          <ellipse
            id="circle"
            cx="14.875000"
            cy="17.227295"
            rx="3.625000"
            ry="3.460227"
            stroke="#555D60"
            strokeOpacity="1.000000"
            strokeWidth="2.416667"
          />
          <path
            id="path"
            d=""
            fill="#000000"
            fillOpacity="0"
            fillRule="nonzero"
          />
          <path
            id="path"
            d="M25.75 17.22C25.75 17.22 24.54 8 14.87 8C5.2 8 4 17.22 4 17.22"
            stroke="#555D60"
            strokeOpacity="1.000000"
            strokeWidth="2.416667"
          />
        </g>
      </svg>
      <span className="viewsCount">{viewsCount}</span>
    </div>
  );
};
