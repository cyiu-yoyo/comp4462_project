import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import CityMap from './CityMap';
// import RadarChart from './RadarChart';
import HeatMap from './HeatMap';
import LineChart from './LineChart';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';

class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRegion: [0, ""]
        }
    }

    handleSelectRegion = (selectedRegion) => {
        console.log("select region ", selectedRegion)
        this.setState({ selectedRegion })
    }


    render() {
        const layout = [
            { i: 'a', x: 0, y: 0, w: 6, h: 9 },
            { i: 'b', x: 6, y: 0, w: 6, h: 9 },
            { i: 'c', x: 0, y: 9, w: 12, h: 5 },
            { i: 'd', x: 0, y: 14, w: 12, h: 5 },
            { i: 'e', x: 0, y: 18, w: 12, h: 27 },
        ];
        const rowHeight = 45;
        const { innerWidth: width, innerHeight: height } = window;

        return (<div>
            <GridLayout className="layout" layout={layout} cols={12} rowHeight={rowHeight} margin={[5, 1]} width={width}>
                <div key="a">
                    <div class="card" style={{ height: 9 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>City Map</p>
                        <CityMap onSelectRegion={(selectedRegion) => this.handleSelectRegion(selectedRegion)}></CityMap>
                    </div>
                </div>
                <div key="b">
                    <div class="card" style={{ height: 9 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>Radar Chart</p>
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
                                            data: {
                                                buildings: 0.4,
                                                medical: 0.7,
                                                sewer_and_water: 0.4,
                                                roads_and_bridges: 0.8,
                                                power: 0.5
                                            },
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
                                    }}
                                />
                            </div>
                            <div class="col-4">
                                <h3>{this.state.selectedRegion[1]}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div key="c">
                    <div class="card" style={{ height: 5 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}># of Reports</p>
                        <LineChart></LineChart>
                    </div>
                </div>
                <div key="d">
                    <div class="card" style={{ height: 5 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>Shaking Intensity</p>
                    </div>
                </div>
                <div key="e">
                    <div class="card" style={{ height: 27 * rowHeight }}>
                        <p style={{ backgroundColor: "#e9ecef", margin: "5px", paddingLeft: "5px" }}>Heatmap</p>
                        <HeatMap></HeatMap>
                    </div>
                </div>
            </GridLayout>
        </div>);
    }
}

export default DashBoard;