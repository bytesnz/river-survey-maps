
let listElement: HTMLElement,
    headerElement: HTMLElement,
    currentlyShownElements: {
      button: HTMLElement,
      list: HTMLElement
    };

export function createNewList(label: string) {
  let elements = {
    button: document.createElement('button'),
    list: document.createElement('ol')
  };

  headerElement.appendChild(elements.button);
  listElement.appendChild(elements.list);

  elements.button.addEventListener('click', function selectButton(event) {
    if (currentlyShownElements === elements) {
      return;
    }

    if (currentlyShownElements) {
      currentlyShownElements.button.classList.remove('selected');
      currentlyShownElements.list.classList.remove('selected');
    }

    elements.button.classList.add('selected');
    elements.list.classList.add('selected');

    currentlyShownElements = elements;
  });

  return {
    /**
     * Removes the list
     */
    remove: function remove() {
      headerElement.removeChild(elements.button);
      listElement.removeChild(elements.list);
    },

    /**
     * Adds an item to the list
     */
    addItem: function addItem(): HTMLElement {
      const element = document.createElement('li');
      elements.list.appendChild(element);
      
      return element;
    },

    /**
     * Selects an element and moves it to the top of the list
     *
     * @param {HTMLElement} item Item to select
     * @param {boolean} exclusive If true, will select any currently selected
     *   items
     */
    select: function selectItem(item: HTMLElement, exclusive?: boolean): void {
    }

  };
}

export default function create(element: HTMLElement) {
  listElement = element;

  // Add header element
  headerElement = document.createElement('div');

  listElement.appendChild(headerElement);
}
