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

    priorityColor = (obj, priorityData) => {
        const colors = d3.scaleLinear()
            .domain([10, 100])
            .range(["PeachPuff", "FireBrick"]);

        return colors(priorityData[obj.properties.Id - 1])
    }

    drawCityMap = () => {
        const geojsonLink = "https://raw.githubusercontent.com/huantingwei/comp4462/main/StHimark.geojson";
        d3.json(geojsonLink).then((geoData) => {
            console.log("geoData", geoData)

            const priorityPerArea = [10, 20, 50, 50, 20, 15, 65, 35, 50, 70, 85, 25, 50, 70, 85, 25, 90, 70, 10]

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

            const projection = d3.geoIdentity().reflectY(true).fitSize([width, height], geoData)
            const path = d3.geoPath(projection);

            svg.selectAll("path")
                .data(geoData.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke", "#fff")
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