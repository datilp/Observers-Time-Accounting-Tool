import React, {Component} from "react";

import Aux from "../../hoc/Aux/Aux";
import Layout from "../../hoc/Layout/Layout";
import WeatherLoss from "../../components/DowntimeTracker/DowntimeTracker";
import ProgramTracker from "../../components/ProgramTracker/ProgramTracker";
import * as actionTypes from "../../store/actions/actionTypes";

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
                    <ProgramTracker progClass={actionTypes.PROGRAM_TYPE} title="Programs"/>
                </div>
                <div>
                    <ProgramTracker progClass={actionTypes.POORWEATHER_TYPE} title="Poor Weather Programs"/>
                </div>
                <div>
                    <ProgramTracker progClass={actionTypes.BACKUP_TYPE} title="Backup Programs"/>
                </div>

                </Layout>
            </Aux>
        )
    }
}

export default MiniQ;