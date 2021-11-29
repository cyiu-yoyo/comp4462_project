import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import CityMap from './CityMap';
// import RadarChart from './RadarChart';
import HeatMap from './HeatMap';
import LineChart from './LineChart';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';
import * as d3 from 'd3';
import radarcsvdata from '../data/merge_10h_i.csv';
import prioritycsvdata from '../data/priority_map.csv';
import hospital_img from '../hospital.png';
import nuclear_img from '../nuclear.png';

const facilities = {
    1: [1, 0],
    2: [0, 0],
    3: [1, 0],
    4: [0, 1],
    5: [1, 0],
    6: [1, 0],
    7: [0, 0],
    8: [0, 0],
    9: [1, 0],
    10: [0, 0],
    11: [1, 0],
    12: [0, 0],
    13: [0, 0],
    14: [0, 0],
    15: [0, 0],
    16: [1, 0],
    17: [0, 0],
    18: [0, 0],
    19: [0, 0]
}
class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRegion: [1, "Palace Hills"],
            radarData: [],
            priorityData: [],
            start_time: "2020-04-08 08:00:00"
        }
    }

    componentDidMount() {
        d3.csv(radarcsvdata).then((rawdata) => {
            // console.log("radar raw data", rawdata)
            this.setState({ radarData: rawdata })
        }).catch(error => {
            console.log("error in loading radar csv", error)
        })

        d3.csv(prioritycsvdata).then((rawdata) => {
            // console.log("priority raw data", rawdata)
            this.setState({ priorityData: rawdata })
        }).catch(error => {
            console.log("error in loading priority csv", error)
        })

        // let svg = d3
        //     .select("#radar_legend").append("svg")
        //     .attr("width", 300)
        //     .attr("height", 400)
        //     .append("g")
        //     .attr("transform", "translate(0,150)")

        // // x scale
        // let xScale = d3.scaleBand().range([0, 100]).padding(0.1).domain([0, 3.3, 6.6, 10]);
        // svg.append("g").style("font-size", "12px").call(d3.axisTop(xScale))
        // .call(g => {
        //     g.select(".domain").remove();
        //     g.selectAll("line").remove();
        // });
    }

    handleSelectRegion = (selectedRegion) => {
        // console.log("select region ", selectedRegion)
        this.setState({ selectedRegion })
    }

    handleChangeTime = (start_time) => {
        console.log("handle change time", start_time)
        let datestring = start_time.getFullYear() + "-" + (start_time.getMonth() + 1).toString().padStart(2, '0') + "-" + start_time.getDate().toString().padStart(2, '0') + " " + start_time.getHours().toString().padStart(2, '0') + ":" + start_time.getMinutes().toString().padStart(2, '0') + ":" + start_time.getSeconds().toString().padStart(2, '0');
        this.setState({ start_time: datestring })
    }

    render() {
        const layout = [
            { i: 'a', x: 0, y: 0, w: 6, h: 9 },
            { i: 'b', x: 6, y: 0, w: 6, h: 9 },
            { i: 'c', x: 0, y: 9, w: 12, h: 10 },
            // { i: 'd', x: 0, y: 14, w: 12, h: 5 },
            { i: 'e', x: 0, y: 18, w: 12, h: 27 },
        ];
        const rowHeight = 45;
        const { innerWidth: width, innerHeight: height } = window;

        const selectedRawRadarData = this.state.radarData ? this.state.radarData.filter(d => d.index == this.state.start_time && d.location == this.state.selectedRegion[0]) : [];
        // console.log("selected radar data", selectedRawRadarData)
        let selectedRadarData = {
            buildings: 0,
            medical: 0,
            sewer_and_water: 0,
            roads_and_bridges: 0,
            power: 0
        }
        if (selectedRawRadarData.length > 0) {
            selectedRadarData = {
                buildings: parseFloat(selectedRawRadarData[0].buildings) > 0 ? (parseFloat(selectedRawRadarData[0].buildings) / 10) : 0,
                medical: parseFloat(selectedRawRadarData[0].medical) > 0 ? (parseFloat(selectedRawRadarData[0].medical) / 10) : 0,
                sewer_and_water: parseFloat(selectedRawRadarData[0].sewer_and_water) > 0 ? (parseFloat(selectedRawRadarData[0].sewer_and_water) / 10) : 0,
                roads_and_bridges: parseFloat(selectedRawRadarData[0].roads_and_bridges) > 0 ? (parseFloat(selectedRawRadarData[0].roads_and_bridges) / 10) : 0,
                power: parseFloat(selectedRawRadarData[0].power) > 0 ? (parseFloat(selectedRawRadarData[0].power) / 10) : 0
            }
        }

        const priority = this.state.priorityData.filter(d => d.start_time == this.state.start_time).map(d => parseFloat(d.priority_value))
        // console.log("priority", priority)
        return (<div>
            <GridLayout className="layout" layout={layout} cols={12} rowHeight={rowHeight} margin={[5, 1]} width={width}>
                <div key="a">
                    <div class="card" style={{ height: 9 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>City Map</p>
                        <CityMap
                            priority={priority}
                            onSelectRegion={(selectedRegion) => this.handleSelectRegion(selectedRegion)}
                        ></CityMap>
                    </div>
                </div>
                <div key="b">
                    <div class="card" style={{ height: 9 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>Neighborhood Breakdown</p>
                        {/* <RadarChart></RadarChart> */}
                        <div class="row" style={{ marginLeft: 30, marginTop: 10 }}>
                            <div class="col-8">
                                <RadarChart
                                    captions={{
                                        // columns
                                        buildings: 'buildings',
                                        medical: 'medical',
                                        sewer_and_water: 'sewer and water',
                                        roads_and_bridges: 'roads and bridges',
                                        power: 'power'
                                    }}
                                    data={[
                                        {
                                            data: selectedRadarData,
                                            meta: { color: '#fc9272' }
                                        },
                                    ]}
                                    size={360}
                                    options={{
                                        captionProps: () => ({
                                            className: 'caption',
                                            textAnchor: 'middle',
                                            fontSize: 15,
                                            fontFamily: 'sans-serif'
                                        }),
                                        axes: true
                                    }}
                                />
                            </div>
                            <div class="col-4">
                                <h3>{this.state.selectedRegion[1]} </h3><br />
                                <img src={hospital_img} style={{ height: 30 }} /><span>  Hospitals: {facilities[this.state.selectedRegion[0]][0]}</span><br /><br />
                                <img src={nuclear_img} style={{ height: 30 }} /><span>  Nuclear Plants: {facilities[this.state.selectedRegion[0]][1]}</span>
                                <div id="radar_legend"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div key="c">
                    <div class="card" style={{ height: 10 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>Earthquake Hit Timeline</p>
                        <LineChart onChangeTime={(start_time) => this.handleChangeTime(start_time)}></LineChart>
                    </div>
                </div>
                {/* <div key="d">
                    <div class="card" style={{ height: 5 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>Shaking Intensity</p>
                    </div>
                </div> */}
                <div key="e">
                    <div class="card" style={{ height: 27 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>{`Damage per Service & Neighborhood`}</p>
                        <HeatMap start_time={this.state.start_time}></HeatMap>
                    </div>
                </div>
            </GridLayout>
        </div>);
    }
}

export default DashBoard;