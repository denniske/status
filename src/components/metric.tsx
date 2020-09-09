import {makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import Graph, {IChartValue} from "./graph";
import {parseISO} from "date-fns";
import {IGroup, IMetric, IValue} from "./types";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
}));

interface Props {
    metric: IMetric;
}

function metricValuesToGraphData(values: IValue[]): IChartValue[] {
    return values.map(value => ({
        date: parseISO(value.date),
        value: value.value,
        label: value.value,
        color: 'grey',
    }));
}

export default function Metric({metric} : Props) {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className={classes.root}>

            <Typography variant="subtitle2" noWrap>
                {metric.name}
            </Typography>

            <Graph key={metric.name} values={metricValuesToGraphData(metric.values)}/>

        </div>
    );
}
