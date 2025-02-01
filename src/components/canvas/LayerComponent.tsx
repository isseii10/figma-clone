import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { LayerType } from "~/types";
import Rectangle from "./Rectangle";
import Ellipse from "./Ellipse";
import Path from "./Path";
import { colorToCss } from "~/utils";

const LayerComponent = memo(({ id }: { id: string }) => {
  const layer = useStorage((root) => root.layers.get(id));
  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.Rectangle:
      return <Rectangle id={id} layer={layer} />;
    case LayerType.Ellipse:
      return <Ellipse id={id} layer={layer} />;
    case LayerType.Path:
      return (
        <Path
          points={layer.points}
          x={layer.x}
          y={layer.y}
          fill={layer.fill ? colorToCss(layer.fill) : "#CCC"}
          stroke={layer.stroke ? colorToCss(layer.stroke) : "#CCC"}
          opacity={layer.opacity}
        />
      );
    case LayerType.Text:
  }

  return (
    <g>
      <rect x={0} y={0} width={200} height={200} fill="#FF0000" />
    </g>
  );
});

LayerComponent.displayName = "LayerComponent";

export default LayerComponent;
