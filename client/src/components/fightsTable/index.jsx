import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { getAllFights } from "../../services/domainRequest/fightRequest";

class FightRow extends React.Component {
    render() {
        return (
            <TableRow>
                <TableCell>{this.props.fight.fighter1}</TableCell>
                <TableCell>{this.props.fight.fighter2}</TableCell>
                <TableCell>{this.props.fight.log
                    .map(({ fighter1Shot, fighter2Shot, fighter1Health, fighter2Health }) => (
                        <>
                            <span>fighter1Shot: {fighter1Shot}</span>
                            <span>fighter2Shot: {fighter2Shot}</span>
                            <span>fighter1Health: {fighter1Health}</span>
                            <span>fighter2Health: {fighter2Health}</span>
                        </>
                    ))}</TableCell>
            </TableRow>
        );
    }
}

class FightsTable extends React.Component {
    state = {
        fights: []
    };

    async componentDidMount() {
        const fights = await getAllFights();
        this.setState({ fights });
    }

    render() {
        return (
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>Fighter 1 ID</TableCell>
                        <TableCell>Fighter 2 ID</TableCell>
                        <TableCell>Logs</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        this.state.fights.map((fight) => (
                            <FightRow fight={fight}/>
                        ))
                    }
                </TableBody>
            </Table>
        );
    }
}

export default FightsTable;