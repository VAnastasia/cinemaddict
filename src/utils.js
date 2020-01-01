export const formatRuntime = (minutes) => {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

const DESCRIPTION_TRUNCATE_LENGTH = 140;

export const truncateString = (str, num = DESCRIPTION_TRUNCATE_LENGTH) =>
  str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + `...` : str;

const dateFormat = new Intl.DateTimeFormat(`en-GB`, {
  month: `long`,
  day: `numeric`,
  year: `numeric`
});

export const formatDate = (date) => dateFormat.format(date);

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

// Рендер и анрендер для компонент
export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};
