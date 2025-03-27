const PencilIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
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
          fill="#ffd000"
          d="M256 0C114.842 0 0 114.841 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0z"
          opacity="1"
          data-original="#45f6ff"
        />
        <path
          fill="#ffffff"
          d="M339.572 121.444c-14.409 1.815-28.522 8.995-39.742 20.217L144.191 297.29a10.088 10.088 0 0 0-2.591 4.52l-20.269 76.63A10 10 0 0 0 131 391a10.253 10.253 0 0 0 2.56-.33l76.632-20.27a10.059 10.059 0 0 0 4.518-2.589l155.633-155.638c23.917-23.922 27.567-59.2 8.127-78.639-9.729-9.73-23.54-14.024-38.9-12.09zM156.494 323.73l31.779 31.78-43.209 11.43zm199.71-125.7L207.641 346.59l-42.228-42.23L313.971 155.8c15.849-15.849 38.909-19.569 50.349-8.125s7.73 34.507-8.12 50.356z"
          opacity="1"
          data-original="#ffffff"
        />
      </g>
    </svg>
  );
};

export default PencilIcon;
