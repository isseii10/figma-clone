import { type RectangleLayer } from "~/types";
import { colorToCss } from "~/utils";

const Rectangle = ({
  id,
  layer,
  onPointerDown,
}: {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) => {
  const { x, y, width, height, fill, stroke, opacity, cornerRadius } = layer;

  return (
    <g>
      <rect
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{ transform: `translate(${x}px, ${y}px)` }}
        width={width}
        height={height}
        fill={fill ? colorToCss(fill) : "#CCC"}
        stroke={stroke ? colorToCss(stroke) : "#CCC"}
        opacity={`${opacity ?? 100}%`}
        rx={cornerRadius ?? 0}
        ry={cornerRadius ?? 0}
      />
    </g>
  );
};

export default Rectangle;
