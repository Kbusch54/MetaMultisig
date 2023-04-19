import useCopyToClipboard from "../../../../utils/hooks/copytoClipBoard";
import React, { useState } from "react";
import Image from "next/image";
import copyImg from "../../../../public/assets/copy.svg";
const CopyButton = ({ children, size }) => {
  const [copyValue, copy] = useCopyToClipboard();

  const [clicked, setClicked] = useState(false);
  const handleOnClick = (e) => {
    e.preventDefault();
    copy(children);
    setClicked(true);
  };
  return (
    <b onClick={handleOnClick}>
      {}
      <Image
        alt="copy"
        src={
          clicked
            ? "https://upload.wikimedia.org/wikipedia/commons/3/3b/Eo_circle_green_checkmark.svg"
            : copyImg
        }
        width={`${size}px`}
        height={`${size}px`}
      />
    </b>
  );
};

export default CopyButton;
