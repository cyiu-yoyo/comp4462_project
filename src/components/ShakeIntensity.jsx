import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import moment from "moment";
import { map, groupBy, meanBy, filter } from "lodash";

const startTime = "2020-04-06 00:00:00";
const endTime = "2020-04-11 00:00:00";

const ShakeIntensity = (props) => {
  const { rawData } = props;
  const [data, setData] = useState([]);
  const ref = useRef();

  const processData = (rawData) => {
    let filterByTimeRawData = filter(
      rawData,
      (record) =>
        moment(record.time).isAfter(startTime) &&
        moment(record.time).isBefore(endTime)
    );
    let filterByValidShakeIntensity = filter(
      filterByTimeRawData,
      (record) => record.shake_intensity !== ""
    );

    let intensityWithTime = map(filterByValidShakeIntensity, (val) => {
      let intensity = parseInt(val.shake_intensity, 10);
      return {
        shake_intensity: intensity < 0 ? -intensity : intensity,
        time: moment(val.time).format("YYYY-MM-DD hh:mm"),
      };
    });
    let groupByTime = groupBy(intensityWithTime, (val) => val.time);
    let meanIntensity = map(groupByTime, (records, time) => {
      return {
        shake_intensity: meanBy(records, (record) => record.shake_intensity),
        time: time,
      };
    });
    console.log(meanIntensity);
    return meanIntensity;
  };

  useEffect(() => {
    setData(processData(rawData));
  }, [rawData]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const line = d3
      .line()
      .x((d) => d.time)
      .y((d) => d.shake_intensity)
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      // .attr("stroke-width", strokeWidth)
      .attr("class", "line")
      .attr("d", line);
    // .attr("class", classnames(["line-chart__path", lineClass]));
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default ShakeIntensity;
