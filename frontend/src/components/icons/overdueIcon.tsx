const OverdueIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#ff3f5b"
        fill-rule="evenodd"
        d="M256 0C114.839 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 406c-82.711 0-150-67.289-150-150s67.289-150 150-150 150 67.289 150 150-67.289 150-150 150z"
        opacity="1"
        data-original="#5eac24"
      />
    </svg>
  );
};

export default OverdueIcon;
