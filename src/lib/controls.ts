
/**
 * Adds a new section to the control layer
 *
 * @param {string} title Title for new section
 * @param {HTMLElement} [parentSection] Section to add the new section to
 *
 * @returns {HTMLElement} New section
 */
export function addControlSection(title: string, parentSection: HTMLElement, startCollapsed?: boolean): HTMLElement {
  let header = document.createElement('h1');
  let section = document.createElement('section');

  parentSection.appendChild(section);
  section.appendChild(header);
  header.innerHTML = title;
  header.addEventListener('click', (event) => {
    section.classList.toggle('collapsed');
  });

  if (startCollapsed) {
    section.classList.add('collapsed');
  }

  return section;
};

let mapListeners: Function[] = [];
