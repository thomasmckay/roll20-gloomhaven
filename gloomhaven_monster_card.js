/* global Gloomhaven:true */
//var ObjectProperties = ObjectProperties || {
var GloomhavenMonsterCardCommand = {

    FRONT_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66582838/lSwP9KuF1aSCPvEMoGErzQ/thumb.jpg?1541764375",
    BACK_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66582848/LpLamH_BsmDZAPY0ejiMsA/thumb.jpg?1541764390",
    MOVE_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66615706/C57BrEHVdcg58aJMPmU4LQ/thumb.png?1541803145",
    ATTACK_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66615068/-zfKjA_1t70HpqLzIoVoOA/thumb.png?1541802525",
    RANGE_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66619339/lKhvRtVatQ4-ce_er_bPHQ/thumb.png?1541805965",
    FLY_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66784296/EnImh8RSO4_9a0u8tN71Xg/thumb.png?1541972842",
    LOOT_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66784294/GZ3feSYyWhnc1trnTrAF4A/thumb.png?1541972842",
    SHIELD_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66784293/IIJIg41zsJOvaS433cfA_A/thumb.png?1541972842",
    HEAL_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66784295/HmiAzKzL2oIpbDoPxqiB6A/thumb.png?1541972842",
    RETALIATE_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66784292/cLiil73WFJNaHLDYcgGF6g/thumb.png?1541972842",
    TARGET_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66784291/KHBa_tMAVkq1TZFoN3YBQg/thumb.png?1541972842",
    JUMP_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66784297/VW_l4caiUv9Q5l01qATeXw/thumb.png?1541972842",
    MONSTER_LEVEL: 0,

    placeTokens: function(msg, object, name, normal, elite) {
        var monster = GloomhavenMonsterStats["monsters"][name];

        if (!monster["imgsrc"]) {
            Gloomhaven.write("Gloomhaven: Monster not defined: " + name, msg.who, "", "GH monster-card");
            return;
        }

        createObj("graphic", {
            name: name,
            imgsrc: monster["imgsrc"].normal,
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: object.get("top") - 40,
            left: object.get("left") - 209,
            width: 70,
            height: 70,
            bar3_value: normal,
            bar3_max: normal
        });

        createObj("graphic", {
            name: name,
            imgsrc: monster["imgsrc"].elite,
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: object.get("top") + 40,
            left: object.get("left") - 209,
            width: 70,
            height: 70,
            bar3_value: elite,
            bar3_max: elite
        });

        return;
    },

    placeLeftStat: function(object, imgsrc, top, normal, elite) {
        createObj("graphic", {
            imgsrc: imgsrc,
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: Gloomhaven.numify(object.get("top")) + top,
            left: Gloomhaven.numify(object.get("left")) - 125,
            width: 20,
            height: 20,
            color: "rgb(255, 255, 255)"
        });

        createObj("text", {
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: Gloomhaven.numify(object.get("top")) + top,
            left: Gloomhaven.numify(object.get("left")) - 150,
            color: "rgb(255, 255, 255)",
            text: normal.toString(),
            font_size: 26,
            font_family: "Contrail"
        });

        createObj("text", {
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: Gloomhaven.numify(object.get("top")) + top,
            left: Gloomhaven.numify(object.get("left")) - 100,
            color: "rgb(255, 215, 0)",
            text: elite.toString(),
            font_size: 26,
            font_family: "Contrail"
        });

        return;
    },

    placeCenterStat: function(object, imgsrc, top, normal, elite) {
        createObj("graphic", {
            imgsrc: imgsrc,
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: Gloomhaven.numify(object.get("top")) + top,
            left: Gloomhaven.numify(object.get("left")) + 0,
            width: 20,
            height: 20,
            color: "rgb(255, 255, 255)"
        });

        if (normal !== undefined) {
            createObj("text", {
                pageid: object.get("pageid"),
                layer: object.get("layer"),
                controlledby: "all",
                top: Gloomhaven.numify(object.get("top")) + top,
                left: Gloomhaven.numify(object.get("left")) - 50,
                color: "rgb(255, 255, 255)",
                text: normal.toString(),
                font_size: 26,
                font_family: "Contrail"
            });
        }

        if (elite !== undefined) {
            createObj("text", {
                pageid: object.get("pageid"),
                layer: object.get("layer"),
                controlledby: "all",
                top: Gloomhaven.numify(object.get("top")) + top,
                left: Gloomhaven.numify(object.get("left")) + 50,
                color: "rgb(255, 215, 0)",
                text: elite.toString(),
                font_size: 26,
                font_family: "Contrail"
            });
        }

        return;
    },

    setupMonsterCard: function(msg, args, object) {
        var i;
        var name = object.get("name");

        var monster = GloomhavenMonsterStats.monsters[name].level[GloomhavenMonsterCardCommand.MONSTER_LEVEL];
        //???? error if monster undefined

        // Name
        createObj("text", {
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: Gloomhaven.numify(object.get("top")) - 83,
            left: Gloomhaven.numify(object.get("left")),
            color: "rgb(255, 255, 255)",
            text: name,
            font_size: 28,
            font_family: "Contrail"
        });

        // Initiative
        var initiative = "--";
        createObj("text", {
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: Gloomhaven.numify(object.get("top")) - 45,
            left: Gloomhaven.numify(object.get("left")) - 143,
            color: "rgb(255, 255, 255)",
            text: initiative.toString(),
            font_size: 28,
            font_family: "Contrail"
        });

        GloomhavenMonsterCardCommand.placeLeftStat(object, GloomhavenMonsterCardCommand.HEAL_IMGSRC, -5,
                                                   monster.normal.health, monster.elite.health);

        GloomhavenMonsterCardCommand.placeCenterStat(object, GloomhavenMonsterCardCommand.MOVE_IMGSRC, -30,
                                                     monster.normal.attack, monster.elite.attack);
        GloomhavenMonsterCardCommand.placeCenterStat(object, GloomhavenMonsterCardCommand.ATTACK_IMGSRC, 0,
                                                     monster.normal.attack, monster.elite.attack);
        GloomhavenMonsterCardCommand.placeCenterStat(object, GloomhavenMonsterCardCommand.RANGE_IMGSRC, 30,
                                                     monster.normal.range, monster.elite.range);

        var target = [undefined, undefined];
        var shield = [undefined, undefined];
        var values;
        for (i = 0; i < monster.normal.attributes.length; i++) {
            values = monster.normal.attributes[i].split(" ");
            if (values[0] === "%target%") {
                target[0] = Gloomhaven.numify(values[1]);
            } else if (values[0] === "%shield%") {
                shield[0] = Gloomhaven.numify(values[1]);
            } else {
                Gloomhaven.write("***** Unknown attribute " + values[0], msg.who, "", "GH monster-card");
            }
        }
        for (i = 0; i < monster.elite.attributes.length; i++) {
            values = monster.elite.attributes[i].split(" ");
            if (values[0] === "%target%") {
                target[1] = Gloomhaven.numify(values[1]);
            } else if (values[0] === "%shield%") {
                shield[1] = Gloomhaven.numify(values[1]);
            } else {
                Gloomhaven.write("***** Unknown attribute " + values[0], msg.who, "", "GH monster-card");
            }
        }
        var top = 60;
        if (target[0] !== undefined || target[1] !== undefined) {
            GloomhavenMonsterCardCommand.placeCenterStat(object, GloomhavenMonsterCardCommand.TARGET_IMGSRC, top,
                                                         target[0], target[1]);
            top = top + 30;
        }
        if (shield[0] !== undefined || shield[1] !== undefined) {
            GloomhavenMonsterCardCommand.placeCenterStat(object, GloomhavenMonsterCardCommand.SHIELD_IMGSRC, top,
                                                         shield[0], shield[1]);
        }

        // gold = rgb(255,215,0)
        GloomhavenMonsterCardCommand.placeTokens(msg, object, name, monster.normal.health, monster.elite.health);
    },

    run: function(msg, args) {
        var object = getObj(msg.selected[0]._type, msg.selected[0]._id);

        if (object === undefined) {
            Gloomhaven.write("No object selected", msg.who, "", "GH monster-card");
            return;
        }

        GloomhavenMonsterCardCommand.setupMonsterCard(msg, args, object);
    }
};
