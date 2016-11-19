import * as Time from './time';
import color from './color';

let makeTime = (time: Date | number): Date => {
  if (typeof time === 'number') {
    time = new Date(time);
  }

  return time;
}

/**
 * Can have any number of marker sections, but only a single range down the
 * bottom.
 */
export default function Timescale(element: HTMLElement, options?) {
  let timeRanges = [],
      markerDivs = [];
  let timeRange = TimeRange();

  options = Object.assign({
    markerWidth: 10,
    minMarkerSpacing: 2,
  }, options);

  let position = (time: Date | number): number | undefined => {
    let currentRange = timeRange.getRange();

    time = makeTime(time);

    if (!currentRange === undefined) {
      return undefined;
    }

    // Get range difference
    let rangeDifference = currentRange[1].getTime() - currentRange[0].getTime();

    // Get time difference
    let timeDifference = time.getTime() - currentRange[0].getTime();

    if (timeDifference < 0 || timeDifference > rangeDifference) {
      return undefined;
    }

    // Calculate the relative position
    return (element.clientWidth - options.markerWidth) * (timeDifference / rangeDifference);
  };

  let TimeSlider = (initialMinTime?: Date | number, initialMaxTime?: Date | number) => {
    let timeRange = TimeRange(initialMinTime, initialMaxTime);

    // Create range sliders
    let minSlider, maxSlider, div;
    element.appendChild((minSlider = document.createElement('div')));
    minSlider.classList.add('slider', 'min');
    minSlider.appendChild((div = document.createElement('div')));
    div.classList.add('bar');
    minSlider.appendChild((div = document.createElement('div')));
    div.classList.add('arrow');

    element.appendChild((maxSlider = document.createElement('div')));
    maxSlider.classList.add('slider', 'max');
    maxSlider.appendChild((div = document.createElement('div')));
    div.classList.add('arrow');
    maxSlider.appendChild((div = document.createElement('div')));
    div.classList.add('bar');
    
    let updateSliders = () => {

    };

    return {
      getRange: timeRange.getRange,
      setRange: (newMinTime?: Date | number, newMaxTime?: Date | number) => {
        timeRange.setRange(newMinTime, newMaxTime);
        updateSliders();
      }
    };
  };

  let TimeMarkerDiv = (initialMarkers?: TimePoint[]) => {
    let markerDiv = document.createElement('div');
    markerDiv.classList.add('markers');
    element.insertBefore(markerDiv, element.firstChild);

    /**
     * Redraws all of the markers
     */
    let redraw = (markers: TimePoint[]) => {
      console.log('redraw called with markers', markers);
      if (markers === undefined) {
        return;
      }

      // Clear the current elements
      markerDiv.innerHTML = '';

      // Calculate the seconds per pixel
      let currentRange = timeRange.getRange();

      let currentGroup = [];
      let minPosition;
      let markerBuffer = options.markerWidth + options.minMarkerSpacing;
      let createMarker = () => {
        let div;
        markerDiv.appendChild((div = document.createElement('div')));
        if (currentGroup.length === 1) {
          div.classList.add('marker');
          div.style.background = color(currentGroup[0].marker.color, true);
          div.style.left = `${currentGroup[0].position}px`;
          minPosition = currentGroup[0].position + markerBuffer;
        } else {
          if (options.averageColor) {
            let averageColor = currentGroup.reduce((reducedColor, marker) => {
              return [reducedColor[0] + marker.marker.color[0], reducedColor[1] + marker.marker.color[1], reducedColor[2] + marker.marker.color[2]];
            }, [0, 0, 0]);
            averageColor = [averageColor[0]/currentGroup.length, averageColor[1] / currentGroup.length, averageColor[2] / currentGroup.length];
            div.style.background = color(averageColor);
          } else {
            let colorMap = {};
            currentGroup.forEach(marker => {
              let markerColor = marker.marker.color.slice(0, 3);
              console.log('markerColor', markerColor);
              if (colorMap[markerColor.toString()] === undefined) {
                colorMap[markerColor.toString()] = {
                  color: markerColor,
                  count: 1
                };
              } else {
                colorMap[markerColor.toString()].count++;
              }
            });

            if (Object.keys(colorMap).length === 1) {
              div.style.background = color(currentGroup[0].marker.color, true);
            } else {
              let colorString = '';
              let pixels = 0;
              Object.keys(colorMap).forEach(id => {
                colorString += (pixels ? ', ' : '') + color(colorMap[id].color, true) + (pixels ? pixels + 'px' : '') + ', ';
                pixels += (colorMap[id].count / currentGroup.length) * options.markerWidth;
                colorString += color(colorMap[id].color) + (pixels ? pixels + 'px' : '');
              });
              div.style.background = 'linear-gradient(to bottom, ' + colorString + ')';
            }

          }
          div.classList.add('multiMarker');
          let currentPosition = currentGroup[0].position + ((currentGroup[currentGroup.length - 1].position - currentGroup[0].position) / 2);
          div.style.left = `${currentPosition}px`;
          minPosition = currentPosition + markerBuffer;
        }
      };

      markers.forEach(marker => {
        let markerPosition = position(marker.time);
        if (currentGroup.length) {
          // Check if in current group
          if (markerPosition > (minPosition + markerBuffer)) {
            // Draw the current group
            createMarker();

            currentGroup = [];
          } else {
            // Add the marker to the group
            currentGroup.push({
              marker,
              position: markerPosition
            });
          }
        }
        
        if (!currentGroup.length) {
          minPosition = position(marker.time);
          currentGroup.push({
            marker,
            position: markerPosition
          });
        }
      });

      if (currentGroup.length) {
        createMarker();
      }
    };
    
    if (initialMarkers !== undefined) {
      redraw(initialMarkers);
    }

    return {
      redraw
    };
  };

  element.classList.add('timescale');

  // Create time Marker
  let timeMarker;
  element.appendChild((timeMarker = document.createElement('div')));
  let div;
  timeMarker.appendChild((div = document.createElement('div')));
  div.classList.add('line');
  timeMarker.classList.add('marker');

  return {
    // ...timeRange,
    setRange: timeRange.setRange,
    getRange: timeRange.getRange,
    extendRange: timeRange.extendRange,
    clearRange: timeRange.clearRange,
    resetRange: timeRange.resetRange,
    inside: timeRange.inside,
    addTimeRange: (initialMinTime?: Date | number, initialMaxTime?: Date | number): number => {
      return timeRanges.push(TimeSlider(initialMinTime, initialMaxTime));
    },
    removeTimeRange: (id: number) => {
      if (timeRanges[id] !== undefined) {
        delete timeRanges[id];
      }
    },
    /**
     * Adds a marker div
     *
     * @param {TimePoint|TimePoint[]} [markers] Markers to initially add to the
     *   marker div
     *
     * @returns {number} ID of the new marker div
     */
    addMarkerDiv: (markers?: TimePoint[]): MarkerDiv => {
      let markerDiv = TimeMarkerDiv(markers);
      markerDivs.push(markerDiv);
      return markerDiv;
    },
    /**
     * Remove a marker div
     *
     * @param {number} id ID of the marker div to remove
     */
    removeMarkerDiv: (id: number) => {
      if (markerDivs[id] !== undefined) {
        delete markerDivs[id];
      }
    }
  };
}

