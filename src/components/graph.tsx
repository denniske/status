import React from 'react';
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip} from "victory";
import {makeStyles} from "@material-ui/core/styles";
import useDimensions from "../hooks/use-dimensions";
import {formatDateShort, formatMonth, formatTime, formatYear} from "../helper/util";
import {isAfter, isEqual, subDays, subMinutes, subMonths, subWeeks} from "date-fns";

export interface IChartValue {
    date: Date,
    value: any;
}

interface Props {
    values: IChartValue[];
}

export default function Graph({values}: Props) {
    const classes = useStyles();

    const formatTick = (tick: any, index: number, ticks: any[]) => {
        const date = ticks[index] as Date;
        if (date.getMonth() == 0 && date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatYear(date);
        }
        if (date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatMonth(date);
        }
        if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatDateShort(date);
        }
        return formatTime(ticks[index]);
    };

    const [measureRef, { width }] = useDimensions();

    const since = subMinutes(new Date(), 60);
    values = values.filter(d => isAfter(d.date!, since));

    // for (let minute = 0; minute < 60; minute++) {
    //     if (values.find(v => v.date))
    // }

    // console.log('domain', [since, new Date()]);

    const domainMax = new Date();
    domainMax.setSeconds(0);
    domainMax.setMilliseconds(0);
    since.setSeconds(0);
    since.setMilliseconds(0);

    const domain = [since, domainMax] as any;

    // if (!values.find(v => isEqual(v.date, since))) {
    //     values.unshift({
    //         date: since,
    //         value: 1,
    //     });
    // }

    // console.log('domain', domain);
    // console.log('values', values);

    return (
            <div className={classes.container}>
                <div ref={measureRef}>
                    <VictoryChart
                        domain={{x: domain}}
                        width={width} height={70}
                        theme={VictoryTheme.material}
                        padding={{left: 20, bottom: 10, top: 10, right: 20}}
                        scale={{ x: "time" }}
                    >
                        <VictoryAxis crossAxis tickFormat={() => ''} />
                        {/*<VictoryAxis dependentAxis crossAxis  />*/}
                        <VictoryBar
                            barWidth={width / 60 / 2}
                            // barRatio={0.1}
                            labelComponent={<VictoryTooltip/>}
                            name={'line'}
                            key={'line'}
                            data={values}
                            x="date"
                            y="value"
                            style={{ data: { fill: data => data.datum.color } }}
                        />
                    </VictoryChart>
                </div>
            </div>
    )
}


const useStyles = makeStyles((theme) => ({
    container: {
        // backgroundColor: 'green',
        position: "relative"
    },
}));
