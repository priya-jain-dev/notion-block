import React, { useState, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import SelectMenu from "./SelectMenu";
import { getCaretCoordinates, setCaretToEnd } from "./util/setCaretToEnd";

const CMD_KEY = "/";

const EditableBlock = ({
  id,
  html: initialHtml,
  tag: initialTag,
  updatePage,
  addBlock,
  deleteBlock,
}) => {
  const [htmlBackup, setHtmlBackup] = useState(null);
  const [html, setHtml] = useState(initialHtml);
  const [tag, setTag] = useState(initialTag);
  const [previousKey, setPreviousKey] = useState("");
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState(false);
  const [selectMenuPosition, setSelectMenuPosition] = useState({
    x: null,
    y: null,
  });

  const contentEditable = useRef("");

  useEffect(() => {
    setHtml(initialHtml);
    setTag(initialTag);
  }, [initialHtml, initialTag]);

  const prevHtml = useRef(initialHtml);
  const prevTag = useRef(initialTag);

  useEffect(() => {
    const htmlChanged = prevHtml.current !== html;
    const tagChanged = prevTag.current !== tag;
    if (htmlChanged || tagChanged) {
      updatePage({
        id: id,
        html: html,
        tag: tag,
      });
      // Update the ref values after the render
      prevHtml.current = html;
      prevTag.current = tag;
    }
  }, [id, html, tag, updatePage]);

  const onChangeHandler = (e) => {
    setHtml(e.target.value);
  };

  const onKeyDownHandler = (e) => {
    if (e.key === CMD_KEY) {
      setHtmlBackup(html);
    }
    if (e.key === "Enter") {
      if (previousKey !== "Shift" && !selectMenuIsOpen) {
        e.preventDefault();

        addBlock({
          id: id,
          ref: contentEditable.current,
        });
      }
    }
    if (e.key === "Backspace" && !prevHtml.current) {
      e.preventDefault();
      deleteBlock({
        id: id,
        ref: contentEditable.current,
      });
    }
    setPreviousKey(e.key);
  };

  const onKeyUpHandler = (e) => {
    if (e.key === CMD_KEY) {
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
    setHtmlBackup(null);
    setSelectMenuIsOpen(false);
    setSelectMenuPosition({
      x: null,
      y: null,
    });
    document.removeEventListener("click", closeSelectMenuHandler);
  };

  const tagSelectionHandler = (tag) => {
    if (contentEditable.current) {
      setTag(tag);
      setHtml(htmlBackup);
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
        className="Block"
        innerRef={contentEditable}
        html={html}
        tagName={tag}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
      />
    </>
  );
};

export default EditableBlock;
