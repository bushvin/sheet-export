import baseMapping from '../../../../scripts/baseMapping.js';

class MappingClass extends baseMapping {
    pdfUrl = '/modules/sheet-export/mappings/pf2e/remastered/latest/pf2e-remastered.pdf';
    authors = [
        {
            name: 'bushvin',
            url: 'https://blog.elaba.net',
            lemmy: 'https://lemmy.world/u/bushvin',
            github: 'https://github.com/bushvin',
        },
    ];

    spellcasting_traditions = ['arcane', 'occult', 'primal', 'divine'];
    prepared_types = ['prepared', 'spontaneous'];

    formatModifier(mod) {
        /* Format the modifier correctly with a + sign if needed */
        if (typeof mod === 'undefined') {
            return mod;
        } else if (isNaN(parseInt(mod))) {
            return mod;
        } else {
            return parseInt(mod) < 0 ? mod : `+${mod}`;
        }
    }

    ucFirst(value) {
        /* Capitalize the given string */
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    // override createMappings method from base class
    createMappings() {
        super.createMappings();

        /* Set images */
        /* Set actor image */
        this.setImage(this.actor.img, 2, 30, 600, 100, 200);

        /* Ancestry Section*/
        this.setCalculated('ancestry', this.actor.ancestry.name);
        this.setCalculated('heritage_and_traits', this.actor.heritage.name);
        this.setCalculated('heritage_and_traits', this.actor.system.traits.size.value);

        /* Character Name Section*/
        this.setCalculated('character_name', this.actor.name);
        this.setCalculated(
            'player_name',
            Object.entries(this.actor.ownership)
                .filter((i) => i[1] === 3)
                .map((i) => i[0])
                .map((id) => (!game.users.get(id)?.isGM ? game.users.get(id)?.name : null))
                .filter((x) => x)
                .join(', ')
        );

        /* Background Section */
        this.setCalculated('background', this.actor.background.name);
        /* FIXME: complete background notes */
        this.setCalculated('background_notes', '');

        /* Level Section */
        this.setCalculated('level', this.actor.system.details.level.value);
        this.setCalculated('xp', this.actor.system.details.xp.value);

        /* Class Section */
        this.setCalculated('class', this.actor.class.name);
        /* FIXME: complete class notes */
        this.setCalculated('class_notes', '');

        /* attributes Section */
        Object.keys(this.actor.abilities).forEach((a) => {
            this.setCalculated(a, this.formatModifier(this.actor.abilities[a].mod));
            this.setCalculated(`${a}_partial`, this.isPartialAttribute(a));
        });

        /* Defenses Section*/

        /* Armor Class */
        this.setCalculated('ac', this.actor.armorClass.value);
        this.setCalculated(
            'ac_attribute_modifier',
            this.actor.armorClass.modifiers.filter((i) => i.type === 'ability').map((i) => i.modifier)[0] || 0
        );
        this.setCalculated(
            'ac_proficiency_modifier',
            this.actor.armorClass.modifiers.filter((i) => i.type === 'proficiency').map((i) => i.modifier)[0] || 0
        );
        this.setCalculated(
            'ac_item_modifier',
            this.actor.armorClass.modifiers.filter((i) => i.type === 'item').map((i) => i.modifier)[0] || 0
        );

        /* Shield */
        this.setCalculated(
            'ac_shield_bonus',
            this.actor.items
                .filter((i) => i.system.category === 'shield' && i.isEquipped)
                .map((i) => i.system.acBonus)[0] || ''
        );
        this.setCalculated(
            'shield_hardness',
            this.actor.items
                .filter((i) => i.system.category === 'shield' && i.isEquipped)
                .map((i) => i.system.hardness)[0] || '-'
        );
        this.setCalculated(
            'shield_max_hp',
            this.actor.items
                .filter((i) => i.system.category === 'shield' && i.isEquipped)
                .map((i) => i.system.hp.max)[0] || '-'
        );
        this.setCalculated(
            'shield_bt',
            this.actor.items
                .filter((i) => i.system.category === 'shield' && i.isEquipped)
                .map((i) => i.system.hp.brokenThreshold)[0] || '-'
        );
        this.setCalculated(
            'shield_current_hp',
            this.actor.items
                .filter((i) => i.system.category === 'shield' && i.isEquipped)
                .map((i) => i.system.hp.value)[0] || '-'
        );

        /* Armor proficiencies */
        Object.keys(this.actor.system.proficiencies.defenses).forEach((d) => {
            this.setCalculated(`defense_${d}_trained`, this.actor.system.proficiencies.defenses[d].rank >= 1 || false);
            this.setCalculated(`defense_${d}_expert`, this.actor.system.proficiencies.defenses[d].rank >= 2 || false);
            this.setCalculated(`defense_${d}_master`, this.actor.system.proficiencies.defenses[d].rank >= 3 || false);
            this.setCalculated(
                `defense_${d}_legendary`,
                this.actor.system.proficiencies.defenses[d].rank >= 4 || false
            );
        });

        /* Saving Throws */
        Object.keys(this.actor.saves).forEach((s) => {
            this.setCalculated(`${s}`, this.actor.saves[s].mod);
            this.setCalculated(
                `${s}_attribute_modifier`,
                this.actor.saves[s].modifiers
                    .filter((i) => i.type === 'ability' && i.enabled)
                    .map((i) => i.modifier)[0] || 0
            );
            this.setCalculated(
                `${s}_proficiency_modifier`,
                this.actor.saves[s].modifiers
                    .filter((i) => i.type === 'proficiency' && i.enabled)
                    .map((i) => i.modifier)[0] || 0
            );
            this.setCalculated(
                `${s}_item_modifier`,
                this.actor.saves[s].modifiers
                    .filter((i) => i.type === 'item' && i.enabled)
                    .map((i) => i.modifier)
                    .sort()
                    .reverse()[0] || 0
            );
            this.setCalculated(`${s}_trained`, this.actor.saves[s].rank >= 1 || false);
            this.setCalculated(`${s}_expert`, this.actor.saves[s].rank >= 2 || false);
            this.setCalculated(`${s}_master`, this.actor.saves[s].rank >= 3 || false);
            this.setCalculated(`${s}_legendary`, this.actor.saves[s].rank >= 4 || false);
        });

        /* Hit Points Section*/
        this.setCalculated('hp_max', this.actor.hitPoints.max);
        this.setCalculated('hp_current', this.actor.hitPoints.value);
        this.setCalculated('hp_temp', this.actor.hitPoints.temp);
        this.setCalculated('dying_1', this.actor.system.attributes.dying.value >= 1 || false);
        this.setCalculated('dying_2', this.actor.system.attributes.dying.value >= 2 || false);
        this.setCalculated('dying_3', this.actor.system.attributes.dying.value >= 3 || false);
        this.setCalculated('dying_4', this.actor.system.attributes.dying.value >= 4 || false);
        this.setCalculated(
            'wounded',
            this.actor.system.attributes.wounded.value + '/' + this.actor.system.attributes.wounded.max
        );
        this.setCalculated(
            'resistances_immunities',
            '                                            ' +
                this.actor.system.attributes.resistances
                    .map((i) => i.type + ' ' + i.value)
                    .concat(this.actor.system.attributes.immunities.map((i) => i.type))
                    .sort()
                    .join(', ')
        );
        this.setCalculated('conditions', this.actor.conditions.map((i) => i.name).join(', '));

        /* Defense Notes */
        this.setCalculated('defense_notes', '                         ' + this.defenseNotes());

        /* Skills */
        Object.values(this.actor.skills)
            .filter((i) => !i.lore)
            .forEach((skill) => {
                this.setCalculated(`${skill.slug}`, this.formatModifier(skill.mod));
                this.setCalculated(`${skill.slug}_attribute_modifier`, skill.attributeModifier.modifier || '0');
                this.setCalculated(
                    `${skill.slug}_proficiency_modifier`,
                    skill.modifiers.filter((i) => i.type == 'proficiency').map((i) => i.modifier)[0] || '0'
                );
                this.setCalculated(
                    `${skill.slug}_item_modifier`,
                    skill.modifiers
                        .filter((i) => i.type === 'item' && i.enabled && i.slug !== 'armor-check-penalty')
                        .map((i) =>
                            [i.modifier].reduce((partialSum, a) => partialSum + a, 0) < 0
                                ? [i.modifier].reduce((partialSum, a) => partialSum + a, 0)
                                : '+' + [i.modifier].reduce((partialSum, a) => partialSum + a, 0)
                        )[0] || '0'
                );
                this.setCalculated(
                    `${skill.slug}_armor_modifier`,
                    skill.modifiers.filter((i) => i.slug === 'armor-check-penalty').map((i) => i.modifier)[0] || '0'
                );
                this.setCalculated(`${skill.slug}_trained`, skill.rank >= 1 || false);
                this.setCalculated(`${skill.slug}_expert`, skill.rank >= 2 || false);
                this.setCalculated(`${skill.slug}_master`, skill.rank >= 3 || false);
                this.setCalculated(`${skill.slug}_legendary`, skill.rank >= 4 || false);
            });

        /* Lore Skills */
        Object.values(this.actor.skills)
            .filter((i) => i.lore)
            .forEach((skill, index) => {
                this.setCalculated(`lore${index + 1}`, this.formatModifier(skill.mod));
                this.setCalculated(`lore${index + 1}_subcategory`, skill.label);
                this.setCalculated(`lore${index + 1}_attribute_modifier`, skill.attributeModifier.modifier || '0');
                this.setCalculated(
                    `lore${index + 1}_proficiency_modifier`,
                    skill.modifiers.filter((i) => i.type == 'proficiency').map((i) => i.modifier)[0] || '0'
                );
                this.setCalculated(
                    `lore${index + 1}_item_modifier`,
                    skill.modifiers
                        .filter((i) => i.type === 'item' && i.enabled && i.slug !== 'armor-check-penalty')
                        .map((i) =>
                            [i.modifier].reduce((partialSum, a) => partialSum + a, 0) < 0
                                ? [i.modifier].reduce((partialSum, a) => partialSum + a, 0)
                                : '+' + [i.modifier].reduce((partialSum, a) => partialSum + a, 0)
                        )[0] || '0'
                );
                this.setCalculated(
                    `lore${index + 1}_armor_modifier`,
                    skill.modifiers.filter((i) => i.slug === 'armor-check-penalty').map((i) => i.modifier)[0] || '0'
                );
                this.setCalculated(`lore${index + 1}_trained`, skill.rank >= 1 || false);
                this.setCalculated(`lore${index + 1}_expert`, skill.rank >= 2 || false);
                this.setCalculated(`lore${index + 1}_master`, skill.rank >= 3 || false);
                this.setCalculated(`lore${index + 1}_legendary`, skill.rank >= 4 || false);
            });

        /* Skill Notes */
        /* Skills with assurance */
        this.setCalculated('skill_notes', this.skillNotes());

        /* Languages Section */
        this.setCalculated(
            'languages',
            this.actor.system.traits.languages.value
                .concat([this.actor.system.traits.languages.custom])
                .filter(function (a) {
                    return a.trim() != '';
                })
                .join(', ')
        );

        /* Perception Section  */
        this.setCalculated('perception', this.formatModifier(this.actor.perception.mod));
        this.setCalculated(
            'perception_attribute_modifier',
            this.actor.perception.modifiers
                .filter((i) => i.type === 'ability' && i.enabled)
                .map((i) => i.modifier)[0] || 0
        );
        this.setCalculated(
            'perception_proficiency_modifier',
            this.actor.perception.modifiers
                .filter((i) => i.type === 'proficiency' && i.enabled)
                .map((i) => i.modifier)[0] || 0
        );
        this.setCalculated(
            'perception_item_modifier',
            this.actor.perception.modifiers.filter((i) => i.type === 'item' && i.enabled).map((i) => i.modifier)[0] || 0
        );
        this.setCalculated('perception_trained', this.actor.perception.rank >= 1 || '');
        this.setCalculated('perception_expert', this.actor.perception.rank >= 2 || '');
        this.setCalculated('perception_master', this.actor.perception.rank >= 3 || '');
        this.setCalculated('perception_legendary', this.actor.perception.rank >= 4 || '');

        this.setCalculated(
            'senses_notes',
            this.actor.system.traits.senses
                .filter((i) => i.type)
                .map((i) => i.label)
                .join(', ') +
                ' \n' +
                this.actor.system.attributes.perception.modifiers
                    .filter((i) => i.type === 'item' || i.type === 'untyped')
                    .map((i) => ' ' + (i.slug ? i.slug : i.label) + ' ' + (i.modifier < 0 ? '' : '+') + i.modifier)
                    .join(', ')
        );

        /* Speed Section */
        this.setCalculated(
            'speed',
            this.actor.system.attributes.speed.value +
                this.actor.system.attributes.speed.totalModifier +
                this.actor.items
                    .filter((i) => i.type === 'armor' && i.isEquipped)
                    .map((i) => i.speedPenalty)
                    .reduce((a, v) => {
                        return a + v;
                    }, 0)
        );
        this.setCalculated(
            'special_movement',
            this.actor.system.attributes.speed.otherSpeeds.map((i) => ' ' + i.label + ' ' + i.value).join(', ') +
                ' \n' +
                this.actor.system.attributes.speed.modifiers
                    .map((i) => ' ' + (i.slug ? i.slug : i.label) + ' ' + (i.modifier < 0 ? '' : '+') + i.modifier)
                    .join(', ')
        );

        /* Strikes */
        /* Melee strikes range from 0-2 */
        this.calculateAttacks('melee-attack-roll');

        /* Ranged strikes range from 0-1 */
        this.calculateAttacks('ranged-attack-roll');

        /* Weapon Proficiencies */
        Object.keys(this.actor.system.proficiencies.attacks).forEach((a) => {
            this.setCalculated(`attack_${a}_trained`, this.actor.system.proficiencies.attacks[a].rank >= 1 || false);
            this.setCalculated(`attack_${a}_expert`, this.actor.system.proficiencies.attacks[a].rank >= 2 || false);
            this.setCalculated(`attack_${a}_master`, this.actor.system.proficiencies.attacks[a].rank >= 3 || false);
            this.setCalculated(`attack_${a}_legendary`, this.actor.system.proficiencies.attacks[a].rank >= 4 || false);
        });
        /* This is probably not needed */
        this.setCalculated('attack_other_trained', false);
        this.setCalculated('attack_other_expert', false);
        this.setCalculated('attack_other_master', false);
        this.setCalculated('attack_other_legendary', false);

        /* FIXME: fill out attack_other_notes */
        this.setCalculated('attack_other_notes', '');
        /* FIXME: fill out critical_specializations */
        this.setCalculated('critical_specializations', '');

        /* Class DC Section */
        this.setCalculated('class_dc', this.actor.classDC.mod + 10);
        this.setCalculated('class_dc_attribute_modifier', this.actor.classDC.attributeModifier.value);
        this.setCalculated(
            'class_dc_proficiency_modifier',
            this.actor.classDC.modifiers.filter((i) => i.type === 'proficiency').map((i) => i.modifier)[0] || 0
        );
        this.setCalculated(
            'class_dc_item_modifier',
            this.actor.classDC.modifiers.filter((i) => i.type === 'item').map((i) => i.modifier)[0] || 0
        );

        /* Ancestry and General Feats Section*/
        this.setCalculated(
            '1_ancestry_hertitage_abilities',
            this.actor.items
                .filter((i) => i.type === 'feat' && (i.category === 'ancestryfeature' || i.category == 'heritage'))
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)
                .join(', ')
        );
        this.setCalculated(
            '1_ancestry_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'ancestry-1')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '1_background_skill_feat',
            this.actor.background.system.items[Object.keys(this.actor.background.system.items)[0]].name
        );
        this.setCalculated(
            '2_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-2')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '3_general_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'general-3')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '4_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-4')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '5_ancestry_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'ancestry-5')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated('5_boosts', this.sortAttributeBoosts(this.actor.system.build.attributes.boosts[5]));
        this.setCalculated(
            '6_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-6')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '7_general_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'general-7')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '8_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-8')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '9_ancestry_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'ancestry-9')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '10_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-10')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated('10_boosts', this.sortAttributeBoosts(this.actor.system.build.attributes.boosts[10]));
        this.setCalculated(
            '11_general_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'general-11')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '12_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-12')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '13_ancestry_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'ancestry-13')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '14_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-14')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '15_general_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'general-15')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated('15_boosts', this.sortAttributeBoosts(this.actor.system.build.attributes.boosts[15]));
        this.setCalculated(
            '16_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-16')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '17_ancestry_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'ancestry-17')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '18_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-18')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '19_general_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'general-19')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '20_skill_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'skill-20')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated('20_boosts', this.sortAttributeBoosts(this.actor.system.build.attributes.boosts[20]));

        /* Class Abilities Section */
        this.setCalculated(
            '1_class_feats_features',
            this.actor.items
                .filter(
                    (i) =>
                        i.type === 'feat' &&
                        i.system.level.value === 1 &&
                        (i.system.category === 'classfeature' || i.system.category === 'class')
                )
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)
                .join(', ') || ''
        );
        this.setCalculated(
            '2_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-2')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '3_class_feature',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.category === 'classfeature' && i.system.level.value === 3)
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '4_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-4')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '5_class_feature',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.category === 'classfeature' && i.system.level.value === 5)
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '6_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-6')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '7_class_feature',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.category === 'classfeature' && i.system.level.value === 7)
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '8_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-8')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '9_class_feature',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.category === 'classfeature' && i.system.level.value === 9)
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '10_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-10')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '11_class_feature',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.category === 'classfeature' && i.system.level.value === 11)
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '12_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-12')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '13_class_feature',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.category === 'classfeature' && i.system.level.value === 13)
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '14_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-14')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '15_class_feature',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.category === 'classfeature' && i.system.level.value === 15)
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '16_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-16')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '17_class_feature',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.category === 'classfeature' && i.system.level.value === 17)
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '18_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-18')
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '19_class_feature',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.category === 'classfeature' && i.system.level.value === 18)
                .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                .map((i) => i.name)[0] || ''
        );
        this.setCalculated(
            '20_class_feat',
            this.actor.items
                .filter((i) => i.type === 'feat' && i.system.location === 'class-20')
                .map((i) => i.name)[0] || ''
        );

        /* Inventory Section */
        let held_index = 0;
        let consumable_index = 0;
        let worn_index = 0;
        let treasure_index = 0;
        this.actor.inventory.contents
            .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
            .forEach((item) => {
                if (item.type === 'consumable') {
                    /* Consumables */
                    this.setCalculated(
                        `consumable${consumable_index}_name`,
                        (item.system.quantity > 1 ? item.system.quantity + ' ' : '') +
                            item.name +
                            (item.isMagical ? ' ‡ ' : ' ')
                    );
                    this.setCalculated(`consumable${consumable_index}_bulk`, item.system.bulk.value);
                    consumable_index++;
                } else if (item.system.usage.type === 'held') {
                    /* Held items */
                    this.setCalculated(
                        `held_item${held_index}_name`,
                        (item.system.quantity > 1 ? item.system.quantity + ' ' : '') +
                            item.name +
                            (item.isMagical ? ' ‡ ' : ' ')
                    );
                    this.setCalculated(`held_item${held_index}_bulk`, item.system.bulk.value);
                    held_index++;
                } else if (item.system.usage.type === 'worn') {
                    /* Worn items */
                    this.setCalculated(
                        `consumable${worn_index}_name`,
                        (item.system.quantity > 1 ? item.system.quantity + ' ' : '') +
                            item.name +
                            (item.isMagical ? ' ‡ ' : ' ')
                    );
                    this.setCalculated(`consumable${worn_index}_bulk`, item.system.bulk.value);
                    worn_index++;
                } else if (item.type === 'treasure' && item.system.usage.type === 'carried') {
                    /* Gems and artwork */
                    let price = [];
                    ['pp', 'gp', 'sp', 'cp'].forEach((t) => {
                        if (item.system.price.value[t] > 0) {
                            price.push(`${item.system.price.value[t]} ${t}`);
                        }
                    });
                    this.setCalculated(
                        `gems_artwork${treasure_index}_name`,
                        (item.system.quantity > 1 ? item.system.quantity + ' ' : '') +
                            item.name +
                            (item.isMagical ? ' ‡ ' : '')
                    );
                    this.setCalculated(`gems_artwork${treasure_index}_price`, price.join(', '));
                    this.setCalculated(`gems_artwork${treasure_index}_bulk`, item.system.bulk.value);
                    treasure_index++;
                }
            });

        this.setCalculated('bulk', this.actor.inventory.bulk.value.normal);
        this.setCalculated('copper', this.actor.inventory.coins.cp || 0);
        this.setCalculated('silver', this.actor.inventory.coins.sp || 0);
        this.setCalculated('gold', this.actor.inventory.coins.gp || 0);
        this.setCalculated('platinum', this.actor.inventory.coins.pp || 0);

        /* Origin and Appearance Section */
        this.setCalculated('ethnicity', this.actor.system.details.ethnicity.value || '');
        this.setCalculated('nationality', this.actor.system.details.nationality.value || '');
        this.setCalculated('birthplace', this.actor.system.details.biography.birthPlace || '');
        this.setCalculated('age', this.actor.system.details.age.value || '');
        this.setCalculated('gender_pronouns', this.actor.system.details.gender.value || '');
        this.setCalculated('height', this.actor.system.details.height.value || '');
        this.setCalculated('weight', this.actor.system.details.weight.value || '');
        this.setCalculated(
            'Appearance',
            this.actor.system.details.biography.appearance.replace('<p>', '').replace('</p>', '') || ''
        );

        /* Personality Section */
        this.setCalculated('attitude', this.actor.system.details.biography.attitude || '');
        this.setCalculated('deity_philosophy', this.actor.deity?.name || '');
        this.setCalculated('edicts', this.actor.system.details.biography.edicts || '');
        this.setCalculated('anathema', this.actor.system.details.biography.anathema || '');
        this.setCalculated('likes', this.actor.system.details.biography.likes || '');
        this.setCalculated('dislikes', this.actor.system.details.biography.dislikes || '');
        this.setCalculated('catchphrases', this.actor.system.details.biography.catchphrases || '');

        /* Campaign notes Section */
        this.setCalculated(
            'campaign_notes',
            this.actor.system.details.biography.campaignNotes.replace('<p>', '').replace('</p>', '') || ''
        );
        this.setCalculated(
            'allies',
            this.actor.system.details.biography.allies.replace('<p>', '').replace('</p>', '') || ''
        );
        this.setCalculated(
            'enemies',
            this.actor.system.details.biography.enemies.replace('<p>', '').replace('</p>', '') || ''
        );
        this.setCalculated(
            'organizations',
            this.actor.system.details.biography.organaizations?.replace('<p>', '').replace('</p>', '') || ''
        );

        /* Actions and Activities */
        /* ranges from 0-8 in PDF*/
        this.actor.items
            .filter((i) => i.system.actionType?.value == 'action')
            .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
            .forEach((action, index) => {
                if (index < 9) {
                    let frequency =
                        (action.frequency?.max || '') + '/' + this.resolveFrequency(action.frequency?.per || '');
                    if (typeof action.frequency?.max === 'undefined' && typeof action.frequency?.per === 'undefined') {
                        frequency = '';
                    }
                    this.setCalculated(`activity${index + 1}_name`, action.name);
                    this.setCalculated(
                        `activity${index + 1}_action_count`,
                        this.formatActions(action.system.actions.value)
                    );
                    this.setCalculated(
                        `activity${index + 1}_traits`,
                        this.formatTraits([action.system.traits.rarity].concat(action.system.traits.value))
                    );
                    this.setCalculated(`activity${index + 1}_frequency`, frequency);
                    this.setCalculated(
                        `activity${index + 1}_reference`,
                        this.abbreviateSource(action.system.publication?.title || action.system.source?.value || '')
                    );
                }
            });

        /* Reactions and Free actions */
        /* ranges from 9-16 in PDF*/
        this.actor.items
            .filter((i) => i.system.actionType?.value == 'reaction' || i.system.actionType?.value == 'free')
            .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
            .reverse()
            .sort((a, b) =>
                a.system.actionType.value < b.system.actionType.value
                    ? -1
                    : a.system.actionType.value > b.system.actionType.value
                      ? 1
                      : 0
            )
            .reverse()
            .forEach((action, index) => {
                if (index < 9) {
                    let frequency =
                        (action.frequency?.max || '') + '/' + this.resolveFrequency(action.frequency?.per || '');
                    if (typeof action.frequency?.max === 'undefined' && typeof action.frequency?.per === 'undefined') {
                        frequency = '';
                    }
                    this.setCalculated(`activity${index + 9}_name`, action.name);
                    this.setCalculated(
                        `activity${index + 9}_action_count`,
                        action.system.actionType.value === 'reaction' ? 'ä' : 'à' || ''
                    );
                    this.setCalculated(
                        `activity${index + 9}_traits`,
                        this.formatTraits([action.system.traits.rarity].concat(action.system.traits.value))
                    );
                    this.setCalculated(`activity${index + 9}_frequency`, frequency);
                    this.setCalculated(
                        `activity${index + 9}_reference`,
                        this.abbreviateSource(action.system.publication?.title || action.system.source?.value || '')
                    );
                }
            });

        /* Magical Tradition Section*/
        ['arcane', 'occult', 'primal', 'divine'].forEach((tradition) => {
            this.setCalculated(
                tradition,
                this.actor.spellcasting.filter(
                    (i) =>
                        i.system?.tradition?.value === tradition &&
                        ['prepared', 'spontaneous'].includes(i.system?.prepared?.value)
                ).length > 0 || false
            );
        });

        this.setCalculated(
            'prepared_caster',
            this.actor.spellcasting.filter(
                (i) =>
                    this.spellcasting_traditions.includes(i.system?.tradition?.value) &&
                    i.system?.prepared?.value === 'prepared'
            ).length || false
        );
        this.setCalculated(
            'spontaneous_caster',
            this.actor.spellcasting.filter(
                (i) =>
                    this.spellcasting_traditions.includes(i.system?.tradition?.value) &&
                    i.system?.prepared?.value === 'spontaneous'
            ).length || false
        );

        /* Spell Statistics Section */
        this.setCalculated(
            'spell_attack',
            this.formatModifier(
                this.actor.spellcasting
                    .filter(
                        (i) =>
                            this.spellcasting_traditions.includes(i.system?.tradition?.value) &&
                            this.prepared_types.includes(i.system?.prepared?.value)
                    )
                    .sort((a, b) =>
                        a.statistic.check.mod < b.statistic.check.mod
                            ? -1
                            : a.statistic.check.mod > b.statistic.check.mod
                              ? 1
                              : 0
                    )
                    .reverse()
                    .map((i) => i.statistic.mod)[0]
            ) || ''
        );

        this.setCalculated(
            'spell_dc',
            this.actor.spellcasting
                .filter(
                    (i) =>
                        this.spellcasting_traditions.includes(i.system?.tradition?.value) &&
                        this.prepared_types.includes(i.system?.prepared?.value)
                )
                .sort((a, b) =>
                    a.statistic.check.mod < b.statistic.check.mod
                        ? -1
                        : a.statistic.check.mod > b.statistic.check.mod
                          ? 1
                          : 0
                )
                .reverse()
                .map((i) => i.statistic.check.mod)[0] + 10 || ''
        );

        this.setCalculated(
            'cantrip_slots',
            this.actor.spellcasting
                .filter(
                    (i) =>
                        this.spellcasting_traditions.includes(i.system?.tradition?.value) &&
                        this.prepared_types.includes(i.system?.prepared?.value)
                )
                .sort((a, b) =>
                    a.statistic.check.mod < b.statistic.check.mod
                        ? -1
                        : a.statistic.check.mod > b.statistic.check.mod
                          ? 1
                          : 0
                )
                .reverse()
                .map((i) => i.spells.entry.system.slots.slot0.max)[0] || ''
        );
        this.setCalculated(
            'cantrip_rank',
            this.actor.items.filter((i) => i.type === 'spell' && i.isCantrip)[0]
                ? Math.round(this.actor.system.details.level.value / 2)
                : ''
        );

        /* Focus Spells Section */
        this.setCalculated('focus_point_1', this.actor.system.resources.focus.max >= 1 || false);
        this.setCalculated('focus_point_2', this.actor.system.resources.focus.max >= 2 || false);
        this.setCalculated('focus_point_3', this.actor.system.resources.focus.max >= 3 || false);
        this.setCalculated(
            'focus_spell_rank',
            this.actor.items.filter((i) => i.type === 'spell' && i.isFocusSpell && !i.isRitual)[0]
                ? Math.round(this.actor.system.details.level.value / 2)
                : ''
        );

        /* Focus spells */
        this.actor.items
            .filter((i) => i.type === 'spell' && i.isFocusSpell && !i.isRitual)
            .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
            .forEach((focus_spell, index) => {
                this.setCalculated(`focus_spell_entry${index}_name`, focus_spell.name);
                this.setCalculated(
                    `focus_spell_entry${index}_actions`,
                    this.formatActions(focus_spell.system.time.value)
                );
            });

        /* Innate Spell Section */
        /* FIXME: include innate spells */
        this.setCalculated('list_innate_spells', '');

        /* Formulas */
        this.actor.system.crafting.formulas
            .map((a) => fromUuidSync(a.uuid))
            .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
            .reverse()
            .sort((a, b) => (a.system.level < b.system.level ? -1 : a.system.level > b.system.level ? 1 : 0))
            .reverse()
            .forEach((item, index) => {
                this.setCalculated(`item_formula${index}_name`, item.name);
                this.setCalculated(`item_formula${index}_rank`, item.system.level.value);
            });
    }

    abbreviateSource(value) {
        /* return the abbreviation of the given source */
        switch (value) {
            case "Pathfinder Advanced Player's Guide":
                return 'APG';
            case 'Pathfinder Book of the Dead':
                return 'BotD';
            case 'Pathfinder Core Rulebook':
                return 'CRB';
            case 'Pathfinder Dark Archive':
                return 'DA';
            case 'Pathfinder Gamemastery Guide':
                return 'GMG';
            case 'Pathfinder Guns & Gears':
                return 'GG';
            case 'Pathfinder GM Core':
                return 'GMC';
            case 'Pathfinder Lost Omens: Ancestry Guide':
                return 'AG';
            case 'Pathfinder Lost Omens: Character Guide':
                return 'CG';
            case 'Pathfinder Lost Omens: Gods & Magic':
                return 'GaM';
            case 'Pathfinder Player Core':
                return 'PC';
            case 'Pathfinder Rage of Elements':
                return 'RoE';
            case 'Pathfinder Secrets of Magic':
                return 'SoM';
            case 'Pathfinder Treasure Vault':
                return 'TV';
        }

        return value;
    }

    sortAttributeBoosts(attributes) {
        if (!Array.isArray(attributes)) {
            return '';
        }
        let a = [];
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach((atr) => {
            if (attributes.includes(atr)) {
                a.push(atr);
            }
        });
        return a.join(', ');
    }

    calculateMagic() {
        /* Spells (regular) */
        const actor_spell_rank = Math.ceil((this.actor.level ?? 0) / 2);
        let spell_proficiency_modifier = [];
        let spell_attribute_modifier = [];
        let spell_slots = {};
        let spell_proficiency = [];
        let spellcasting = this.actor.spellcasting.filter(
            (i) =>
                this.spellcasting_traditions.includes(i.system?.tradition?.value) &&
                this.prepared_types.includes(i.system?.prepared?.value)
        );
        let is_spellcaster = spellcasting.length > 0;
        if (is_spellcaster) {
            let spell_index = 0;
            let cantrip_index = 0;
            spellcasting.forEach((sce) => {
                spell_proficiency_modifier.push(
                    sce.statistic.modifiers.filter((i) => i.type === 'proficiency').map((i) => i.modifier)[0] || 0
                );
                spell_attribute_modifier.push(
                    sce.statistic.modifiers.filter((i) => i.type === 'ability').map((i) => i.modifier)[0] || 0
                );
                spell_proficiency.push(sce.system?.proficiency?.value || 0);
                Object.entries(sce.spells.entry.system.slots).forEach(([rank, info]) => {
                    if (!Object.keys(spell_slots).includes(rank)) {
                        spell_slots[rank] = [];
                    }
                    spell_slots[rank].push(info.max);
                });
                if (spellcasting.length > 1) {
                    this.setCalculated(`spell_entry${spell_index}_name`, sce.name);
                    this.setCalculated(`cantrip_entry${cantrip_index}_name`, sce.name);
                    spell_index = spell_index + 1;
                    cantrip_index = cantrip_index + 1;
                }

                /* cantrips */
                this.actor.items
                    .filter(
                        (i) =>
                            i.type === 'spell' &&
                            i.system.location.value === sce._id &&
                            i.isCantrip &&
                            !i.isFocusSpell &&
                            !i.isRitual
                    )
                    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                    .forEach((cantrip) => {
                        let prepared_count =
                            Object.values(sce.spells.entry.system.slots.slot0.prepared).filter(
                                (i) => i.id === cantrip._id
                            ).length || 0;
                        this.setCalculated(`cantrip_entry${cantrip_index}_name`, cantrip.name);
                        this.setCalculated(
                            `cantrip_entry${cantrip_index}_actions`,
                            this.formatActions(cantrip.system.time.value)
                        );
                        this.setCalculated(`cantrip_entry${cantrip_index}_prep`, '0'.repeat(prepared_count));
                        cantrip_index = cantrip_index + 1;
                    });

                /* spells ranks 1 => 10 */
                for (let r = 1; r <= actor_spell_rank; r++) {
                    this.actor.items
                        .filter(
                            (i) =>
                                i.type === 'spell' &&
                                (i.rank == r ||
                                    (sce.isPrepared &&
                                        ((i.system.heightening?.type === 'interval' &&
                                            i.rank < r &&
                                            parseInt((r - i.rank) / i.system.heightening?.interval) ==
                                                (r - i.rank) / i.system.heightening?.interval) ||
                                            (i.system.heightening?.type === 'fixed' && i.rank < r)))) &&
                                i.system.location.value === sce._id &&
                                !i.isFocusSpell &&
                                !i.isRitual &&
                                !i.isCantrip
                        )
                        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                        .forEach((spell) => {
                            let prepared_count =
                                Object.values(sce.spells.entry.system.slots[`slot${r}`].prepared).filter(
                                    (i) => i.id === spell._id
                                ).length || 0;
                            let spell_name = `${spell.name}`;
                            if (
                                spell.system.heightening?.type === 'fixed' &&
                                !Object.keys(spell.system.heightening.levels)
                                    .concat([spell.system.level.value])
                                    .map((i) => parseInt(i))
                                    .includes(r)
                            ) {
                                return;
                            }
                            if (spell.system.heightening?.type === 'fixed' && spell.system.level.value != r) {
                                let h = r - spell.system.level.value;
                                spell_name = `${spell_name} (+${h})`;
                            } else if (spell.system.heightening?.type === 'interval' && spell.system.level.value != r) {
                                let h = (r - spell.system.level.value) / spell.system.heightening.interval;
                                spell_name = `${spell_name} (+${h})`;
                            }
                            this.setCalculated(`spell_entry${spell_index}_name`, spell_name);
                            this.setCalculated(
                                `spell_entry${spell_index}_actions`,
                                this.formatActions(spell.system.time.value)
                            );
                            this.setCalculated(`spell_entry${spell_index}_rank`, r);
                            this.setCalculated(`spell_entry${spell_index}_prep`, '0'.repeat(prepared_count));
                            spell_index = spell_index + 1;
                        });
                }
                if (spellcasting.length > 1) {
                    spell_index = spell_index + 1;
                    cantrip_index = cantrip_index + 1;
                }
            });
            /* Spell Slots */
            Object.keys(spell_slots).forEach((key) => {
                this.setCalculated(`spell${key.substring(4)}_slots`, spell_slots[key].join('|'));
            });
            this.setCalculated('spell_proficiency_modifier', spell_proficiency_modifier[0] || '');
            this.setCalculated('spell_attribute_modifier', spell_attribute_modifier[0] || '');
            this.setCalculated('spell_dc_proficiency_modifier', spell_proficiency_modifier[0] || '');
            this.setCalculated('spell_dc_attribute_modifier', spell_attribute_modifier[0] || '');
            this.setCalculated('attack_spell_trained', spell_proficiency[0] >= 1);
            this.setCalculated('attack_spell_expert', spell_proficiency[0] >= 2);
            this.setCalculated('attack_spell_master', spell_proficiency[0] >= 3);
            this.setCalculated('attack_spell_legendary', spell_proficiency[0] >= 4);
            this.setCalculated('spell_dc_trained', spell_proficiency[0] >= 1);
            this.setCalculated('spell_dc_expert', spell_proficiency[0] >= 2);
            this.setCalculated('spell_dc_master', spell_proficiency[0] >= 3);
            this.setCalculated('spell_dc_legendary', spell_proficiency[0] >= 4);
        }
    }

    calculateAttacks(domain) {
        let field_prefix = '';
        if (domain === 'ranged-attack-roll') {
            field_prefix = 'ranged';
        } else if (domain === 'melee-attack-roll') {
            field_prefix = 'melee';
        } else {
            this.logError(`getAttacks: an invalid domain was specified: ${domain}`);
            return false;
        }

        this.actor.system.actions
            .filter(
                (i) =>
                    i.type === 'strike' &&
                    (i.domains.includes(domain) || i.altUsages.filter((f) => f.domains.includes(domain)).length > 0)
            )
            .sort((a, b) => (a.ready > b.ready ? 1 : a.ready < b.ready ? -1 : 0))
            .reverse()
            .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))
            .reverse()
            .forEach((attack, index) => {
                let cur_attack = {};
                if (attack.domains.includes(domain)) {
                    cur_attack = attack;
                } else if (attack.altUsages.filter((i) => i.domains.includes(domain)).length > 0) {
                    cur_attack = attack.altUsages.filter((i) => i.domains.includes(domain))[0];
                }
                let label = cur_attack.label;
                let total_modifier = parseInt(cur_attack.totalModifier);
                let attribute_modifier =
                    parseInt(cur_attack.modifiers.filter((i) => i.type === 'ability').map((i) => i.modifier)[0]) || 0;
                let proficiency_modifier =
                    parseInt(cur_attack.modifiers.filter((i) => i.type === 'proficiency').map((i) => i.modifier)[0]) ||
                    0;
                let item_modifier =
                    parseInt(
                        cur_attack.modifiers.filter((i) => i.type === 'item' && i.enabled).map((i) => i.modifier)[0]
                    ) || 0;
                let damage = `${cur_attack.item.system.damage.dice}${cur_attack.item.system.damage.die}` || '-';
                let bludgeoning_damage =
                    cur_attack.item.system.damage.damageType === 'bludgeoning' ||
                    cur_attack.item.system.traits.value.includes('versatile-b') ||
                    false;
                let piercing_damage =
                    cur_attack.item.system.damage.damageType === 'piercing' ||
                    cur_attack.item.system.traits.value.includes('versatile-p') ||
                    false;
                let slashing_damage =
                    cur_attack.item.system.damage.damageType === 'slashing' ||
                    cur_attack.item.system.traits.value.includes('versatile-s') ||
                    false;
                let traits_notes = '';
                if (cur_attack.item.system.range != null) {
                    traits_notes =
                        this.formatTraits(
                            cur_attack.item.system.traits.value.concat([`range-${cur_attack.item.system.range}`])
                        ) + this.formatRunes(cur_attack.item.system.runes);
                } else {
                    traits_notes =
                        this.formatTraits(cur_attack.item.system.traits.value) +
                        this.formatRunes(cur_attack.item.system.runes);
                }

                if (attribute_modifier != 0) {
                    damage = damage + this.formatModifier(attribute_modifier);
                }
                this.setCalculated(`${field_prefix}${index + 1}_name`, label);
                this.setCalculated(`${field_prefix}${index + 1}_attack`, this.formatModifier(total_modifier));
                this.setCalculated(`${field_prefix}${index + 1}_attribute_modifier`, attribute_modifier);
                this.setCalculated(`${field_prefix}${index + 1}_proficiency_modifier`, proficiency_modifier);
                this.setCalculated(`${field_prefix}${index + 1}_proficiency_modifier`, proficiency_modifier);
                this.setCalculated(`${field_prefix}${index + 1}_item_modifier`, item_modifier);
                this.setCalculated(`${field_prefix}${index + 1}_damage`, damage);
                this.setCalculated(`${field_prefix}${index + 1}_bludgeoning_damage`, bludgeoning_damage);
                this.setCalculated(`${field_prefix}${index + 1}_piercing_damage`, piercing_damage);
                this.setCalculated(`${field_prefix}${index + 1}_slashing_damage`, slashing_damage);
                this.setCalculated(
                    `${field_prefix}${index + 1}_traits_notes`,
                    `                          ${traits_notes}`
                );
            });
    }

    formatActions(action) {
        /* Format actions so the pdf form displays it correctly */
        action = String(action);
        if (action === '0') {
            action = '';
        } else if (action === '1') {
            action = 'á';
        } else if (action === '2') {
            action = 'â';
        } else if (action === '3') {
            action = 'ã';
        } else if (action === '1 to 2') {
            action = 'á - â';
        } else if (action === '1 to 3') {
            action = 'á - ã';
        } else if (action === 'reaction') {
            action = 'ä';
        }
        action = action.replace(/ minutes/g, 'm');
        action = action.replace(/ minute/g, 'm');
        /* FIXME: do the same for free actions */

        return action;
    }

    formatRunes(runes) {
        let runelist = [];

        if ((runes.potency || 0) > 0) {
            runelist.push(`Potency +${runes.potency}`);
        }
        if ((runes.striking || 0) > 2) {
            runelist.push(`Major Striking`);
        } else if ((runes.striking || 0) > 1) {
            runelist.push(`Greater Striking`);
        } else if ((runes.striking || 0) > 0) {
            runelist.push(`Striking`);
        }
        (runes.property || []).forEach((r) => {
            runelist.push(`${this.ucFirst(r)} Rune`);
        });
        if (runelist.length > 0) {
            return ', ' + runelist.join(', ');
        } else {
            return '';
        }
    }

    formatTraits(traitlist) {
        /* Format and order the traits according to the rules */
        if (typeof traitlist === 'undefined') {
            return '';
        }
        traitlist = traitlist
            .filter((i) => i !== 'common' && i !== null && typeof i !== 'undefined')
            .map((i) => i.toLowerCase());
        let tl = [];
        ['uncommon', 'rare'].forEach((el) => {
            if (traitlist.includes(el)) {
                tl.push(this.ucFirst(el));
                traitlist.splice(traitlist.indexOf(el), 1);
            }
        });
        ['lg', 'ln', 'le', 'ng', 'n', 'ne', 'cg', 'cn', 'ce'].forEach((el) => {
            if (traitlist.includes(el)) {
                tl.push(el.toLocaleUpperCase());
                traitlist.splice(traitlist.indexOf(el), 1);
            }
        });
        ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'].forEach((el) => {
            if (traitlist.includes(el)) {
                tl.push(this.ucFirst(el));
                traitlist.splice(traitlist.indexOf(el), 1);
            }
        });
        tl = tl.concat(traitlist.map((i) => this.ucFirst(i)).sort());
        return tl.join(', ');
    }

    resolveFrequency(frequency) {
        /* resolve the frequency according to what's in foundryvtt-pf2e */
        frequency = frequency.toLowerCase();
        switch (frequency) {
            case 'pt1m':
                frequency = 'minute';
                break;
            case 'pt10m':
                frequency = '10 minutes';
                break;
            case 'pt1h':
                frequency = 'hour';
                break;
            case 'pt24h':
                frequency = '24 hours';
                break;
            case 'p1w':
                frequency = 'week';
                break;
            case 'p1m':
                frequency = 'month';
                break;
            case 'p1y':
                frequency = 'year';
                break;
        }
        return frequency;
    }

    skillNotes() {
        /* This function is to reduce code in the createMapping function */
        let skill_notes = [];
        skill_notes.push(
            'Assurance: ' +
                this.actor.items
                    .filter((i) => i.slug === 'assurance')
                    .map((i) =>
                        i.rules.filter((f) => f.prompt === 'PF2E.SpecificRule.Prompt.Skill').map((m) => m.selection)
                    )
                    .flat(1)
                    .map((i) => this.ucFirst(i))
                    .join(', ')
        );
        return skill_notes.join('\n');
    }

    defenseNotes() {
        /* This function is to reduce code in the createMapping function */
        let defense_notes = [];
        let modifiers_types = ['ability', 'proficiency', 'item'];
        let fortitude_bonus = this.actor.saves.fortitude.modifiers.filter((i) => !modifiers_types.includes(i.type));
        let reflex_bonus = this.actor.saves.reflex.modifiers.filter((i) => !modifiers_types.includes(i.type));
        let will_bonus = this.actor.saves.reflex.modifiers.filter((i) => !modifiers_types.includes(i.type));
        let all_bonus_slugs = fortitude_bonus
            .concat(reflex_bonus)
            .concat(will_bonus)
            .map((i) => i.slug)
            .filter((v, i, a) => a.indexOf(v) === i);
        all_bonus_slugs = all_bonus_slugs.filter(
            (i) =>
                fortitude_bonus.map((i) => i.slug).includes(i) &&
                reflex_bonus.map((i) => i.slug).includes(i) &&
                will_bonus.map((i) => i.slug).includes(i)
        );
        let all_bonus = fortitude_bonus.filter((i) => all_bonus_slugs.includes(i.slug));
        fortitude_bonus = fortitude_bonus.filter((i) => !all_bonus_slugs.includes(i.slug));
        reflex_bonus = reflex_bonus.filter((i) => !all_bonus_slugs.includes(i.slug));
        will_bonus = will_bonus.filter((i) => !all_bonus_slugs.includes(i.slug));
        all_bonus.forEach((b) => {
            defense_notes.push(`${b.label} ${this.formatModifier(b.modifier)} (saves)`);
        });
        fortitude_bonus.forEach((b) => {
            defense_notes.push(`${b.label} ${this.formatModifier(b.modifier)} (fort)`);
        });
        reflex_bonus.forEach((b) => {
            defense_notes.push(`${b.label} ${this.formatModifier(b.modifier)} (ref)`);
        });
        will_bonus.forEach((b) => {
            defense_notes.push(`${b.label} ${this.formatModifier(b.modifier)} (will)`);
        });
        return defense_notes.join(', ');
    }
    // custom method in the mapping class
    isPartialAttribute(attribute) {
        /* is there a partial boost for the given attribute */
        let count = 0;
        attribute = attribute.toLowerCase();
        Object.values(this.actor.system.build.attributes.boosts).forEach((el) => {
            if (typeof el === 'string' && el.toLowerCase() === attribute) {
                count = count + 1;
            } else if (Array.isArray(el) && el.map((i) => i.toLowerCase()).includes(attribute)) {
                count = count + 1;
            }
        });
        Object.values(this.actor.system.build.attributes.flaws).forEach((el) => {
            if (typeof el === 'string' && el.toLowerCase() === attribute) {
                count = count - 1;
            } else if (Array.isArray(el) && el.map((i) => i.toLowerCase()).includes(attribute)) {
                count = count - 1;
            }
        });
        if (count > 4 && parseInt(count / 2) * 2 < count) {
            return true;
        }
        return false;
    }
}

export default MappingClass;
