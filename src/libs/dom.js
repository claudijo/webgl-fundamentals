export const createElement = (tagName, attributes = {}, style = {}) => {
  const element = document.createElement(tagName);
  for (const key of Object.keys(attributes)) {
    element.setAttribute(key, attributes[key]);
  }

  for (const key of Object.keys(style)) {
    element.style[key] = style[key];
  }

  return element;
}