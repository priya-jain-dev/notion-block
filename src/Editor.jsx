import { useState } from "react";
import "./Editor.css";
import { uid } from "./util/uid";
import EditableBlock from "./EditableBlock";

const initialBlock = { id: uid(), html: "<p>hello world !!!</p>", tag: "p" };

function Editor() {
  const [blocks, setBlocks] = useState([initialBlock]);

  return (
    <div className="Editor">
      {blocks.map((block, key) => {
        return (
          <EditableBlock
            key={key}
            id={block.id}
            tag={block.tag}
            html={block.html}
          />
        );
      })}
    </div>
  );
}

export default Editor;
