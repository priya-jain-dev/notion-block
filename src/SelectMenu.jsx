import { useEffect, useState } from "react";

const MENU_HEIGHT = 150;
const allowedTags = [
  {
    id: "page-title",
    tag: "h1",
    label: "Page Title",
  },
  {
    id: "heading",
    tag: "h2",
    label: "Heading",
  },
  {
    id: "subheading",
    tag: "h3",
    label: "Subheading",
  },
  {
    id: "paragraph",
    tag: "p",
    label: "Paragraph",
  },
];

const SelectMenu = ({ onSelect, close, position }) => {
  const [menu, setMenu] = useState({
    command: "",
    items: allowedTags,
    selectedItem: 0,
  });
  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("keydown", keyDownHandler);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []); // Empty dependency array ensures this effect runs only once during mount and cleans up during unmount

  const keyDownHandler = (e) => {
    const items = menu.items;
    const selected = menu.selectedItem;
    const command = menu.command;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        onSelect(items[selected].tag);
        break;
      case "Backspace":
        if (!command) close();
        setMenu((prevMenu) => ({
          ...prevMenu,
          command: command.substring(0, command.length - 1),
        }));
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevSelected = selected === 0 ? items.length - 1 : selected - 1;
        setMenu((prevMenu) => ({ ...prevMenu, selectedItem: prevSelected }));
        break;
      case "ArrowDown":
      case "Tab":
        e.preventDefault();
        const nextSelected = selected === items.length - 1 ? 0 : selected + 1;
        setMenu((prevMenu) => ({ ...prevMenu, selectedItem: nextSelected }));
        break;
      default:
        setMenu((prevMenu) => ({
          ...prevMenu,
          command: menu.command + e.key,
        }));
        break;
    }
  };

  const x = position.x;
  const y = position.y - MENU_HEIGHT;
  const positionAttributes = { top: y, left: x };

  return (
    <div className="SelectMenu" style={positionAttributes}>
      <div className="Items">
        {menu.items.map((item, key) => {
          const selectedItem = menu.selectedItem;
          const isSelected = menu.items.indexOf(item) === selectedItem;
          return (
            <div
              className={isSelected ? "Selected" : null}
              key={key}
              role="button"
              tabIndex="0"
              onClick={() => onSelect(item.tag)}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectMenu;
