export class SpireKnackSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["spire", "sheet", "knack"],
            template: "systems/spire/templates/items/spire-knack-sheet.html",
        });
    }
}
