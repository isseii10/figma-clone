import { CanvasMode, type CanvasState } from "~/types";
import SelectionButton from "./SelectionButton";

const ToolsBar = ({
  canvasState,
  setCanvasState,
}: {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
}) => {
  return (
    <div className="shadow=[0_0_3px_rgba(0,0,0,0.18)] fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-lg bg-white p-1">
      <div className="flex items-center justify-center gap-3">
        <SelectionButton
          isActive={canvasState.mode === CanvasMode.None}
          canvasMode={canvasState.mode}
          onClick={(canvasMode) => {
            setCanvasState({ mode: canvasMode });
          }}
        />
      </div>
    </div>
  );
};

export default ToolsBar;
