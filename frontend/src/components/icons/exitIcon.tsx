const ExitIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "default" }}
      {...props}
    >
      <g
        fill-rule="evenodd"
        transform="scale(0.975) translate(6, 6)"
        style={{ cursor: "pointer" }}
      >
        <path
          fill="#ff3f5b"
          d="M256.5 0C115.342 0 .5 114.84.5 256s114.839 256 256 256 256-114.84 256-256S397.66 0 256.5 0z"
          opacity="1"
          data-original="#f4a423"
        />
        <g fill="#fff">
          <path
            d="M351.9 174.989v162.02a45.516 45.516 0 0 1-45.46 45.461h-99.879a45.515 45.515 0 0 1-45.461-45.46v-30.68a16 16 0 1 1 32 0v30.679a13.476 13.476 0 0 0 13.46 13.461h99.883a13.475 13.475 0 0 0 13.457-13.46V174.989a13.479 13.479 0 0 0-13.462-13.46h-99.877A13.478 13.478 0 0 0 193.1 174.99v37.74a16 16 0 0 1-32 0v-37.741a45.512 45.512 0 0 1 45.46-45.459h99.883a45.515 45.515 0 0 1 45.457 45.459z"
            fill="#ffffff"
            opacity="1"
            data-original="#ffffff"
          />
          <path
            d="M177.1 244.14h67.743l-9.112-9.28a16 16 0 1 1 22.83-22.42l35.832 36.48a16.014 16.014 0 0 1 0 22.43l-35.827 36.479a16 16 0 1 1-22.834-22.419l9.113-9.27H177.1a16 16 0 0 1 0-32z"
            fill="#ffffff"
            opacity="1"
            data-original="#ffffff"
          />
        </g>
      </g>
    </svg>
  );
};

export default ExitIcon;
