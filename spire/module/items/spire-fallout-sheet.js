export class SpireFalloutSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["spire", "sheet", "fallout"],
            template: "systems/spire/templates/items/spire-fallout-sheet.html",
        });
    }
}
