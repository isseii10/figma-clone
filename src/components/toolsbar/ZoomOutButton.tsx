import IconButton from "./IconButton";
import { AiOutlineZoomOut } from "react-icons/ai";

const ZoomOutButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <IconButton onClick={onClick} disabled={disabled}>
      <AiOutlineZoomOut size={22} color="#888888" />
    </IconButton>
  );
};

export default ZoomOutButton;
