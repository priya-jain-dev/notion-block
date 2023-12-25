import { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

const EditableBlock = ({ id, html, tag, addBlock, deleteBlock }) => {
  const contentEditable = useRef("");
  const [block, setBlock] = useState({
    html: "",
    tag: "p",
  });

  useEffect(() => {
    setBlock({
      id: id,
      html: html,
      tag: tag,
    });
  }, [id, html, tag]); // Watch for changes in id, html, and tag props

  const onChangeHandler = (e) => {
    setBlock({ ...block, html: e.target.value });
  };

  const onKeyDownHandler = (e) => {
    if (e.key === "/") {
      setBlock((prevBlock) => ({ ...prevBlock, htmlBackup: prevBlock.html }));
    }
    if (e.key === "Enter") {
      if (block.previousKey !== "Shift") {
        e.preventDefault();
        addBlock({
          id: id,
          ref: contentEditable.current,
        });
      }
    }
    if (e.key === "Backspace" && !block.html) {
      e.preventDefault();
      deleteBlock({
        id: id,
        ref: contentEditable.current,
      });
    }
    setBlock((prevBlock) => ({ ...prevBlock, previousKey: e.key }));
  };

  return (
    <>
      <ContentEditable
        className="Block"
        innerRef={contentEditable}
        html={block.html}
        tagName={block.tag}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
      />
    </>
  );
};

export default EditableBlock;
