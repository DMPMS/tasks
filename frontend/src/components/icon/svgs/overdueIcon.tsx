const OverdueIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M256 0C114.51 0 0 114.5 0 256c0 141.49 114.5 256 256 256 141.49 0 256-114.5 256-256C512 114.51 397.5 0 256 0z"
        fill="var(--color-white-1)"
        opacity="1"
      />
    </svg>
  );
};

export default OverdueIcon;