export function TimeRange(initialMinTime?: Date | number, initialMaxTime?: Date | number): TimeRange {
  let minTime, maxTime;

  let setRange = (newMinTime?: Date | number, newMaxTime?: Date | number) => {
    if (newMinTime !== undefined) {
      minTime = makeTime(newMinTime);
    }

    if (newMaxTime !== undefined) {
      maxTime = makeTime(newMaxTime);
    }
  };


  setRange(initialMinTime, initialMaxTime);

  return <TimeRange>{
    /**
     * Sets the time range
     *
     * @param {Date|number|undefined} [newMinTime] New time or epoch seconds minimum
     * @param {Date|number|undefined} [newMaxTime] New time or epoch seconds maximum
     */
    setRange,
    extendRange: (newMinTime?: Date | number, newMaxTime?: Date | number) => {
      if (newMinTime !== undefined) {
        newMinTime = makeTime(newMinTime);
        if (minTime === undefined || newMinTime.getTime() < minTime.getTime()) {
          minTime = newMinTime;
        }
      }
      if (newMaxTime !== undefined) {
        newMaxTime = makeTime(newMaxTime);
        if (maxTime === undefined || newMaxTime.getTime() < maxTime.getTime()) {
          maxTime = newMaxTime;
        }
      }
    },
    /**
     * Resets the time range to the original time range
     */
    resetRange: () => {
      setRange(initialMinTime, initialMaxTime);
    },
    /**
     * Clears the time range
     */
    clearRange: () => {
      minTime = undefined;
      maxTime = undefined;
    },
    getRange: () => [minTime, maxTime],
    /**
     * Checks whether the given time is in the current time range
     *
     * @param {Date|number} time Date or UTC seconds since epoch to check if
     *   is in the current range
     *
     * @returns {boolean} Whether the given time is in the range
     */
    inside: (time: Date | number) => {
      if (time instanceof Date) {
        time = time.getTime() / 1000;
      }
      
      return (time >= (minTime.getTime()/1000) && time <= (maxTime.getTime()/1000));
    }
  };
}

