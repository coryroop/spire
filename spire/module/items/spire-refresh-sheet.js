export class SpireRefreshSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["spire", "sheet", "refresh"],
            template: "systems/spire/templates/items/spire-refresh-sheet.html",
        });
    }
}
