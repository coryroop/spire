export class SpireEquipmentSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["spire", "sheet", "equipment"],
            template: "systems/spire/templates/items/spire-equipment-sheet.html",
        });
    }
}
