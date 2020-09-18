import {makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import Graph, {IChartValue} from "./graph";
import {parseISO} from "date-fns";
import {IComponent, IGroup, IMetric, IStatus, IValue} from "./types";
import {useAppStyles} from "./app-styles";
import {orderBy} from "lodash";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    title: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: '24px',
    },
    status: {
        fontSize: 14,
        fontWeight: 400,
        lineHeight: '24px',
    },
    responseTime: {
        fontSize: 12,
        fontWeight: 400,
        lineHeight: '18px',
        color: 'grey',
    },
}));

interface Props {
    component: IComponent;
}

function componentStatusToGraphData(values: IStatus[]): IChartValue[] {
    values = orderBy(values, d => d.date, 'asc');
    return values.map((value, i) => ({
        date: parseISO(value.date),
        value: value.available ? 1 : 1,
        color: value.available ? (i == values.length-1 ? '#2fcc66' : 'grey') : '#cc2f2f',
    }));
}

export default function Component({component} : Props) {
    const classes = useStyles();
    const appClasses = useAppStyles();
    const theme = useTheme();

    const values = orderBy(component.status, d => d.date, 'asc');
    const lastStatus = values.length > 0 ? values[values.length-1].available : null;

    let statusColor = '#CCC';
    if (lastStatus === true) {
        statusColor = '#2fcc66';
    }
    if (lastStatus === false) {
        statusColor = '#cc2f2f';
    }

    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    const responseTimes = component.status.filter(s => s.available).map(s => s.responseTime);
    const responseTime = responseTimes.length > 0 ? average(responseTimes) : null;

    return (
        <div className={classes.root}>

            <div className={classes.row}>
                <div className={classes.title}>
                    {component.name}
                </div>
                <div className={appClasses.expanded}/>
                <div className={classes.status} style={{color: statusColor}}>
                    {lastStatus === true && 'Operational'}
                    {lastStatus === false && 'Offline'}
                    {lastStatus == null && 'Unknown'}
                </div>
            </div>

            <Graph key={component.name} values={componentStatusToGraphData(component.status)} delayInMinutes={component.delayInMinutes}/>

            <div className={classes.row}>
                <div className={classes.responseTime}>
                    {component.delayInMinutes*60}m
                </div>
                <div className={appClasses.expanded}/>
                <div className={classes.responseTime}>
                    {responseTime ? responseTime.toFixed()+' ms' : ''}
                </div>
            </div>
        </div>
    );
}
