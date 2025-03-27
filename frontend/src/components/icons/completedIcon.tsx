const CompletedIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "default" }}
      {...props}
    >
      <circle
        cx="256"
        cy="256"
        r="256"
        fill="transparent"
        style={{ cursor: "pointer" }}
      />
      <path
        fill="#149113"
        fill-rule="evenodd"
        transform="scale(0.975) translate(6, 6)"
        style={{ cursor: "pointer" }}
        d="M256 0C114.839 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 406c-82.711 0-150-67.289-150-150s67.289-150 150-150 150 67.289 150 150-67.289 150-150 150zm58.554-190.9a8.445 8.445 0 0 1 0 11.957L244.71 296.9a8.456 8.456 0 0 1-11.95 0l-35.309-35.312a8.451 8.451 0 1 1 11.943-11.959l29.337 29.345 63.878-63.874a8.451 8.451 0 0 1 11.945 0z"
        opacity="1"
        data-original="#5eac24"
      />
    </svg>
  );
};

export default CompletedIcon;
