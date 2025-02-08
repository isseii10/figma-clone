import { memo } from "react";
import Cursor from "./Cursor";
import {
  shallow,
  useOthersConnectionIds,
  useOthersMapped,
} from "@liveblocks/react";
import Path from "./Path";
import { colorToCss } from "~/utils";

const Cursurs = () => {
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.penColor,
    }),
    shallow,
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : "#CCC"}
              opacity={100}
            />
          );
        }
      })}
    </>
  );
};

const MultiplayerGuides = () => {
  return (
    <>
      <Cursurs />
      <Drafts />
    </>
  );
};

export default memo(MultiplayerGuides);
