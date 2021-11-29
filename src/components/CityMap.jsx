import React, { Component } from 'react';
import * as d3 from 'd3';

class CityMap extends React.Component {
    constructor(props) {
        super(props)
        // this.state = { selected_location: 0 }
    }

    componentDidMount() {
        this.drawCityMap();
    }

    componentDidUpdate() {
        this.drawCityMap();
    }

    priorityColor = (obj, priorityData) => {
        const colors = d3.scaleLinear()
            .domain([0, 1])
            .range(["PeachPuff", "FireBrick"]);
        let priority = priorityData[obj.properties.Id - 1];
        return priority > -1 ? colors(priority) : "#fff5f0"
    }

    drawCityMap = () => {
        const geojsonLink = "https://raw.githubusercontent.com/huantingwei/comp4462/main/StHimark.geojson";
        d3.json(geojsonLink).then((geoData) => {
            // console.log("geoData", geoData)

            // const priorityPerArea = [10, 20, 50, 50, 20, 15, 65, 35, 50, 70, 85, 25, 50, 70, 85, 25, 90, 70, 10]
            const priorityPerArea = this.props.priority;

            let margin = { left: 10, right: 10, top: 5, bottom: 10 },
                width = 700 - margin.left - margin.right,
                height = 370 - margin.top - margin.bottom;

            d3.select("#citymap").selectAll("svg").remove();

            let svg = d3
                .select("#citymap").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // legend
            var linearGradient = svg.append("defs").append("linearGradient")
                .attr("id", `linear-gradient`);

            linearGradient
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");

            //Set the color for the start (0%)
            linearGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "PeachPuff");

            //Set the color for the end (100%)
            linearGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "FireBrick");

            svg.append("rect")
                .attr("width", 90)
                .attr("height", 15)
                .style("fill", `url(#linear-gradient)`)
                .attr("x", 10)
                .attr("y", 325)

            svg.append("text").text("Priority").attr("x", 10).attr("y", 320).attr("font-size", 13);
            svg.append("text").text("low").attr("x", 10).attr("y", 350).attr("font-size", 13);
            svg.append("text").text("high").attr("x", 80).attr("y", 350).attr("font-size", 13)

            const projection = d3.geoIdentity().reflectY(true).fitSize([width, height], geoData)
            const path = d3.geoPath(projection);

            svg.selectAll("path")
                .data(geoData.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke", "grey")
                .style("fill", (d) => this.priorityColor(d, priorityPerArea))
                .attr("class", "areas")
                .on("mouseover", function (event, d) {
                    d3.select(this)
                        .attr("opacity", 0.5)
                })
                .on("mouseout", function (event, d) {
                    d3.select(this)
                        .attr("opacity", 1)
                })
                .on("click", (event, d) => {
                    let selectedRegion = [d.properties.Id, d.properties.Nbrhood]
                    this.props.onSelectRegion(selectedRegion)
                    // console.log("selected region: ", d)
                })

            svg.selectAll(".labels")
                .data(geoData.features)
                .enter().append("text")
                .attr("class", "labels")
                .attr("x", function (d) {
                    return path.centroid(d)[0];
                })
                .attr("y", function (d) {
                    return path.centroid(d)[1];
                })
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .text((d) => d.properties.Nbrhood.toString())

        }).catch(function (error) {
            // handle error   
            console.log('error in loading geojson!')
        })
    }
    render() {
        return <div id="citymap"></div>;
    }
}

export default CityMap;