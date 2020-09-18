import {makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import Graph, {IChartValue} from "./graph";
import {parseISO} from "date-fns";
import {IGroup, IMetric, IValue} from "./types";
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
    responseTime: {
        fontSize: 12,
        fontWeight: 400,
        lineHeight: '18px',
        color: 'grey',
    },
}));

interface Props {
    metric: IMetric;
}

function metricValuesToGraphData(values: IValue[]): IChartValue[] {
    values = orderBy(values, d => d.date, 'asc');
    return values.map(value => ({
        date: parseISO(value.date),
        value: value.value,
        label: value.value,
        color: 'grey',
    }));
}

export default function Metric({metric} : Props) {
    const classes = useStyles();
    const appClasses = useAppStyles();
    const theme = useTheme();

    return (
        <div className={classes.root}>

            <Typography variant="subtitle2" noWrap>
                {metric.name}
            </Typography>

            <Graph key={metric.name} values={metricValuesToGraphData(metric.values)} delayInMinutes={metric.delayInMinutes}/>

            <div className={classes.row}>
                <div className={classes.responseTime}>
                    {metric.delayInMinutes*60}m
                </div>
            </div>
        </div>
    );
}
