import React, {Component} from "react";
import { Chart } from "react-google-charts";

class TotalsChart extends Component {
    /*render2() {
        return <Chart
        width={'500px'}
        height={'300px'}
        // Note here we use Bar instead of BarChart to load the material design version
        chartType="Bar"
        loader={<div>Loading Chart</div>}
        data={[
          ['City', '2010 Population', '2000 Population'],
          ['New York City, NY', 8175000, 8008000],
          ['Los Angeles, CA', 3792000, 3694000],
          ['Chicago, IL', 2695000, 2896000],
          ['Houston, TX', 2099000, 1953000],
          ['Philadelphia, PA', 1526000, 1517000],
        ]}
        options={{
          // Material chart options
          chart: {
            title: 'Population of Largest U.S. Cities',
            subtitle: 'Based on most recent and previous census data',
          },
          hAxis: {
            title: 'Total Population',
            minValue: 0,
          },
          vAxis: {
            title: 'City',
          },
          bars: 'horizontal',
          axes: {
            y: {
              0: { side: 'right' },
            },
          },
        }}
        // For tests
        rootProps={{ 'data-testid': '5' }}
      />;
    }
    */
    render() {

        /* this.props.data looks like
          [
            ['Weather Loss', 5.2, 'black', null],
            ['Poor Weather Prog.', 2.2, 'yellow', null],
            ['Tech. Downtime', 0.34, 'red', null],
            ['Calibrations', 6.34, 'green', null],
            ['AZ-2020A-001', 9.4, 'blue', "34%"],
            ['AZ-2020A-002', 3.1, 'blue', "22%"],
            ['AZ-2020A-003', 2.9, 'blue', "0.55%"],
            ['AZ-2020A-004', 5.2, 'blue', "5.5%"],
            ['AZ-2020A-005', 17.4, 'blue', "98%"]
        ];
        */

        return <Chart
        width={'700px'}
        height={'500px'}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={[
          [
            'Element',
            'Hours',
            { role: 'style' },
            {
              sourceColumn: 0,
              role: 'annotation',
              type: 'string',
              calc: 'stringify',
            },
          ],
          ...this.props.data,
        ]}
        options={{
          title: 'Total time, in hours',
          width: 600,
          height: 400,
          bar: { groupWidth: '95%' },
          legend: { position: 'none' },
        }}
      />;
    }
}

export default TotalsChart;
