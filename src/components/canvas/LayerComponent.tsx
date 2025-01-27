import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { LayerType } from "~/types";
import Rectangle from "./Rectangle";
import Ellipse from "./Ellipse";

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
