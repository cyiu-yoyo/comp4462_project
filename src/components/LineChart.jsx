import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from "lodash";
import moment from 'moment';

class LineChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startTime: "2020-04-08 17:50:00",
            intensity: 0
        }
    }

    componentDidMount() {
        this.drawLineChart();
    }

    componentDidUpdate() {
        this.drawLineChart();
    }

    d3ParseTime = d3.timeParse('%Y-%m-%d %H:%M');

    handleRawData = (rawData) => {
        // remove those with shake_intensity = ''
        let filterByValidShakeIntensity = rawData.filter(record => record.shake_intensity !== '')
        let intensityWithTime = _.map(filterByValidShakeIntensity, (val) => {
            let intensity = parseInt(val.shake_intensity, 10)
            return {
                shake_intensity: intensity < 0 ? -intensity : intensity,
                time: moment(val.time).format('YYYY-MM-DD hh:mm'),
            }
        })
        let groupByTime = _.groupBy(intensityWithTime, val => val.time)
        let meanIntensity = _.map(groupByTime, (records, time) => {
            return {
                shake_intensity: _.meanBy(records, record => record.shake_intensity),
                time: time,
            }
        })
        return meanIntensity
    }

    drawLineChart = () => {
        d3.csv('./mc1-reports-data.csv').then((rawData) => {
            let timeUpperBound = this.d3ParseTime('2020-04-10 18:00'), interval = 600, startTime = d3.extent(_.map(rawData, d => d.time))[0], intensity;
            let shakeIntensity = this.handleRawData(rawData);
            let data = _.map(shakeIntensity, (d) => {
                return {
                    shake_intensity: d.shake_intensity,
                    time: this.d3ParseTime(d.time),
                    // random: Math.floor(Math.random() * 10)
                }
            }).sort((a, b) => a.time - b.time)
            console.log("shake intensity line chart data", data)

            let margin = { left: 50, top: 10, right: 20, bottom: 30 },
                width = 1400 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;

            d3.select("#lineChart").selectAll("svg").remove();
            let svg = d3
                .select("#lineChart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            let xRange = d3.extent(_.map(data, d => d.time));
            let yRange = [0, d3.max(data, d => d.shake_intensity)];

            const axisTimeFormat = d3.timeFormat('%m-%d %H:%M');

            const yLabel = "Shake Intensity";
            const xLabel = "Time";

            let xScale = d3.scaleTime()
                .range([margin.left, width - margin.right])
                .domain(xRange)

            let yScale = d3.scaleLinear()
                .range([height - margin.bottom, margin.top])
                .domain(yRange)

            let line = d3.line()
                .x(d => xScale(d.time))
                .y(d => yScale(d.shake_intensity))

            svg.append('g')
                .call(
                    d3.axisBottom(xScale)
                        .tickFormat(axisTimeFormat)
                )
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(g => g.append("text")
                    .attr("x", width - 1.5 * margin.right)
                    .attr("y", -0.5 * margin.bottom)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(xLabel));

            svg.append('g')
                .call(d3.axisLeft(yScale))
                .attr('transform', `translate(${margin.left},0)`)
                .call(g => g.append("text")
                    .attr("x", -margin.left)
                    .attr("y", margin.top - 5)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(yLabel));

            svg.append('g')
                .selectAll('path')
                .data([data])
                .enter()
                .append('path')
                .attr('d', d => line(d))
                .attr('fill', 'none')
                .attr('stroke', 'SteelBlue')

            const focus = svg
                .append('g')
                .append('circle')
                .style("fill", "none")
                .attr("stroke", "orange")
                .attr("r", 8.5)
                .attr("cx", xScale(this.state.startTime))
                .attr("cy", yScale(intensity))
                .style("opacity", 0)

            const focusText = svg
                .append('g')
                .append('text')
                .style("opacity", 0)
                .style('font-size', '10px')
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "middle")
                .html("time:" + moment(this.state.startTime).format('MM-DD HH:mm') + " | " + "SI:" + Math.round(intensity) / 100)
                .attr("x", xScale(this.state.startTime) + 15)
                .attr("y", yScale(intensity));

            const bisect = d3.bisector(function (d) { return d.time; }).left;

            let verticalLine = svg
                .append("line")
                .attr("x1", xScale(this.state.startTime))
                .attr("y1", 0)
                .attr("x2", xScale(this.state.startTime))
                .attr("y2", height - margin.top)
                .style("stroke-width", 2)
                .style("stroke", "orange")
                .style("fill", "none");

            let timeSpan = svg
                .append('rect')
                .style("fill", "orange")
                .style("pointer-events", "all")
                .attr('width', xScale(
                    new Date(xRange[0].getTime() + interval * 60000)
                ))
                .attr('height', height - margin.top)
                .attr('x', xScale(this.state.startTime))
                .style("opacity", 0.4)

            svg
                .append('rect')
                .style("fill", "none")
                .style("pointer-events", "all")
                .attr('width', width)
                .attr('height', height)
                .on('mouseover', () => {
                    focus.style("opacity", 1)
                    focusText.style("opacity", 1)
                    timeSpan.style("opacity", 0.4)
                })
                .on('mousemove', (event) => {
                    // recover coordinate we need
                    let x0 = xScale.invert(d3.pointer(event)[0]);
                    console.log("x0", x0)
                    let i = bisect(data, x0, 1);
                    let selectedData = data[i];
                    console.log("selected data", i)

                    if (selectedData.time < timeUpperBound) {
                        let startTime = selectedData.time;
                        let intensity = selectedData.shake_intensity;
                        this.setState({ startTime, intensity })
                    }
                })
                .on('mouseout', () => {
                    // focus.style("opacity", 0)
                    focusText.style("opacity", 0)
                    // timeSpan.style("opacity", 0)
                });


        }).catch(function (error) {
            // handle error   
            console.log('error in loading heatmap csv!')
        })
    }

    render() {
        return <div id="lineChart"></div>;
    }
}

export default LineChart;