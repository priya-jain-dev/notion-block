import { useState } from "react";
import { uid } from "./util/uid";
import EditableBlock from "./EditableBlock";
import { setCaretToEnd } from "./util/setCaretToEnd";

const initialBlock = {
  id: uid(),
  html: "",
  tag: "p",
  previousKey: "",
  htmlBackup: null,
};

function Editor() {
  const [blocks, setBlocks] = useState([initialBlock]);

  const updatePageHandler = (updatedBlock) => {
    console.log(updatedBlock);
    const _blocks = blocks;
    const index = _blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [..._blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    setBlocks(updatedBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    setBlocks((prevBlocks) => {
      console.log(prevBlocks);
      const newBlock = { id: uid(), html: "", tag: "p" };
      const index = prevBlocks.findIndex((b) => b.id === currentBlock.id);
      if (index !== -1) {
        const updatedBlocks = [...prevBlocks];
        updatedBlocks.splice(index + 1, 0, newBlock);
        return updatedBlocks;
      }
      return prevBlocks;
    });

    setTimeout(() => {
      if (currentBlock.ref.nextElementSibling) {
        currentBlock.ref.nextElementSibling.focus();
      }
    }, 0);
  };
  const deleteBlockHandler = (currentBlock) => {
    const previousBlock = currentBlock.ref.previousElementSibling;
    if (previousBlock) {
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
      setCaretToEnd(previousBlock);
      previousBlock.focus();
    }
  };

  return (
    <div className="Editor">
      {blocks.map((block, key) => {
        return (
          <EditableBlock
            key={key}
            id={block.id}
            tag={block.tag}
            html={block.html}
            updatePage={updatePageHandler}
            addBlock={addBlockHandler}
            deleteBlock={deleteBlockHandler}
          />
        );
      })}
    </div>
  );
}

export default Editor;
