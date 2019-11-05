import React, {Component} from "react";

import Aux from "../../hoc/Aux/Aux";
import Layout from "../../hoc/Layout/Layout";
import WeatherLoss from "../../components/DowntimeTracker/DowntimeTracker";
import ProgramTracker from "../../components/ProgramTracker/ProgramTracker";

class MiniQ extends Component {
    render() {
        return(
            <Aux>
                <Layout>
                    
                <div>
                    <WeatherLoss/>
                </div>
                <hr></hr>
                <div>
                    <ProgramTracker/>
                </div>

                </Layout>
            </Aux>
        )
    }
}

export default MiniQ;