import { SpireAbilitySheet } from "./items/spire-ability-sheet.js";
import { SpireBondSheet } from "./items/spire-bond-sheet.js";
import { SpireEquipmentSheet } from "./items/spire-equipment-sheet.js";
import { SpireFalloutSheet } from "./items/spire-fallout-sheet.js";
import { SpireKnackSheet } from "./items/spire-knack-sheet.js";
import { SpireRefreshSheet } from "./items/spire-refresh-sheet.js";
import { SpireCharacterSheet } from "./actors/spire-character-sheet.js";
import { spireRollPopup } from "./spire-roll.js";

Hooks.once("init", async function () {
    console.log(`Initializing Spire system`);

    // Register actors sheets
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("spire", SpireCharacterSheet, { types: ["character"], makeDefault: true });

    // Register items sheets
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("spire", SpireAbilitySheet, { types: ["ability"], makeDefault: true });
    Items.registerSheet("spire", SpireBondSheet, { types: ["bond"], makeDefault: true });
    Items.registerSheet("spire", SpireEquipmentSheet, { types: ["equipment"], makeDefault: true });
    Items.registerSheet("spire", SpireFalloutSheet, { types: ["fallout"], makeDefault: true });
    Items.registerSheet("spire", SpireKnackSheet, { types: ["knack"], makeDefault: true });
    Items.registerSheet("spire", SpireRefreshSheet, { types: ["refresh"], makeDefault: true });

    // Pre-load templates
    const templatePaths = [
        "systems/spire/templates/actors/spire-character-sheet.html",
        "systems/spire/templates/items/spire-ability-sheet.html",
        "systems/spire/templates/items/spire-bond-sheet.html",
        "systems/spire/templates/items/spire-equipment-sheet.html",
        "systems/spire/templates/items/spire-fallout-sheet.html",
        "systems/spire/templates/items/spire-knack-sheet.html",
        "systems/spire/templates/items/spire-refresh-sheet.html",
    ];
    loadTemplates(templatePaths);
});

Hooks.on("renderSceneControls", async (app, html) => {
    let dice_roller = $('<li class="scene-control" title="Dice Roll"><i class="fas fa-dice"></i></li>');
    dice_roller.click(function () {
        spireRollPopup();
    });
    html.children().first().append(dice_roller);
});
