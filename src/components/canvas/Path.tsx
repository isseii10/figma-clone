import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "~/utils";

const Path = ({
  x,
  y,
  stroke,
  fill,
  opacity,
  points,
}: {
  x: number;
  y: number;
  stroke?: string;
  fill: string;
  opacity: number;
  points: number[][];
}) => {
  const pathData = getSvgPathFromStroke(
    getStroke(points, {
      size: 16,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    }),
  );
  return (
    <path
      style={{ transform: `translate(${x}px, ${y}px)` }}
      d={pathData}
      fill={fill}
      stroke={stroke ?? "#CCC"}
      strokeWidth={1}
      opacity={`${opacity ?? 100}%`}
    />
  );
};

export default Path;
