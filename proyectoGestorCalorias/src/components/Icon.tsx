import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

export default function Icon({ name, className = "", ...props }: IconProps) {
  return (
    <svg className={className} {...props}>
      <use xlinkHref={`${import.meta.env.BASE_URL}assets/sprite.svg#${name}`} />
    </svg>
  );
}
