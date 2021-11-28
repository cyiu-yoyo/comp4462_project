import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3';
import * as vsup from 'vsup';

const loc_name = ["Palace Hills", "Northwest", "Old Town", "Safe Town", "Southwest", "Downtown", "Wilson Forest", "Scenic Vista", "Broadview", "Chapparal", "Terrapin Springs", "Pepper Mill", "Cheddarford", "Easton", "Weston", "Southton", "Oak Willow", "East Parton", "West Parton"]
class HeatMap extends React.Component {
    constructor(props) {
        super(props);

        // initialize color scale
        var red = "#b2182b", yellow = "#fee090", blue = "#abd9e9";
        var interpolateIsoRdBu = d3.scaleLinear()
            .domain([0, 0.5, 1])
            .range([blue, yellow, red])
            .interpolate(d3.interpolateLab);
        var vDom = [1, 10], uDom = [0, 1];
        var quantization = vsup.quantization().branching(2).layers(4).valueDomain(vDom).uncertaintyDomain(uDom);
        var vsupScale = vsup.scale().quantize(quantization).range(interpolateIsoRdBu);

        var colorScale = d3
            .scaleSequential()
            .interpolator(d3.interpolateRdYlBu)
            .domain([10, -5]);

        this.state = {
            start_time: 0,
            end_time: 1,
            descend: true,
            attribute: {
                medical: true,
                power: false,
                roads_and_bridges: false,
                sewer_and_water: false,
                buildings: false
            },
            uncertainty: true,
            vsupScale,
            colorScale
        }
    }



    componentDidMount() {
        console.log("HeatMap did mount...")
        this.drawHeatmap(this.state.vsupScale, this.state.colorScale);
        this.drawLegend(this.state.vsupScale, this.state.colorScale);
    }

    componentDidUpdate() {
        console.log("HeatMap did update...")
        this.drawHeatmap(this.state.vsupScale, this.state.colorScale);
    }

    drawLegend = (vsupScale, colorScale) => {
        // vsup legend
        var vsupLegend = vsup.legend.arcmapLegend();
        vsupLegend
            .scale(vsupScale)
            .size(160)
            .x(0)
            .y(0)
            .vtitle("Intensity Reported")
            .utitle("Uncertainty");

        d3.select("#vsupLegend").selectAll("svg").remove();
        let vsupLegendSvg = d3
            .select("#vsupLegend").append("svg")
            .attr("width", 300)
            .attr("height", 300)
            .append("g")
            .attr("transform", "translate(15,40)");
        vsupLegendSvg.append("g").call(vsupLegend)

        // color legend
        d3.select("#colorLegend").selectAll("svg").remove();
        let colorLegendSvg = d3
            .select("#colorLegend").append("svg")
            .attr("width", 180)
            .attr("height", 60)
            .append("g")

        var linearGradient = colorLegendSvg.append("defs").append("linearGradient")
            .attr("id", `linear-gradient`);

        linearGradient
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        //Set the color for the start (0%)
        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", colorScale(1));

        linearGradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", colorScale(5));

        //Set the color for the end (100%)
        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", colorScale(10));

        colorLegendSvg.append("rect")
            .attr("width", 160)
            .attr("height", 20)
            .style("fill", `url(#linear-gradient)`)
            .attr("x", 10)
            .attr("y", 10)

        colorLegendSvg.append("text").text("1").attr("x", 10).attr("y", 45);
        colorLegendSvg.append("text").text("10").attr("x", 160).attr("y", 45)
    }

