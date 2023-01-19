export async function spireRoll(skill, domain, mastery, difficulty) {
    // The amount of dice before difficulty is taken into account
    let base_dice_amount = 1;

    // The amount of dice after difficulty is taken into account
    let final_dice_amount = 0;

    // Penalty applied if amount of dice goes below 1 as a result of difficulty
    let difficulty_penalty = 0;

    if (skill) {
        base_dice_amount++;
    }
    if (domain) {
        base_dice_amount++;
    }
    if (mastery) {
        base_dice_amount++;
    }

    final_dice_amount = base_dice_amount - difficulty;

    if (final_dice_amount < 1) {
        difficulty_penalty = 1 - final_dice_amount;
        final_dice_amount = 1;
    }

    let roll = new Roll(`${final_dice_amount}d10`, {});
    roll.roll();
    let roll_results = roll.terms[0].results;
    let roll_status = getSpireRollStatus(roll_results, difficulty_penalty);

    showChatRollMessage(roll_status, roll_results, skill, domain, mastery, difficulty, roll);
    ui.chat.scrollBottom();
}

function getSpireRollStatus(roll_results, difficulty_penalty) {
    let sorted_rolls = roll_results
        .map((i) => i.result)
        .sort(function (a, b) {
            return b - a;
        });
    let result = sorted_rolls[0];

    let success_rate = 0;

    if (result == 1) {
        // Critical Failure
        success_rate = 0;
    } else if (result >= 2 && result <= 5) {
        // Failure
        success_rate = 1;
    } else if (result >= 6 && result <= 7) {
        // Partial Success
        success_rate = 2;
    } else if (result >= 8 && result <= 9) {
        // Success
        success_rate = 3;
    } else if (result == 10) {
        // Critical Success
        success_rate = 4;
    }

    success_rate -= difficulty_penalty;

    if (success_rate >= 4) {
        return "critical-success";
    } else if (success_rate == 3) {
        return "success";
    } else if (success_rate == 2) {
        return "partial-success";
    } else if (success_rate == 1) {
        return "failure";
    } else if (success_rate <= 0) {
        return "critical-failure";
    }

    return "error";
}

export async function spireRollPopup() {
    let content = await renderTemplate("systems/spire/templates/spire-roll-options.html");

    new Dialog({
        title: `Spire Roll`,
        content: content,
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "Roll",
                callback: (html) => {
                    let skill = html.find('[name="skill"]')[0].checked;
                    let domain = html.find('[name="domain"]')[0].checked;
                    let mastery = html.find('[name="mastery"]')[0].checked;
                    let difficulty = 0;
                    if (html.find('[name="difficulty"][value="0"]')[0].checked) {
                        difficulty = 0;
                    }
                    if (html.find('[name="difficulty"][value="1"]')[0].checked) {
                        difficulty = 1;
                    }
                    if (html.find('[name="difficulty"][value="2"]')[0].checked) {
                        difficulty = 2;
                    }
                    spireRoll(skill, domain, mastery, difficulty);
                },
            },
            no: {
                icon: "<i class='fas fa-times'></i>",
                label: game.i18n.localize("Close"),
            },
        },
        default: "yes",
    }).render(true);
}

async function showChatRollMessage(roll_status, roll_results, skill, domain, mastery, difficulty, roll) {
    let speaker = ChatMessage.getSpeaker();

    // Find the highest result
    var highest_result = roll_results.reduce(
        function (a, b) {
            return { result: Math.max(a["result"], b["result"]) };
        },
        { result: 0 }
    ).result;

    // Set all dice as inactive
    for (var roll_result of roll_results) {
        roll_result.active = false;
    }

    // Pick the highest die and set it as active
    for (var roll_result of roll_results) {
        if (roll_result.result === highest_result) {
            roll_result.active = true;
            break;
        }
    }

    let result = await renderTemplate("systems/spire/templates/spire-roll-result.html", {
        roll_status: roll_status,
        roll_results: roll_results,
        skill: skill,
        domain: domain,
        mastery: mastery,
        difficulty: difficulty,
    });

    let messageData = {
        speaker: speaker,
        content: result,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: roll,
    };

    ChatMessage.create(messageData);
}
