import { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

const EditableBlock = ({ id, html, tag }) => {
  const contentEditable = useRef("");
  const [block, setBlock] = useState({
    html: "",
    tag: "p",
  });

  useEffect(() => {
    setBlock({
      html: html,
      tag: tag,
    });
  }, []);

  const onChangeHandler = (e) => {
    setBlock({ html: e.target.value });
  };

  return (
    <>
      <ContentEditable
        className="Block"
        innerRef={contentEditable}
        html={block.html}
        tagName={block.tag}
        onChange={onChangeHandler}
      />
    </>
  );
};

export default EditableBlock;
