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
  noneIsSelected?: boolean,
  enableColor?: boolean
};
