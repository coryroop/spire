export class SpireAbilitySheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["spire", "sheet", "ability"],
            template: "systems/spire/templates/items/spire-ability-sheet.html",
        });
    }
}
