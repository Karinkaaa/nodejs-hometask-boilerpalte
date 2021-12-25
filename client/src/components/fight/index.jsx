import React from "react";
import { Button, Container } from "@material-ui/core";

import { getFighters } from "../../services/domainRequest/fightersRequest";
import NewFighter from "../newFighter";
import Fighter from "../fighter";

import "./fight.css";
import { createFight } from "../../services/domainRequest/fightRequest";
import { fight } from "../../services/fight";
import FightsTable from "../fightsTable";

class Fight extends React.Component {
    state = {
        fighters: [],
        fighter1: null,
        fighter2: null,
        winner: null,
        showFight: false
    };

    async componentDidMount() {
        const fighters = await getFighters();
        if (fighters && !fighters.error) {
            this.setState({ fighters });
        }
    }

    onFightStart = async () => {
        const { logs, winner } = await fight(this.state.fighter1, this.state.fighter2);
        this.setState({ winner });

        await createFight({
            fighter1: this.state.fighter1.id,
            fighter2: this.state.fighter2.id,
            log: logs
        });
    };

    onCreate = (fighter) => {
        this.setState({ fighters: [...this.state.fighters, fighter] });
    };

    onFighter1Select = (fighter1) => {
        this.setState({ fighter1 });
    };

    onFighter2Select = (fighter2) => {
        this.setState({ fighter2 });
    };

    getFighter1List = () => {
        const { fighter2, fighters } = this.state;
        if (!fighter2) {
            return fighters;
        }

        return fighters.filter(it => it.id !== fighter2.id);
    };

    getFighter2List = () => {
        const { fighter1, fighters } = this.state;
        if (!fighter1) {
            return fighters;
        }

        return fighters.filter(it => it.id !== fighter1.id);
    };

    showFights = () => {
        this.setState({
            showFight: !this.state.showFight
        });
    };

    render() {
        const { fighter1, fighter2, winner, showFight } = this.state;

        return (
            <div id="wrapper">
                <NewFighter onCreated={this.onCreate}/>
                <div id="figh-wrapper">
                    <Fighter selectedFighter={fighter1} onFighterSelect={this.onFighter1Select}
                             fightersList={this.getFighter1List() || []}/>
                    <div className="btn-wrapper">
                        <Button onClick={this.onFightStart} variant="contained" color="primary">Start Fight</Button>
                    </div>
                    <Fighter selectedFighter={fighter2} onFighterSelect={this.onFighter2Select}
                             fightersList={this.getFighter2List() || []}/>
                </div>
                {
                    winner && (
                        <Container maxWidth={"xs"}>
                            <h1>{winner.name} won!</h1>
                        </Container>
                    )
                }
                <Container>
                    <Button color={"primary"} onClick={() => this.showFights()}>
                        {showFight ? "Hide all fights" : "Show all fights"}
                    </Button>
                    {showFight && <FightsTable/>}
                </Container>
            </div>
        );
    }
}

export default Fight;