import {makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import Graph, {IChartValue} from "./graph";
import {parseISO} from "date-fns";
import {IGroup, IValue} from "./types";
import Metric from "./metric";
import Component from "./component";
import {useAppStyles} from "./app-styles";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: 1,
        width: '100%',
        flexDirection: 'column',
    },
}));

interface Props {
    group: IGroup;
    showComponents?: boolean;
    showMetrics?: boolean;
}

export default function Group({group, showMetrics, showComponents} : Props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    if (showComponents && group.components.length === 0) return <div/>;
    if (showMetrics && group.metrics.length === 0) return <div/>;

    return (
        <div className={classes.root}>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    {group.name}
                </Typography>

            {
                showComponents && group.components.map(component => (
                    <Component key={component.name} component={component}/>
                ))
            }
            {
                showMetrics && group.metrics.map(metric => (
                    <Metric key={metric.name} metric={metric}/>
                ))
            }
            </Paper>
        </div>
    );
}
