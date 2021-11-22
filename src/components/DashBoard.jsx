import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import CityMap from './CityMap';
import RadarChart from './RadarChart';
import HeatMap from './HeatMap';

class DashBoard extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const layout = [
            { i: 'a', x: 0, y: 0, w: 6, h: 9 },
            { i: 'b', x: 6, y: 0, w: 6, h: 9 },
            { i: 'c', x: 0, y: 9, w: 12, h: 4 },
            { i: 'd', x: 0, y: 13, w: 12, h: 4 },
            { i: 'e', x: 0, y: 17, w: 12, h: 14 },
        ];
        const rowHeight = 40;
        const { innerWidth: width, innerHeight: height } = window;

        return (<div>
            <GridLayout className="layout" layout={layout} cols={12} rowHeight={rowHeight} margin={[5, 1]} width={width}>
                <div key="a">
                    <div class="card" style={{ height: 9 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>City Map</p>
                        <CityMap></CityMap>
                    </div>
                </div>
                <div key="b">
                    <div class="card" style={{ height: 9 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>Radar Chart</p>
                        <RadarChart></RadarChart>
                    </div>
                </div>
                <div key="c">
                    <div class="card" style={{ height: 4 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}># of Reports</p>
                    </div>
                </div>
                <div key="d">
                    <div class="card" style={{ height: 4 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>Shaking Intensity</p>
                    </div>
                </div>
                <div key="e">
                    <div class="card" style={{ height: 14 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>Heatmap</p>
                        <HeatMap></HeatMap>
                    </div>
                </div>
            </GridLayout>
        </div>);
    }
}

export default DashBoard;