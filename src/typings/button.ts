interface Button {
  label?: string,
  id?: string,
  value?: any,
  color?: HSLColor | string,
  textColor?: HSLColor | string
};

interface FilterButtonOptions {
  operationButtons?: boolean | number[],
  operationTimeout?: number,
  numeric?: boolean,
  rounding?: 'ceiling' | 'floor' | 'round' | Function,
  noneIsSelected?: boolean,
  enableColor?: boolean
};