    drawHeatmap = (vsupScale, colorScale) => {

        d3.csv("./merge_ui_std.csv").then((data) => {
            console.log("rawdata", data)

            // preprocess data
            let start_time = Date.parse("2020-04-08 8:00:00")
            let interval = 30 * 60 * 1000; // 30 min * 60 s * 1000 ms
            let heatdata = [], time_range = [];
            // fix num of time intervals
            let numOfInterval = 15
            for (let i = 0; i < numOfInterval; i++) {

                let curtime = start_time + i * interval;
                let date = new Date(curtime);
                let datestring = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + " " + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');
                let dateDisplay = (date.getMonth() + 1).toString() + "." + date.getDate() + " " + date.getHours() + ":" + date.getMinutes().toString().padStart(2, '0');
                // console.log(datestring)
                // console.log(data.filter(d => d.index == datestring))
                data.filter(d => d.index == datestring).forEach(d => {
                    let intensity = 0, uncertainty = 0, count = 0;
                    if (parseFloat(d.medical_i) != -1 && this.state.attribute.medical) {
                        intensity += parseFloat(d.medical_i);
                        uncertainty += parseFloat(d.medical_u);
                        count += 1;
                    }
                    if (parseFloat(d.power_i) != -1 && this.state.attribute.power) {
                        intensity += parseFloat(d.power_i);
                        uncertainty += parseFloat(d.power_u);
                        count += 1;
                    }
                    if (parseFloat(d.sewer_and_water_i) != -1 && this.state.attribute.sewer_and_water) {
                        intensity += parseFloat(d.sewer_and_water_i);
                        uncertainty += parseFloat(d.sewer_and_water_u);
                        count += 1;
                    }
                    if (parseFloat(d.roads_and_bridges_i) != -1 && this.state.attribute.roads_and_bridges) {
                        intensity += parseFloat(d.roads_and_bridges_i);
                        uncertainty += parseFloat(d.roads_and_bridges_u);
                        count += 1;
                    }
                    if (parseFloat(d.buildings_i) != -1 && this.state.attribute.buildings) {
                        intensity += parseFloat(d.buildings_i);
                        uncertainty += parseFloat(d.buildings_u);
                        count += 1;
                    }

                    heatdata.push({
                        time: curtime,
                        time_string: dateDisplay,
                        location: parseInt(d.location),
                        intensity_total: intensity / count,
                        uncertainty_total: uncertainty / count,
                        // medical: { intensity: parseFloat(d.medical_i), uncertainty: parseFloat(d.medical_u) },
                        // power: { intensity: parseFloat(d.power_i), uncertainty: parseFloat(d.power_u) },
                        // roads_and_bridges: { intensity: parseFloat(d.roads_and_bridges_i), uncertainty: parseFloat(d.roads_and_bridges_u) },
                        // sewer_and_water: { intensity: parseFloat(d.sewer_and_water_i), uncertainty: parseFloat(d.sewer_and_water_u) },
                        // buildings: { intensity: parseFloat(d.buildings_i), uncertainty: parseFloat(d.buildings_u) },
                    })
                })
                time_range.push(dateDisplay);
            }
            console.log("heatdata", heatdata);

            let margin = { left: 115, right: 10, top: 30, bottom: 10 },
                width = 1200 - margin.left - margin.right,
                height = 1000 - margin.top - margin.bottom;

            d3.select("#heatmap").selectAll("svg").remove();
            let svg = d3
                .select("#heatmap").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // x scale
            let xScale = d3.scaleBand().range([0, width]).padding(0.1).domain(time_range);
            svg.append("g").style("font-size", "12px").call(d3.axisTop(xScale)).call(g => {
                g.select(".domain").remove();
                g.selectAll("line").remove();
            });
            // y scale
            // sort 
            let loc_intensity = Array.from({ length: 19 }, (_, i) => i + 1).map(i => {
                return {
                    location: i,
                    intensity_total: heatdata.filter(d => d.location == i).reduce((sum, cur) => {
                        if (cur.intensity_total > 0) return sum + cur.intensity_total
                        else return sum
                    }, 0)
                }
            })
            console.log("location intensity", loc_intensity)
            let yDomain;
            if (this.state.descend) {
                yDomain = loc_intensity.sort((a, b) => b.intensity_total - a.intensity_total).map(d => d.location)
            } else {
                yDomain = loc_intensity.sort((a, b) => a.intensity_total - b.intensity_total).map(d => d.location)
            }
            yDomain = yDomain.map(d => loc_name[d - 1])
            console.log("yDomain", yDomain)
            let yScale = d3.scaleBand().range([0, height]).domain(yDomain).padding(0.1);
            svg.append("g").style("font-size", "14px").call(d3.axisLeft(yScale)).call(g => {
                g.select(".domain").remove();
                g.selectAll("line").remove();
            });

            // color scales
            // let colorScale = d3.scaleSequential().interpolator(d3.interpolateRdBu).domain([1, 10]);

            svg.selectAll()
                .data(heatdata)
                .enter()
                .append("rect")
                .attr("x", (d) => xScale(d.time_string))
                .attr("y", (d) => yScale(loc_name[d.location - 1]))
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .style("fill", (d) => {
                    if (this.state.uncertainty) return (d.intensity_total > 0) ? vsupScale(d.intensity_total, d.uncertainty_total) : "white";
                    else return (d.intensity_total > 0) ? colorScale(d.intensity_total) : "white";
                })

        }).catch(function (error) {
            // handle error   
            console.log('error in loading heatmap csv!')
        })


    }

