interface TimeRange {
  setRange(newMinTime?: Date | number, newMaxTime?: Date | number),
  extendRange(newMinTime?: Date | number, newMaxTime?: Date | number),
  getRange(): [Date, Date],
  clearRange(),
  resetRange(),
  inside(time: Date | number): boolean
};

interface MarkerDiv {
  redraw(markers: TimePoint[])
}

interface Timescale extends TimeRange {
  addTimeRange(initialMinTime?: Date | number, initialMaxTime?: Date | number): number,
  removeTimeRange(id: number),
  addMarkerDiv(markers?: TimePoint[]): MarkerDiv,
};

interface TimePoint {
  color: HSLColor,
  time: Date | number
};

interface TimeMarker {
  remove(noUpdate?: boolean),
  updateColor(color: HSLColor, noUpdate?: boolean)
}
