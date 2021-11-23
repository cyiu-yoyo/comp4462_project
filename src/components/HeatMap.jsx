import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3';
// import data from "";

class HeatMap extends React.Component {
    constructor(props) {
        super(props);
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
            uncertainty: true
        }
    }

    componentDidMount() {
        console.log("HeatMap did mount...")
    }

    componentDidUpdate() {
        console.log("HeatMap did update...")
        this.drawHeatmap();
    }

    drawHeatmap = (attribute, uncertainty) => {
        let colorScale1, colorScale2, colorScale3, colorScale4;
        d3.csv("./heatmapdata.csv").then(function (data) {
            console.log("rawdata", data)

            // preprocess data
            let start_time = Date.parse("2020-04-06 12:00:00")
            let interval = 30 * 60 * 1000; // 30 min * 60 s * 1000 ms
            let heatdata = [];
            for (let i = 0; i < 20; i++) {
                // fix 20 time intervals
                let curtime = start_time + i * interval;
                let date = new Date(curtime);
                let datestring = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + " " + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');
                // console.log(datestring)
                // console.log(data.filter(d => d.index == datestring))
                data.filter(d => d.index == datestring).forEach(d => {
                    heatdata.push({
                        time: curtime,
                        time_string: d.index,
                        location: parseInt(d.location),
                        medical: { intensity: parseFloat(d.medical), uncertainty: 0 },
                        power: { intensity: parseFloat(d.power), uncertainty: 0 },
                        roads_and_bridges: { intensity: parseFloat(d.roads_and_bridges), uncertainty: 0 },
                        sewer_and_water: { intensity: parseFloat(d.sewer_and_water), uncertainty: 0 },
                        buildings: { intensity: parseFloat(d.buildings), uncertainty: 0 },
                    })
                })
            }
            console.log("heatdata", heatdata)



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
                <p>start time: {this.state.start_time}</p>
            </div>
            <div class="col-2">
                <span>Sort by:</span><br />
                <input type="radio" name="orderRadio" id="ascendingRadio" value="ascending" onChange={this.handleOrder} /> Ascending <br />
                <input type="radio" name="orderRadio" id="descendingRadio" value="descending" onChange={this.handleOrder} /> Descending
                <br />
                <br />
                <span>Selected attribute:</span><br />
                <input type="checkbox" id="medicalCheck" value="medical" onChange={this.handleAttribute} /> Medical <br />
                <input type="checkbox" id="powerCheck" value="power" onChange={this.handleAttribute} /> Power<br />
                <input type="checkbox" id="roads_and_bridgesCheck" value="roads_and_bridges" onChange={this.handleAttribute} /> Roads and Bridges<br />
                <input type="checkbox" id="sewer_and_waterCheck" value="sewer_and_water" onChange={this.handleAttribute} /> Sewer and Water<br />
                <input type="checkbox" id="buildingsCheck" value="buildings" onChange={this.handleAttribute} /> Buildings
                <br />
                <br />
                <input type="radio" name="uncertaintyRadio" id="noUncertaintyRadio" value="noUncertainty" onChange={this.handleUncertainty} /> Damage reported <br />
                <input type="radio" name="uncertaintyRadio" id="uncertaintyRadio" value="uncertainty" onChange={this.handleUncertainty} /> Damage reported + Uncertainty
            </div>
        </div>;
    }
}

export default HeatMap;