import { useEffect, useRef, useState } from "react";
import { CanvasMode } from "~/types";
import IconButton from "./IconButton";
import { BiPointer } from "react-icons/bi";
import { RiHand } from "react-icons/ri";

const SelectionButton = ({
  isActive,
  canvasMode,
  onClick,
}: {
  isActive: boolean;
  canvasMode: CanvasMode;
  onClick: (canvasMode: CanvasMode.None | CanvasMode.Dragging) => void;
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (canvasMode: CanvasMode.None | CanvasMode.Dragging) => {
    onClick(canvasMode);
    setIsOpened(false);
  };
  return (
    <div className="relative flex" ref={menuRef}>
      <IconButton isActive={isActive} onClick={() => onClick(CanvasMode.None)}>
        {canvasMode !== CanvasMode.None &&
          canvasMode !== CanvasMode.Dragging && (
            <BiPointer className="h-5 w-5" />
          )}
        {canvasMode === CanvasMode.None && <BiPointer className="h-5 w-5" />}
        {canvasMode === CanvasMode.Dragging && <RiHand className="h-5 w-5" />}
      </IconButton>
      <button
        onClick={() => setIsOpened(!isOpened)}
        className="ml-1 rotate-180"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path
            d="M3.646 6.354l-3-3 .708-.708L4 5.293l2.646-2.647.708.708-3 3L4 6.707l-.354-.353z"
            fill="currentColor"
          />
        </svg>
      </button>
      {isOpened && (
        <div className="absolute -top-20 mt-1 min-w-[150px] rounded-xl bg-[#1e1e1e] p-2 shadow-lg">
          <button
            className={`flex w-full items-center rounded-md p-1 text-white hover:bg-blue-500 ${canvasMode === CanvasMode.None ? "bg-blue-500" : ""}`}
            onClick={() => handleClick(CanvasMode.None)}
          >
            <span className="w-5 text-sm">
              {canvasMode === CanvasMode.None && "✓"}
            </span>
            <BiPointer className="mr-2 h-4 w-4" />
            <span className="text-xs">Move</span>
          </button>
          <button
            className={`flex w-full items-center rounded-md p-1 text-white hover:bg-blue-500 ${canvasMode === CanvasMode.Dragging ? "bg-blue-500" : ""}`}
            onClick={() => handleClick(CanvasMode.Dragging)}
          >
            <span className="w-5 text-sm">
              {canvasMode === CanvasMode.Dragging && "✓"}
            </span>
            <RiHand className="mr-2 h-4 w-4" />
            <span className="text-xs">Hand tool</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectionButton;
