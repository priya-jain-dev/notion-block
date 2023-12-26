import { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import { setCaretToEnd } from "./util/setCaretToEnd";
import SelectMenu from "./SelectMenu";

const getCaretCoordinates = () => {
  let x, y;
  const selection = window.getSelection();
  if (selection.rangeCount !== 0) {
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(false);
    const rect = range.getClientRects()[0];
    if (rect) {
      x = rect.left;
      y = rect.top;
    }
  }
  return { x, y };
};
const EditableBlock = ({ id, html, tag, addBlock, deleteBlock }) => {
  const contentEditable = useRef("");
  const [block, setBlock] = useState({
    htmlBackup: null,
    html: "",
    tag: "p",
    previousKey: "",
  });

  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState(false);
  const [selectMenuPosition, setSelectMenuPosition] = useState({
    x: null,
    y: null,
  });

  useEffect(() => {
    setBlock({
      id: id,
      html: html,
      tag: tag,
    });
  }, [id, html, tag]); // Watch for changes in id, html, and tag props

  const onChangeHandler = (e) => {
    setBlock((prevBlock) => ({ ...prevBlock, html: e.target.value }));
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

  const onKeyUpHandler = (e) => {
    if (e.key === "/") {
      openSelectMenuHandler();
    }
  };

  const openSelectMenuHandler = () => {
    const { x, y } = getCaretCoordinates();
    setSelectMenuIsOpen(true);
    setSelectMenuPosition({
      x,
      y,
    });
    document.addEventListener("click", closeSelectMenuHandler);
  };

  const closeSelectMenuHandler = () => {
    setBlock((preBlock) => ({
      ...preBlock,
      htmlBackup: null,
    }));
    setSelectMenuIsOpen(false);
    setSelectMenuPosition({
      x: null,
      y: null,
    });
    document.removeEventListener("click", closeSelectMenuHandler);
  };

  const tagSelectionHandler = (tag) => {
    if (contentEditable.current) {
      setBlock((preBlock) => ({
        ...preBlock,
        tag: tag,
        html: block.htmlBackup,
      }));
      setCaretToEnd(contentEditable.current);
    }
    closeSelectMenuHandler();
  };
  return (
    <>
      {selectMenuIsOpen && (
        <SelectMenu
          position={selectMenuPosition}
          onSelect={tagSelectionHandler}
          close={closeSelectMenuHandler}
        />
      )}
      <ContentEditable
        className={"Block"}
        innerRef={contentEditable}
        html={block.html}
        tagName={block.tag}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
      />
    </>
  );
};

export default EditableBlock;
