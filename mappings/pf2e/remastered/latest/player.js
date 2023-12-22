
import baseMapping from "../../../../scripts/baseMapping.js";

class MappingClass extends baseMapping {
    pdfUrl = "/modules/sheet-export/mappings/pf2e/remastered/latest/pf2e-remastered.pdf";

    formatModifier(mod) {
        /* Format the modifier correctly with a + sign if needed */
        if (typeof (mod) === "undefined") {
            return mod;
        } else if (isNaN(parseInt(mod))) {
            return mod;
        } else {
            return (parseInt(mod) < 0) ? mod : `+${mod}`;
        }
    }

    // override createMappings method from base class
    createMappings() {
        super.createMappings();

        /* Ancestry Section*/
        this.setCalculated("ancestry", this.actor.ancestry.name);
        this.setCalculated("heritage_and_traits", this.actor.heritage.name);
        this.setCalculated("heritage_and_traits", this.actor.system.traits.size.value);

        /* Character Name Section*/
        this.setCalculated("character_name", this.actor.name);
        this.setCalculated("player_name", Object.entries(this.actor.ownership).filter(i => i[1] === 3).map(i => i[0]).map(id => !game.users.get(id)?.isGM ? game.users.get(id)?.name : null).filter(x => x).join(", "));

        /* Background Section */
        this.setCalculated("background", this.actor.background.name);
        /* FIXME: complete background notes */
        this.setCalculated("background_notes", "");

        /* Level Section */
        this.setCalculated("level", this.actor.system.details.level.value);
        this.setCalculated("xp", this.actor.system.details.xp.value);

        /* Class Section */
        this.setCalculated("class", this.actor.class.name);
        /* FIXME: complete class notes */
        this.setCalculated("class_notes", "");

        /* attributes Section */
        Object.keys(this.actor.abilities).forEach(
            (a) => {
                this.setCalculated(a, this.formatModifier(this.actor.abilities[a].mod));
                this.setCalculated(`${a}_partial`, this.isPartialAttribute(a));
            }
        );

        /* Defenses Section*/

        /* Armor Class */
        this.setCalculated("ac", this.actor.armorClass.value);
        this.setCalculated("ac_attribute_modifier", this.actor.armorClass.modifiers.filter(i => i.type === 'ability').map(i => i.modifier)[0] || 0);
        this.setCalculated("ac_proficiency_modifier", this.actor.armorClass.modifiers.filter(i => i.type === 'proficiency').map(i => i.modifier)[0] || 0);
        this.setCalculated("ac_item_modifier", this.actor.armorClass.modifiers.filter(i => i.type === 'item').map(i => i.modifier)[0] || 0);

        /* Shield */
        this.setCalculated("ac_shield_bonus", this.actor.items.filter(i => i.system.category === 'shield' && i.isEquipped).map(i => i.system.acBonus)[0] || '');
        this.setCalculated("shield_hardness", this.actor.items.filter(i => i.system.category === 'shield' && i.isEquipped).map(i => i.system.hardness)[0] || '-');
        this.setCalculated("shield_max_hp", this.actor.items.filter(i => i.system.category === 'shield' && i.isEquipped).map(i => i.system.hp.max)[0] || '-');
        this.setCalculated("shield_bt", this.actor.items.filter(i => i.system.category === 'shield' && i.isEquipped).map(i => i.system.hp.brokenThreshold)[0] || '-');
        this.setCalculated("shield_current_hp", this.actor.items.filter(i => i.system.category === 'shield' && i.isEquipped).map(i => i.system.hp.value)[0] || '-');

        /* Armor proficiencies */
        /* TODO: this gives error
        Object.keys(this.actor.system.proficiencies.defenses).forEach(
            (d) => {
                this.setCalculated(`defense_${d}_trained`, this.actor.system.proficiencies.defenses[d].rank >= 1 || false );
                this.setCalculated(`defense_${d}_expert`, this.actor.system.proficiencies.defenses[d].rank >= 2 || false );
                this.setCalculated(`defense_${d}_master`, this.actor.system.proficiencies.defenses[d].rank >= 3 || false );
                this.setCalculated(`defense_${d}_legendary`, this.actor.system.proficiencies.defenses[d].rank >= 4 || false );
            }
        );
*/
        /* Saving Throws */
        Object.keys(this.actor.saves).forEach(
            (s) => {
                this.setCalculated(`${s}`, this.actor.saves[s].mod);
                this.setCalculated(`${s}_attribute_modifier`, this.actor.saves[s].modifiers.filter(i => i.type === 'ability' && i.enabled).map(i => i.modifier)[0] || 0);
                this.setCalculated(`${s}_proficiency_modifier`, this.actor.saves[s].modifiers.filter(i => i.type === 'proficiency' && i.enabled).map(i => i.modifier)[0] || 0);
                this.setCalculated(`${s}_item_modifier`, this.actor.saves[s].modifiers.filter(i => i.type === 'item' && i.enabled).map(i => i.modifier).sort().reverse()[0] || 0);
                this.setCalculated(`${s}_trained`, this.actor.saves[s].rank >= 1 || false);
                this.setCalculated(`${s}_expert`, this.actor.saves[s].rank >= 2 || false);
                this.setCalculated(`${s}_master`, this.actor.saves[s].rank >= 3 || false);
                this.setCalculated(`${s}_legendary`, this.actor.saves[s].rank >= 4 || false);
            }
        );

        // Set test image
        this.setImage(this.actor.img, 2, 30, 600, 100, 200);

    }

    // custom method in the mapping class
    isPartialAttribute(attribute) {
        /* is there a partial boost for the given attribute */
        let count = 0;
        attribute = attribute.toLowerCase();
        Object.values(this.actor.system.build.attributes.boosts).forEach(
            (el) => {
                if (typeof (el) === "string" && el.toLowerCase() === attribute) {
                    count = count + 1;
                } else if (Array.isArray(el) && el.map(i => i.toLowerCase()).includes(attribute)) {
                    count = count + 1;
                }
            }
        );
        Object.values(this.actor.system.build.attributes.flaws).forEach(
            (el) => {
                if (typeof (el) === "string" && el.toLowerCase() === attribute) {
                    count = count - 1;
                } else if (Array.isArray(el) && el.map(i => i.toLowerCase()).includes(attribute)) {
                    count = count - 1;
                }
            }
        );
        if (count > 4 && parseInt(count / 2) * 2 < count) {
            return true;
        }
        return false;
    }

}

export default MappingClass;
