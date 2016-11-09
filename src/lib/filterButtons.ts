interface Button {
  label?: string,
  id?: string | number,
  color: HSLColor
};

interface FilterButtonOptions {
  operationButtons?: boolean | number[],
  operationTimeout?: number,
  numeric?: boolean,
  rounding?: 'ceiling' | 'floor' | Function,
  noneIsSelected?: boolean
};

const operationSymbols = ['&lt;', '&oplus;', '&gt;'];
export const [LESS_EQUAL, EXCLUSIVE, GREATER_EQUAL] = [0, 1, 2];

export default function FilterButtons(buttons: Button[], options?: FilterButtonOptions, element?: HTMLElement, selected?: any[]) {
  if (selected === true) {
    selected = [];
    buttons.forEach((buttonData, buttonIndex) => {
      selected.push(buttonData.id !== undefined ? buttonData.id : buttonIndex);
    });
  } else {
    selected = selected || [];
  }

  options = options || {};

  let listeners = [];
  let buttonDivs: HTMLElement[][] = [];
  let allButtons: HTMLElement[] = [];
  let lastOperation: number;
  let lastOperationIndex: number;
  let lastOperationTimeout: number;
  let map = {};

  buttons.forEach((buttonData, buttonIndex) => {
    map[(buttonData.id !== undefined ? buttonData.id : buttonIndex)] = buttonIndex;
  });

  let clearLastOperation = () => {
    lastOperation = undefined;
    lastOperationIndex = undefined;
    lastOperationTimeout = undefined;
  };

  let trueOrIn = (variable: boolean | (string | number)[], operation: number | string) => {
    return (variable === true
        || (variable instanceof Array
        && variable.indexOf(operation) !== -1));
  };

  /**
   * Changes the selected values based on a given value and an operation
   *
   * @param {string|number} id ID of the value to use for the change in
   *   selection, either the index of the item in the button array, or the
   *   id value of an item in the button array (will be checked in that order)
   * @param {number} [operation] Operation to carry out in selection
   * @param {Event|boolean} [event] If an event, the event will be checked
   *   to see if the default has been prevented, if so, the selection will not
   *   run. Default will also be prevented if it does run. If true, the current
   *   selection will be cleared before the operation. If false (default), the
   *   current selection will not be cleared.
   *
   * @returns {boolean} Whether or not the selection operation was carried out
   */
  let select = (id?: string | number | boolean | (string | number)[], operation?: number, event?: Event | boolean) => {
    if (event instanceof Event) {
      if (event.defaultPrevented) {
        return false;
      }
      event.preventDefault();
    }

    if (lastOperationTimeout !== undefined) {
      clearTimeout(lastOperationTimeout);
      lastOperationTimeout = undefined;
    }

    if (id === undefined || typeof id === 'boolean' || id instanceof Array) {
      if (id === undefined) {
        if (selected.length === buttons.length) {
          selected.length = 0;
        } else {
          selected.length = 0;
          selected.push.apply(selected, Object.keys(map));
        }
      } else {
        selected.length = 0;
        if (id === true) {
          selected.push.apply(selected, Object.keys(map));
        } else if (id instanceof Array) {
          selected.concat(id);
        }
      }

      buttons.forEach((buttonData, buttonIndex) => {
        let value = String(buttonData.id !== undefined ? buttonData.id : buttonIndex);
        if (buttonDivs[buttonIndex]) {
          buttonDivs[buttonIndex].forEach((div) => {
            if (selected.indexOf(value) !== -1) {
              div.classList.add('selected');
            } else {
              div.classList.remove('selected');
            }
          });
        }
      });
    } else {
      let exclusive;

      let index: number;

      // Map id to index
      if (map[id] !== undefined) {
        index = map[id];
      } else if (typeof id === 'number' && id >= 0 && id < buttons.length) {
        index = id;
      } else {
        return false;
      }

      id = (buttons[id].id !== undefined ? buttons[id] : index);

      if (typeof operation === 'number') {
        exclusive = (typeof event === 'boolean' ? event
            : (lastOperation === operation && lastOperationIndex === index) ? true : false);
        lastOperation = undefined;
        lastOperationIndex = undefined;
      }

      switch (operation) {
        case EXCLUSIVE:
          // Clear the currently selected
          selected.length = 0;
          selected.push(id);

          buttonDivs.forEach((buttons, b) => {
            buttons.forEach(div => {
              if (b === index) {
                div.classList.add('selected');
              } else {
                div.classList.remove('selected');
              }
            });
          });
          break;
        case LESS_EQUAL:
        case GREATER_EQUAL:
          if (exclusive) {
            // Clear the currently selected
            selected.length = 0;
            buttonDivs.forEach((buttons, b) => {
              buttons.forEach(div => {
                div.classList.remove('selected');
              });
            });
          } else {
            lastOperation = operation;
            lastOperationIndex = index;
          }

          if (operation === LESS_EQUAL) {
            for (let i = index; i >= 0; i--) {
              let value = (buttons[i].id !== undefined ? buttons[i].id : i);
              // Add to selected if not already in there
              if (selected.indexOf(value) === -1) {
                selected.push(value);
                buttonDivs[i].forEach(div => {
                  div.classList.add('selected');
                })
              }
            }
          } else {
            for (let i = index; i < buttons.length; i++) {
              let value = (buttons[i].id !== undefined ? buttons[i].id : i);
              // Add to selected if not already in there
              if (selected.indexOf(value) === -1) {
                selected.push(value);
                buttonDivs[i].forEach(div => {
                  div.classList.add('selected');
                })
              }
            }
          }

          if (lastOperation !== undefined && options.operationTimeout) {
            // create timeout to clear lastOperation
            lastOperationTimeout = setTimeout(clearLastOperation,
                options.operationTimeout);
          }

          break;
        default:
          // Toggle given id value
          let selectedIndex;
          if ((selectedIndex = selected.indexOf(id)) === -1) {
            selected.push(id);
            buttonDivs[index].forEach(div => {
              div.classList.add('selected');
            });
          } else {
            selected.splice(selectedIndex, 1);
            buttonDivs[index].forEach(div => {
              div.classList.remove('selected');
            });
          }
          break;
      }
    }

    // Toggle all buttons
    allButtons.forEach(button => {
      if (selected.length === buttons.length) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });

    // Run listeners
    listeners.forEach(callback => {
      callback();
    });
  }

  let createButtons = (element: HTMLElement) => {
    let button = document.createElement('button');
    button.innerHTML = 'All';
    button.addEventListener('click', select.bind(null, undefined, undefined));
    if (selected.length === buttons.length) {
      button.classList.add('selected');
    }
    allButtons.push(button);
    element.appendChild(button);

    buttons.forEach((buttonData, buttonIndex) => {
      let button = document.createElement('div');
      if (buttonDivs[buttonIndex] === undefined) {
        buttonDivs[buttonIndex] = [];
      }
      buttonDivs[buttonIndex].push(button);

      let operationButton;
      element.appendChild(button);
      button.classList.add('button');
      if (typeof buttonData.id === 'string') {
        button.classList.add(buttonData.id);
      }
      button.innerHTML = buttonData.label
          || String(buttonData.id !== undefined ? buttonData.id : buttonIndex);
      buttons[buttonData.id] = button;

      // Add the operation buttons
      operationSymbols.forEach((symbol, operation) => {
        if (trueOrIn(options.operationButtons, operation)) {
          button.appendChild((operationButton = document.createElement('div')));
          operationButton.innerHTML = symbol;
          operationButton.addEventListener('click', select.bind(null, buttonIndex, operation));
        }
      });

      button.addEventListener('click', select.bind(null, buttonIndex, undefined));

      if (trueOrIn(selected, String(buttonData.id ? buttonData.id : buttonIndex))) {
        button.classList.add('selected');
      }
    });
  };

  // Create the buttons if given an element to put them in
  if (element) {
    createButtons(element);
  }

  return {
    createButtons,
    select,
    addListener: (func: Function) => {
      let id: number;
      if ((id = listeners.indexOf(func)) !== -1) {
        return id;
      }

      return listeners.push(func) - 1;
    },
    removeListener: (item: number | Function) => {
      let id: number;
      if (typeof item === 'number' && typeof listeners[item] !== 'undefined') {
        delete listeners[item];
      } else if (typeof item === 'function'
          && (id = listeners.indexOf(item)) !== -1) {
        delete listeners[id];
      }
    },
    selected: (id?: string | number): string[] | boolean => {
      if (id === undefined) {
        return selected;
      } else if (selected.length == buttons.length || options.noneIsSelected && selected.length === 0) {
        return true;
      } else if (map[id] !== undefined) {
        return (selected.indexOf(id) !== -1);
      } else if (options.numeric) {
        if (typeof options.rounding === 'function') {
          return (selected.indexOf(options.rounding(id)) !== -1);
        } else if (options.rounding === 'ceiling') {
          // TODO
        } else if (options.rounding === 'floor') {
          // TODO
        }
      }
    }
  };
}
