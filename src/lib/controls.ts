
/**
 * Adds a new section to the control layer
 *
 * @param {string} title Title for new section
 * @param {HTMLElement} [parentSection] Section to add the new section to
 *
 * @returns {HTMLElement} New section
 */
export function addControlSection(title: string, parentSection: HTMLElement, startCollapsed?: boolean): ControlSection {
  let header = document.createElement('h1');
  let section: ControlSection = <ControlSection>document.createElement('section');
  section.collapse = (collapse?: boolean) => {
    if (typeof collapse === 'boolean') {
      if (collapse) {
        section.classList.add('collapsed');
      } else {
        section.classList.remove('collapsed');
      }
    } else {
      section.classList.toggle('collapsed');
    }
  }
  section.clicked = false;

  parentSection.appendChild(section);
  section.appendChild(header);
  header.innerHTML = title;
  header.addEventListener('click', (event) => {
    section.collapse();
  });

  if (startCollapsed) {
    console.log(title, 'starting collapsed');
    section.collapse(true);
  }

  return section;
};
