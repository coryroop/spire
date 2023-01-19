export class SpireBondSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["spire", "sheet", "bond"],
            template: "systems/spire/templates/items/spire-bond-sheet.html",
        });
    }
}
