import Color from './color';

const operationSymbols = ['&#8804;', '&oplus;', '&#8805;'];
export const [LESS_EQUAL, EXCLUSIVE, GREATER_EQUAL] = [0, 1, 2];

export default function FilterButtons(buttons: Button[], options?: FilterButtonOptions, element?: HTMLElement, selected?/*TODO : string[] | true*/) {
  let values = false;
  let ids = false;
  let listeners = [];
  let buttonDivs: HTMLElement[][] = [];
  let allButtons: HTMLElement[] = [];
  let lastOperation: number;
  let lastOperationIndex: number;
  let lastOperationTimeout: number;
  let idMap = {};
  let valueMap = [];
  let colored = Boolean(options.enableColor);

  options = options || {};

  /**@internal
   * Clears the last operation timer (used for having a timeout on the
   * two-stage operation buttons)
   */
  let clearLastOperation = () => {
    lastOperation = undefined;
    lastOperationIndex = undefined;
    lastOperationTimeout = undefined;
  };

  /**@internal
   * Gets an buttons index from a given id using the id and value maps
   *
   * @param {string|number} id ID to check for the index of
   *
   * @returns {number|undefined}
   */
  let getIndex = (id: string | number): number => {
    let index;
    if (typeof id === 'string') {
      if ((index = idMap[id]) !== undefined) {
        return index;
      }
    } else {
      if (values) {
        if((index = valueMap[id]) !== undefined) {
          return index;
        }
      } else {
        if (id == Math.round(id) && id >= 0 && id < buttons.length) {
          return id;
        }
      }
    }
  };
  let getId = (index: number): string | number => (buttons[index].id || (buttons[index].value !== undefined ? buttons[index].value : index));
  let getLabel = (index: number): string => (buttons[index].label || buttons[index].id || (buttons[index].value !== undefined ? buttons[index].value.toString() : index.toString()));
  let getValue = (index: number): number => (buttons[index].value !== undefined ? buttons[index].value : index);

  let trueOrIn = (variable: boolean | (string | number)[], operation: number | string) => {
    return (variable === true
        || (variable instanceof Array
        && variable.indexOf(operation) !== -1));
  };

  let getIndexFromValue = (value: number): number => {
    if (!options.numeric) {
      return;
    }

    if (typeof options.rounding === 'function') {
      return options.rounding(value);
    }
    if (!values) {
      switch(options.rounding) {
        case 'ceiling':
          value = Math.ceil(value);
          break;
        case 'floor':
          value = Math.floor(value);
          break;
        case 'round':
        default:
          value = Math.round(value);
      }
      value = Math.max(0, Math.min(value, buttons.length - 1));
      console.log('rounded value is', value);
      return value;
    } else {
      if (options.rounding === 'ceiling') {
        let roundedId;
        for(let i = 0; i < buttons.length - 1; i++) {
          // Calculate upper value
          let upperValue = getValue(i);
          if (value < upperValue) {
            roundedId = i;
            break;
          }
        }

        //console.log('rounding got', value, roundedId);
        if (roundedId === undefined) {
          value = buttons.length - 1;
        } else {
          value = roundedId;
        }
      } else if (options.rounding === 'floor') {
        let roundedId;
        for(let i = buttons.length - 1; i > 0; i--) {
          // Calculate upper value
          let upperValue = getValue(i);
          if (value >= upperValue) {
            roundedId = i;
            break;
          }
        }

        //console.log('rounding got', value, roundedId);
        if (roundedId === undefined) {
          value = 0;
        } else {
          value = roundedId;
        }
      } else {
        let roundedId;
        for(let i = 0; i < buttons.length - 1; i++) {
          // Calculate upper value
          let currentValue = getValue(i);
          let upperValue = currentValue + ((getValue(i + 1) - currentValue) / 2);
          if (value < upperValue) {
            roundedId = i;
            break;
          }
        }

        //console.log('rounding got', value, roundedId);
        if (roundedId === undefined) {
          value = buttons.length - 1;
        } else {
          value = roundedId;
        }
      }
    }

    return value;
  }


  let updateButtonStyle = (id: number, div: HTMLElement, select: boolean) => {
    //console.log('updateButtonStyle called', id, select, colored, buttons[id].color);
    if (select) {
      div.classList.add('selected');
      if (colored) {
        div.style.background = Color(buttons[id].color) || '';
        div.style.color = Color(buttons[id].textColor) || '';
      } else {
        div.style.background = '';
        div.style.color = '';
      }
    } else {
      div.classList.remove('selected');
      div.style.background = '';
      div.style.color = '';
    }
  }

  let updateStyleById = (index: number, select?: boolean, div?: HTMLElement) => {
    if (select === undefined) {
      select = (selected.indexOf(index) !== -1);
    }
    if (div) {
      updateButtonStyle(index, div, select);
    } else {
      if (buttonDivs[index] instanceof Array && buttonDivs[index].length) {
        buttonDivs[index].forEach((div, id) => {
          updateButtonStyle(index, div, select);
        });
      }
    }
  }

  let updateStyle = (buttonId?: string | number, select?: boolean, div?: HTMLElement) => {
    //console.log('updateStyle called', buttonId, select, div);
    if (buttonId !== undefined) {
      let index;
      if ((index = getIndex(buttonId)) !== undefined) {
        updateStyleById(index, select, div);
      }
    } else {
      buttons.forEach((data, index) => {
        updateStyleById(index, select);
      });
    }
  }

  let selectById = (index: number, operation?: number, event?: Event) => {
    let exclusive;

    if (event instanceof Event) {
      if (event.defaultPrevented) {
        return false;
      }
      event.preventDefault();

      if (lastOperationTimeout !== undefined) {
        clearTimeout(lastOperationTimeout);
        lastOperationTimeout = undefined;
      }
    }

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
        selected.push(index);

        updateStyle();
        break;
      case LESS_EQUAL:
      case GREATER_EQUAL:
        if (exclusive) {
          // Clear the currently selected
          selected.length = 0;
          updateStyle();
        } else {
          lastOperation = operation;
          lastOperationIndex = index;
        }

        if (operation === LESS_EQUAL) {
          for (let i = index; i >= 0; i--) {
            // Add to selected if not already in there
            if (selected.indexOf(i) === -1) {
              selected.push(i);
              updateStyleById(i, true);
            }
          }
        } else {
          for (let i = index; i < buttons.length; i++) {
            // Add to selected if not already in there
            if (selected.indexOf(i) === -1) {
              selected.push(i);
              updateStyleById(i, true);
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

        if ((selectedIndex = selected.indexOf(index)) === -1) {
          selected.push(index);
          buttonDivs[index].forEach(div => {
            updateButtonStyle(index, div, true);
          });
        } else {
          selected.splice(selectedIndex, 1);
          buttonDivs[index].forEach(div => {
            updateButtonStyle(index, div, false);
          });
        }
        break;
    }

    if (event instanceof Event) {
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
  }

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

    console.log('select called', id, operation);

    if (id === undefined || typeof id === 'boolean' || id instanceof Array) {
      if (id === undefined) {
        if (selected.length === buttons.length) {
          selected.length = 0;
        } else {
          selected.length = 0;
          buttons.forEach((d, i) => selected.push(i));
        }
      } else {
        selected.length = 0;
        if (id === true) {
          buttons.forEach((d, i) => selected.push(i));
        } else if (id instanceof Array) {
          selected.concat(id);
        }
      }

      updateStyle();
    } else {
      let index: number;

      // Map id to index
      if ((index = getIndex(id)) === undefined) {
        console.log('couldn\'t find index for', id);
        return false;
      }

      selectById(index, operation);
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
    let button = document.createElement('div');
    button.classList.add('button');
    button.setAttribute('role', 'button');
    let span;
    button.appendChild((span = document.createElement('span')));
    span.innerHTML = 'All';
    button.addEventListener('click', select.bind(null, undefined, undefined));
    if (selected.length === buttons.length) {
      button.classList.add('selected');
    }
    allButtons.push(button);
    element.appendChild(button);

    buttons.forEach((buttonData, buttonIndex) => {
      let id = getId(buttonIndex)
      let button = document.createElement('div');
      let span;
      if (buttonDivs[buttonIndex] === undefined) {
        buttonDivs[buttonIndex] = [];
      }
      buttonDivs[buttonIndex].push(button);

      let operationButton;
      element.appendChild(button);
      button.classList.add('button');
      button.setAttribute('role', 'button');
      if (typeof buttonData.id === 'string') {
        button.classList.add(buttonData.id);
      }
      button.appendChild((span = document.createElement('span')));
      span.innerHTML = getLabel(buttonIndex);

      // Add the operation buttons
      operationSymbols.forEach((symbol, operation) => {
        if ((operation === 0 && buttonIndex === 0)
          || (operation == 2 && buttonIndex === buttons.length-1)) {
          return;
        }
        if (trueOrIn(options.operationButtons, operation)) {
          button.appendChild((operationButton = document.createElement('div')));
          operationButton.innerHTML = symbol;
          operationButton.addEventListener('click', selectById.bind(null, buttonIndex, operation));
        }
      });

      button.addEventListener('click', selectById.bind(null, buttonIndex, undefined));

      updateButtonStyle(buttonIndex, button, (selected.indexOf(buttonIndex) !== -1));
    });
  };



  // Create a map of string ids to button array index
  buttons.forEach((buttonData, buttonIndex) => {
    if (!ids && buttonData.id !== undefined) {
      idMap[buttonData.id] = buttonIndex;
      ids = true;
    }
    if (buttonData.value !== undefined || buttonData.value === buttonIndex) {
      valueMap[buttonData.value] = buttonIndex;
      values = true;
    } else {
      valueMap[buttonIndex] = buttonIndex;
    }
  });

  if (selected === true) {
    selected = [];
    buttons.forEach((d, i) => selected.push(i));
  } else if (!(selected instanceof Array)) {
    selected = [];
  } else {
    if (ids || values) {
      let mappedSelected = [];
      selected.forEach(id => {
        let index;
        if ((index = getIndex(id)) !== undefined) {
          mappedSelected.push(index);
        }
      });
      selected = mappedSelected;
    }
  }

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
      let index;
      if (id === undefined) {
        return selected;
      } else if (selected.length == buttons.length || options.noneIsSelected && selected.length === 0) {
        return true;
      } else if ((index = getIndex(id)) !== undefined) {
        return (selected.indexOf(index) !== -1);
      } else if (typeof id === 'number' && options.numeric) {
        id = getIndexFromValue(id);
        //console.log('is Selected', id, selected);
        return (selected.indexOf(id) !== -1);
      }
    },
    getColor: (id: string | number): HSLColor | string => {
      console.log('getColor called', id);
      let index;
      if ((index = getIndex(id)) !== undefined) {
        return buttons[index].color;
      } else if (typeof id === 'number' && options.numeric) {
        //console.log('numeric');
        id = getIndexFromValue(id);
        console.log('color of', id, buttons[id].color);
        return buttons[id].color;
      }
    },
    color: (enable?: boolean) => {
      let current = colored;
      if (enable === true) {
        colored = true;
      } else if (enable === false) {
        colored = false;
      } else {
        colored = !colored;
      }

      if (current !== colored) {
        updateStyle();
      }

      return colored;
    }
  };
}
