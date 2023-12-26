export const setCaretToEnd = (element) => {
  if (element && element.nodeType === Node.ELEMENT_NODE) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  }
};
