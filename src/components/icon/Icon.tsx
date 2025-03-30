import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="2rem"
    height="2em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M10 5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M3 19a2 2 0 1 0 4 0 2 2 0 1 0-4 0m14 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0m-8-5a3 3 0 1 0 6 0 3 3 0 1 0-6 0m3-7v4m-5.3 6.8 2.8-2m7.8 2-2.8-2" />
  </svg>
);
export { SvgComponent as Logo };