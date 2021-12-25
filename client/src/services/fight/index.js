import { controls } from "./controls";

export async function fight(firstFighter, secondFighter) {
    const logs = [];

    return new Promise((resolve) => {
        const pressed = new Set();
        const playerOne = { ...firstFighter };
        const playerTwo = { ...secondFighter };

        playerOne.isBlocked = false;
        playerTwo.isBlocked = false;
        playerOne.timeOfCriticalHit = 0;
        playerTwo.timeOfCriticalHit = 0;

        const keydown = function (event) {
            if (event.repeat) return;

            const code = event.code;
            pressed.add(code);

            const isTimeForPlayerOne = ((new Date().getTime() - playerOne.timeOfCriticalHit) / 1000) > 10;
            const isTimeForPlayerTwo = ((new Date().getTime() - playerTwo.timeOfCriticalHit) / 1000) > 10;

            if (isTimeForPlayerOne && isAllCodesPressed(pressed, controls.PlayerOneCriticalHitCombination)) {
                const damage = getCriticalHitPower(playerOne);
                playerTwo.health -= damage;
                playerOne.timeOfCriticalHit = new Date().getTime();

                logs.push({
                    fighter1Shot: damage,
                    fighter2Shot: 0,
                    fighter1Health: playerOne.health,
                    fighter2Health: playerTwo.health
                });
            } else if (isTimeForPlayerTwo && isAllCodesPressed(pressed, controls.PlayerTwoCriticalHitCombination)) {
                const damage = getCriticalHitPower(playerTwo);
                playerOne.health -= damage;
                playerTwo.timeOfCriticalHit = new Date().getTime();

                logs.push({
                    fighter1Shot: 0,
                    fighter2Shot: damage,
                    fighter1Health: playerOne.health,
                    fighter2Health: playerTwo.health
                });
            } else if (code === controls.PlayerOneAttack && !playerOne.isBlocked && !playerTwo.isBlocked) {
                const damage = getDamage(playerOne, playerTwo);
                playerTwo.health -= damage;

                logs.push({
                    fighter1Shot: damage,
                    fighter2Shot: 0,
                    fighter1Health: playerOne.health,
                    fighter2Health: playerTwo.health
                });
            } else if (code === controls.PlayerTwoAttack && !playerOne.isBlocked && !playerTwo.isBlocked) {
                const damage = getDamage(playerTwo, playerOne);
                playerOne.health -= damage;

                logs.push({
                    fighter1Shot: 0,
                    fighter2Shot: damage,
                    fighter1Health: playerOne.health,
                    fighter2Health: playerTwo.health
                });
            } else if (code === controls.PlayerOneBlock) {
                playerOne.isBlocked = true;
            } else if (code === controls.PlayerTwoBlock) {
                playerTwo.isBlocked = true;
            }

            if (playerOne.health <= 0) {
                document.removeEventListener("keydown", keydown);
                document.removeEventListener("keyup", keyup);
                resolve({ logs, winner: secondFighter });
            }
            if (playerTwo.health <= 0) {
                document.removeEventListener("keydown", keydown);
                document.removeEventListener("keyup", keyup);
                resolve({ logs, winner: firstFighter });
            }
        };

        const keyup = function (event) {
            pressed.delete(event.code);

            if (event.code === controls.PlayerOneBlock) {
                playerOne.isBlocked = false;
            }
            if (event.code === controls.PlayerTwoBlock) {
                playerTwo.isBlocked = false;
            }
        };

        document.addEventListener("keydown", keydown);
        document.addEventListener("keyup", keyup);
    });
}

function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);

    return blockPower > hitPower ? 0 : hitPower - blockPower;
}

function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}

function getCriticalHitPower(fighter) {
    return 2 * fighter.attack;
}

function isAllCodesPressed(pressed, codes) {
    for (let code of codes) {
        if (!pressed.has(code)) {
            return false;
        }
    }
    return true;
}