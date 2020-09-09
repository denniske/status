import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import {withApollo} from "../../apollo/client";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import Group from "../components/group";
import {IGroupsQuery} from "../components/types";
import {useEffect} from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: 1,
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
        pollInterval: 60 * 1000,
    })

    const groups = profileResult.data?.groups;

    return (
        <div className={classes.root}>

            <Typography variant="body1" noWrap>
                Status
                <br/>
                <br/>
            </Typography>
            {
                groups?.map(group => (
                    <Group key={group.name} group={group} showComponents={true}/>
                ))
            }

            <Typography variant="body1" noWrap>
                Metrics
                <br/>
                <br/>
            </Typography>
            {
                groups?.map(group => (
                    <Group key={group.name} group={group} showMetrics={true}/>
                ))
            }
        </div>
    );
}

export default withApollo(ResponsiveDrawer, {ssr:false})
