interface LikeIconProps {
  isLiked: boolean;
  likesCount: number;
}

export const LikeIcon: React.FC<LikeIconProps> = ({ isLiked, likesCount }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {isLiked ? (
        <svg
          width="29.000000"
          height="29.000000"
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="clip101_252">
              <rect
                id="svg"
                width="29.000000"
                height="29.000000"
                fill="white"
                fillOpacity="0"
              />
            </clipPath>
          </defs>
          <rect
            id="svg"
            width="29.000000"
            height="29.000000"
            fill="#FFFFFF"
            fillOpacity="1.000000"
          />
          <g clipPath="url(#clip101_252)">
            <path
              id="path"
              d="M9.06 4.83C5.39 4.83 2.41 7.8 2.41 11.47C2.41 18.12 10.27 24.16 14.5 25.57C18.72 24.16 26.58 18.12 26.58 11.47C26.58 7.8 23.6 4.83 19.93 4.83C17.69 4.83 15.7 5.94 14.5 7.65C13.87 6.77 13.08 6.07 12.12 5.58C11.16 5.08 10.14 4.83 9.06 4.83Z"
              fill="#EB1616"
              fillOpacity="1.000000"
              fillRule="nonzero"
            />
          </g>
        </svg>
      ) : (
        <svg
          width="29.000000"
          height="29.000000"
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="clip225_236">
              <rect
                id="svg"
                width="29.000000"
                height="29.000000"
                fill="white"
                fillOpacity="0"
              />
            </clipPath>
          </defs>
          <rect
            id="svg"
            width="29.000000"
            height="29.000000"
            fill="#FFFFFF"
            fillOpacity="1.000000"
          />
          <g clipPath="url(#clip225_236)">
            <path
              id="path"
              d="M2.41 11.47C2.41 18.12 10.27 24.16 14.5 25.57C18.72 24.16 26.58 18.12 26.58 11.47C26.58 7.8 23.6 4.83 19.93 4.83C17.69 4.83 15.7 5.94 14.5 7.65C13.87 6.77 13.08 6.07 12.12 5.58C11.16 5.08 10.14 4.83 9.06 4.83C5.39 4.83 2.41 7.8 2.41 11.47Z"
              stroke="#555D60"
              strokeOpacity="1.000000"
              strokeWidth="2.500000"
            />
          </g>
        </svg>
      )}
      <span className={isLiked ? "likesCountLiked" : "likesCountUnliked"}>
        {likesCount}
      </span>
    </div>
  );
};
