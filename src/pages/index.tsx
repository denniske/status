import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import {withApollo} from "../../apollo/client";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import Group from "../components/group";
import {IGroupsQuery} from "../components/types";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

const GroupsQuery = gql`
    query GroupsQuery {
        groups {
            name
            components {
                name
                status {
                    date
                    available
                    responseTime
                }
            }
            metrics {
                id
                name
                values {
                    date
                    value
                }
            }
        }
    }
`



function ResponsiveDrawer(props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    const profileResult = useQuery<IGroupsQuery, any>(GroupsQuery, {
        variables: {},
    })

    const groups = profileResult.data?.groups;

    return (
        <div className={classes.root}>
            <Paper className={appClasses.box}>
                {
                    groups?.map(group => (
                        <Group key={group.name} group={group} showComponents={true}/>
                    ))
                }
            </Paper>
            <Paper className={appClasses.box}>
                {
                    groups?.map(group => (
                        <Group key={group.name} group={group} showMetrics={true}/>
                    ))
                }
            </Paper>
        </div>
    );
}

export default withApollo(ResponsiveDrawer, {ssr:false})