    handleOrder = () => {
        console.log("handle order")
        let descend = document.getElementById("descendingRadio").checked;
        this.setState({ descend });
    }

    handleAttribute = () => {
        console.log("handle attribute")
        let medical = document.getElementById("medicalCheck").checked;
        let power = document.getElementById("powerCheck").checked;
        let roads_and_bridges = document.getElementById("roads_and_bridgesCheck").checked;
        let sewer_and_water = document.getElementById("sewer_and_waterCheck").checked;
        let buildings = document.getElementById("buildingsCheck").checked;
        this.setState({
            attribute: {
                medical,
                power,
                roads_and_bridges,
                sewer_and_water,
                buildings
            }
        });
    }

    handleUncertainty = () => {
        console.log("handle uncertainty")
        let uncertainty = document.getElementById("uncertaintyRadio").checked;
        this.setState({ uncertainty });
    }

    render() {
        return <div class="row">
            <div class="col-10">
                {/* <p>start time: {this.state.start_time}</p> */}
                <div id="heatmap" />
            </div>
            <div class="col-2">
                <span>Sort by:</span><br />
                <input type="radio" name="orderRadio" id="ascendingRadio" value="ascending" onChange={this.handleOrder} /> Ascending <br />
                <input type="radio" name="orderRadio" id="descendingRadio" value="descending" onChange={this.handleOrder} /> Descending
                <br />
                <br />
                <span>Selected service:</span><br />
                <input type="checkbox" id="medicalCheck" value="medical" onChange={this.handleAttribute} /> Medical <br />
                <input type="checkbox" id="powerCheck" value="power" onChange={this.handleAttribute} /> Power<br />
                <input type="checkbox" id="roads_and_bridgesCheck" value="roads_and_bridges" onChange={this.handleAttribute} /> Roads and Bridges<br />
                <input type="checkbox" id="sewer_and_waterCheck" value="sewer_and_water" onChange={this.handleAttribute} /> Sewer and Water<br />
                <input type="checkbox" id="buildingsCheck" value="buildings" onChange={this.handleAttribute} /> Buildings
                <br />
                <br />
                <span>w/o uncertainty:</span><br />
                <input type="radio" name="uncertaintyRadio" id="noUncertaintyRadio" value="noUncertainty" onChange={this.handleUncertainty} /> Damage reported <br />
                <div id="colorLegend"></div>
                <input type="radio" name="uncertaintyRadio" id="uncertaintyRadio" value="uncertainty" onChange={this.handleUncertainty} /> Damage reported + Uncertainty
                <br />
                <br />
                <div id="vsupLegend"></div>
            </div>
        </div>;
    }
}

export default HeatMap;