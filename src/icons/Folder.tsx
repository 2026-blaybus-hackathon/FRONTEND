import type { SVGProps } from "react";

export function Folder(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.125 3V6.3825H2.25V21.0015H21.0765L23.316 9.744H21V6.3825H16.1235V3H7.125ZM9.075 6.381H14.175V4.95H9.075V6.381ZM4.2 7.95H19.05V9.744H7.5615L5.712 19.0455H4.2V7.95Z"
        fill="currentColor"
      />
    </svg>
  );
}
