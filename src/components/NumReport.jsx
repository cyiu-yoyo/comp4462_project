import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import moment from "moment";
import { map, groupBy, meanBy, filter } from "lodash";

const startTime = "2020-04-06 00:00:00";
const endTime = "2020-04-11 00:00:00";

const NumReport = (props) => {
  const { rawData } = props;
  const [data, setData] = useState([]);
  const ref = useRef();

  const processData = (rawData) => {
    let groupByTime = groupBy(rawData, (val) => val.time);
    let numReports = map(groupByTime, (records, time) => {
      return {
        num_report: records.length,
        time: time,
      };
    });
    console.log(numReports);
    return numReports;
  };

  const lineChart = (root, data) => {
    if (data === null) return null;
    document.querySelector(`#${root}`).innerHTML = "";

    const margin = { top: 10, right: 35, bottom: 20, left: 45 },
      width = 800, //document.querySelector(`#${root}`).clientWidth,
      height = 500;

    const x = d3.scaleTime().range([0, width - margin.left - margin.right]);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, (d) => d.time));
    y.domain([0, 1000]);

    const svg = d3
      .select(document.querySelector(`#${root}`))
      .append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const line = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.num_report));

    const lines = svg.append("g").attr("class", "lines");

    // add lines into svg
    lines
      .selectAll(".line-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "line-group")
      .append("path")
      .attr("class", "line")
      .attr("d", (d) => line(d.series))
      //   .style("stroke", (d) => chartColor[d.name].color)
      .style("fill", "none");

    // const tooltip = tip.setTooltip("line");
    // svg.call(tooltip);

    // add tooltip
    // lines
    //   .selectAll("circle-group")
    //   .data(data)
    //   .enter()
    //   .selectAll("circle")
    //   .data((d) => d.series)
    //   .enter()
    //   .append("g")
    //   .attr("class", "tooltip")
    //   .on("touchstart mouseover", tooltip.show)
    //   .on("touchend mouseout", tooltip.hide)
    //   .append("circle")
    //   .attr("cx", (d) => x(d.name))
    //   .attr("cy", (d) => y(d.value))
    //   .attr("r", 3)
    //   .style("fill", "transparent");

    // add the x Axis
    const xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%m/%d"));

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "xaxis")
      .call(xAxis);

    // add the y Axis
    svg.append("g").attr("class", "yaxis").call(d3.axisLeft(y).ticks(5));
  };

  useEffect(() => {
    setData(processData(rawData));
  }, [rawData]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const line = d3
      .line()
      .x((d) => d.time)
      .y((d) => d.num_report)
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

export default NumReport;
