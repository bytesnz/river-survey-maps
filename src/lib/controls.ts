
/**
 * Adds a new section to the control layer
 *
 * @param {string} title Title for new section
 * @param {HTMLElement} [parentSection] Section to add the new section to
 *
 * @returns {HTMLElement} New section
 */
export function addControlSection(title: string, parentSection: HTMLElement): HTMLElement {
  let header = document.createElement('h1');
  let section = document.createElement('section');
  let main = document.createElement('div');

  parentSection.appendChild(section);
  section.appendChild(header);
  section.appendChild(main);
  header.innerHTML = title;
  header.addEventListener('click', (event) => {
    section.classList.toggle('collapsed');
  });

  return main;
};

let mapListeners: Function[] = [];
