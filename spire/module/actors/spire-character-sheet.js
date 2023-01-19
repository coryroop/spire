export class SpireCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["spire", "sheet", "character"],
            template: "systems/spire/templates/actors/spire-character-sheet.html",
        });
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) {
            return;
        }

        // Add item
        html.find(".spire-item-create").click(this._onItemCreate.bind(this));

        // Edit item
        html.find(".spire-item-edit").click((ev) => {
            const boxItem = $(ev.currentTarget).parents(".spire-table-item");
            const item = this.actor.items.get(boxItem.data("itemId"));
            item.sheet.render(true);
        });

        // Delete item
        html.find(".spire-item-delete").click((ev) => {
            const boxItem = $(ev.currentTarget).parents(".spire-table-item");
            const item = this.actor.items.get(boxItem.data("itemId"));
            item.delete();
        });

        // Hide or show refresh, abilities, bonds or fallout summary
        html.find(".spire-refresh .spire-table-item-title-label").click((event) => this._onItemSummary(event));
        html.find(".spire-abilities .spire-table-item-title-label").click((event) => this._onItemSummary(event));
        html.find(".spire-bonds .spire-table-item-title-label").click((event) => this._onItemSummary(event));
        html.find(".spire-fallout .spire-table-item-title-label").click((event) => this._onItemSummary(event));

        // Hide or show equipment summary
        html.find(".spire-equipment .spire-table-item-title-label").click((event) => this._onEquipmentSummary(event));
    }

    /** @override */
    getData() {
        const data = super.getData();

        // Prepare items
        if (this.actor.data.type == "character") {
            this._prepareCharacterItems(data);
        }

        return data;
    }

    _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const data = duplicate(header.dataset);
        const name = `New ${type.capitalize()}`;
        const itemData = {
            name: name,
            type: type,
            data: data,
        };
        delete itemData.data["type"];
        return this.actor.createEmbeddedDocuments("Item", [itemData]).then((items) => items[0].sheet.render(true));
    }

    _onItemSummary(event) {
        event.preventDefault();
        const boxItem = $(event.currentTarget).parents(".spire-table-item");
        const item = this.actor.items.get(boxItem.data("itemId"));
        if (boxItem.hasClass("expanded")) {
            let summary = boxItem.children(".spire-table-item-summary");
            summary.slideUp(200, () => summary.remove());
        } else {
            let div = $(`<div class="spire-table-item-summary">${item.data.data.description}</div>`);
            boxItem.append(div.hide());
            div.slideDown(200);
        }
        boxItem.toggleClass("expanded");
    }

    _onEquipmentSummary(event) {
        event.preventDefault();
        const boxItem = $(event.currentTarget).parents(".spire-table-item");
        const item = this.actor.items.get(boxItem.data("itemId"));
        if (boxItem.hasClass("expanded")) {
            let summary = boxItem.children(".spire-tag-list");
            summary.slideUp(200, () => summary.remove());
        } else {
            let div = $(`<div class="spire-tag-list"></div>`);
            // TODO: a loop would probably be more appropriate
            if (item.data.data.tag1) {
                div.append(`<span class="spire-tag">${item.data.data.tag1}</span> `);
            }
            if (item.data.data.tag2) {
                div.append(`<span class="spire-tag">${item.data.data.tag2}</span> `);
            }
            if (item.data.data.tag3) {
                div.append(`<span class="spire-tag">${item.data.data.tag3}</span> `);
            }
            if (item.data.data.tag4) {
                div.append(`<span class="spire-tag">${item.data.data.tag4}</span> `);
            }
            if (item.data.data.tag5) {
                div.append(`<span class="spire-tag">${item.data.data.tag5}</span>`);
            }
            boxItem.append(div.hide());
            div.slideDown(200);
        }
        boxItem.toggleClass("expanded");
    }

    _prepareCharacterItems(sheetData) {
        const actorData = sheetData.actor;

        // Initialize containers.
        const abilities = [];
        const bonds = [];
        const equipments = [];
        const fallouts = [];
        const knacks = [];
        const refreshes = [];

        // Iterate through items, allocating to containers
        for (let i of sheetData.items) {
            i.img = i.img || DEFAULT_TOKEN;

            if (i.type === "ability") {
                abilities.push(i);
            } else if (i.type === "bond") {
                bonds.push(i);
            } else if (i.type === "knack") {
                knacks.push(i);
            } else if (i.type === "equipment") {
                equipments.push(i);
            } else if (i.type === "fallout") {
                fallouts.push(i);
            } else if (i.type === "refresh") {
                refreshes.push(i);
            }
        }

        // Assign and return
        actorData.abilities = abilities;
        actorData.bonds = bonds;
        actorData.equipments = equipments;
        actorData.fallouts = fallouts;
        actorData.knacks = knacks;
        actorData.refreshes = refreshes;
    }
}
