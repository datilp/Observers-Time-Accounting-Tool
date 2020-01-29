import React from "react";
import { Chart } from "react-google-charts";


// Reference : https://developers.google.com/chart/interactive/docs/gallery/timeline
const columns = [
  { type: "string", id: "Bin" },
  { type: "datetime", id: "Start" },
  { type: "datetime", id: "End" }
];


class NightlyReport extends React.Component {
  render() {
    return (
      <div className="App">
        <Chart
          chartType="Timeline"
          data={[columns, ...this.props.data]}
          width="700px"
          height="300px"
        />
      </div>
    );
  }
}
export default NightlyReport;