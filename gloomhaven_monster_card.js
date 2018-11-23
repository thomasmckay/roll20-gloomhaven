//var ObjectProperties = ObjectProperties || {
var ObjectProperties = {

    EXCLUDE_KEYS: {'bio': true, 'notes': true, 'gmnotes': true, '_defaulttoken': true},
    SPACES: " ",
    FRONT_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66582838/lSwP9KuF1aSCPvEMoGErzQ/thumb.jpg?1541764375",
    BACK_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66582848/LpLamH_BsmDZAPY0ejiMsA/thumb.jpg?1541764390",
    MOVE_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66615706/C57BrEHVdcg58aJMPmU4LQ/thumb.png?1541803145",
    ATTACK_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66615068/-zfKjA_1t70HpqLzIoVoOA/thumb.png?1541802525",
    RANGE_IMGSRC: "https://s3.amazonaws.com/files.d20.io/images/66619339/lKhvRtVatQ4-ce_er_bPHQ/thumb.png?1541805965",
    MONSTER_LEVEL: 0,

    rawWrite: function(s, who, style, from) {
        if (who){
            who = "/w " + who.split(" ", 1)[0] + " ";
        }
        sendChat(from, who + s.replace(/\n/g, "<br>"));
    },

    write: function(s, who, style, from) {
        return ObjectProperties.rawWrite(s.replace(/</g, "&lt;").replace(/>/g, "&gt;"), who, style, from);
    },

    showHelp: function(who) {
        var helpMsg = "";
        helpMsg += "Usage: !getprop [options] [property]\n";
        helpMsg += "  or:  !setprop [options] property value\n";
        helpMsg += "!getprop gets specified property (or all properties) of specified (or selected) object(s).\n";
        helpMsg += "!setprop sets specified property of specified (or selected) object(s) to specified value.\n";
        ObjectProperties.write(helpMsg, who, "", "OP");
        helpMsg = "Options:\n";
        helpMsg += "  -h, --help:       display this help message\n";
        helpMsg += "  -t T, --type T:   specify type (e.g. graphic) of all objects referenced after this argument\n";
        helpMsg += "  -i ID, --id ID:   specify object ID\n";
        helpMsg += "  -n N, --name N:   specify object name, for types which have a \"name\" property\n";
        helpMsg += "  -r, --relative:   add value to existing property value rather than overwriting it\n";
        ObjectProperties.write(helpMsg, who, "font-size: small; font-family: monospace", "OP");
    },

    spaces: function(n){
        while (ObjectProperties.SPACES.length < n){
            ObjectProperties.SPACES += ObjectProperties.SPACES;
        }
        return ObjectProperties.SPACES.substring(0, n);
    },

    getCleanImgsrc: function (imgsrc) {
        var parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    },

    displayObjectProperties: function(who, obj, properties){
        var keys = [], values = {}, maxPropLen = 0;
        if (properties.length > 0){
            for (var i = 0; i < properties.length; i++){
                if ((!properties[i]) || (ObjectProperties.EXCLUDE_KEYS[properties[i]])){ continue; }
                if (properties[i].length > maxPropLen){
                    maxPropLen = properties[i].length;
                }
                keys.push(properties[i]);
                values[properties[i]] = obj.get(properties[i]);
            }
        }
        else{
            for (var k in obj.attributes){
                if ((ObjectProperties.EXCLUDE_KEYS[k]) || (!obj.attributes.hasOwnProperty(k))){ continue; }
                if (k.length > maxPropLen){
                    maxPropLen = k.length;
                }
                keys.push(k);
                values[k] = obj.get(k);
            }
            keys.sort();
        }
        var output = "";
        for (var i = 0; i < keys.length; i++){
            output += keys[i] + ": " + ObjectProperties.spaces(maxPropLen - keys[i].length) + values[keys[i]] + "\n";
        }
        ObjectProperties.write(output, who, "font-size: small; font-family: monospace", "OP");
    },

    setObjectProperties: function(who, obj, properties, values, relative){
        function numify(x){
            var xNum = x;
            if (typeof(x) == typeof("")){
                if (x.charAt(0) == "+"){ x = x.substring(1); }
                xNum = parseFloat(x);
            }
            if ("" + xNum == "" + x){ return xNum; }
            return x;
        }
        var output = "", updateAttrs = {};
        for (var i = 0; i < properties.length; i++){
            if ((!properties[i]) || (ObjectProperties.EXCLUDE_KEYS[properties[i]])){ continue; }
            var newVal = numify(values[i]), curVal = numify(obj.get(properties[i]));
            if (relative){
                newVal = curVal + newVal;
            }

            if (properties[i] === "imgsrc") {
                curVal = ObjectProperties.getCleanImgsrc(curVal);
                newVal = ObjectProperties.getCleanImgsrc(newVal);
                log("newVal=" + newVal);
            }

            output += properties[i] + ":\n";
            output += "  old: " + curVal + "\n";
            output += "  new: " + newVal + "\n";
            updateAttrs[properties[i]] = newVal;
        }
        obj.set(updateAttrs);
        ObjectProperties.write(output, who, "font-size: small; font-family: monospace", "OP");
    },

    placeTokens: function(object, name, normal, elite) {
        function numify (x) {
            var xNum = x;
            if (typeof(x) == typeof("")) {
                if (x.charAt(0) == "+"){
                    x = x.substring(1);
                }
                xNum = parseFloat(x);
            }
            if ("" + xNum == "" + x){
                return xNum;
            }
            return x;
        }
        var monster = GloomhavenMonsterStats["monsters"][name];

        if (!monster["imgsrc"]) {
            log("Gloomhaven: Monster not defined: " + name);
            return;
        }

        createObj("graphic", {
            name: name,
            imgsrc: monster["imgsrc"].elite,
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: object.get("top") - 40,
            left: object.get("left") - 209,
            width: 70,
            height: 70,
            bar3_value: elite,
            bar3_max: elite
        });

        createObj("graphic", {
            name: name,
            imgsrc: monster["imgsrc"].normal,
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: object.get("top") + 40,
            left: object.get("left") - 209,
            width: 70,
            height: 70,
            bar3_value: normal,
            bar3_max: normal
        });

        return;
    },

    placeCenterStat: function(object, imgsrc, top, normal, elite) {
        function numify (x) {
            var xNum = x;
            if (typeof(x) == typeof("")) {
                if (x.charAt(0) == "+"){
                    x = x.substring(1);
                }
                xNum = parseFloat(x);
            }
            if ("" + xNum == "" + x){
                return xNum;
            }
            return x;
        }

        createObj("graphic", {
            imgsrc: imgsrc,
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: numify(object.get("top")) + top,
            left: numify(object.get("left")) + 0,
            width: 20,
            height: 20,
            color: "rgb(255, 255, 255)"
        });

        createObj("text", {
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: numify(object.get("top")) + top,
            left: numify(object.get("left")) - 50,
            color: "rgb(255, 255, 255)",
            text: normal.toString(),
            font_size: 26,
            font_family: "Contrail"
        });

        createObj("text", {
            pageid: object.get("pageid"),
            layer: object.get("layer"),
            controlledby: "all",
            top: numify(object.get("top")) + top,
            left: numify(object.get("left")) + 50,
            color: "rgb(255, 215, 0)",
            text: elite.toString(),
            font_size: 26,
            font_family: "Contrail"
        });

        return;
    },

    triggerGloomhavenActions: function(who, object, actions) {
        function numify (x) {
            var xNum = x;
            if (typeof(x) == typeof("")) {
                if (x.charAt(0) == "+"){
                    x = x.substring(1);
                }
                xNum = parseFloat(x);
            }
            if ("" + xNum == "" + x){
                return xNum;
            }
            return x;
        }

        if (actions[0] === "set-front") {
            ObjectProperties.FRONT_IMGSRC = ObjectProperties.getCleanImgsrc(obj.get("imgsrc"));
        } else if (actions[0] === "set-back") {
            ObjectProperties.BACK_IMGSRC = ObjectProperties.getCleanImgsrc(obj.get("imgsrc"));
        } else if (actions[0] === "set-level") {
            ObjectProperties.MONSTER_LEVEL = numify(actions[1]);
        } else if (actions[0] === "setup") {
            if (actions.length > 1) {
                name = actions[1];
            } else {
                name = object.get("name");
            }
            monster = GloomhavenMonsterStats.monsters[name].level[ObjectProperties.MONSTER_LEVEL];
            log("?????? monster=" + monster);
            log("?????? monster=" + monster["level"]);
            log("?????? top=" + object.get("top") + "  left=" + object.get("left"));

            // Name
            createObj("text", {
                pageid: object.get("pageid"),
                layer: object.get("layer"),
                controlledby: "all",
                top: numify(object.get("top")) - 83,
                left: numify(object.get("left")),
                color: "rgb(255, 255, 255)",
                text: name,
                font_size: 28,
                font_family: "Contrail"
            });

            // Initiative
            initiative = "--";
            createObj("text", {
                pageid: object.get("pageid"),
                layer: object.get("layer"),
                controlledby: "all",
                top: numify(object.get("top")) - 45,
                left: numify(object.get("left")) - 143,
                color: "rgb(255, 255, 255)",
                text: initiative.toString(),
                font_size: 28,
                font_family: "Contrail"
            });

            // Normal Health
            createObj("text", {
                pageid: object.get("pageid"),
                layer: object.get("layer"),
                controlledby: "all",
                top: numify(object.get("top")) + 10,
                left: numify(object.get("left")) - 135,
                color: "rgb(255, 255, 255)",
                text: "HP " + monster.normal.health,
                font_size: 26,
                font_family: "Contrail"
            });

            // Elite Health
            createObj("text", {
                pageid: object.get("pageid"),
                layer: object.get("layer"),
                controlledby: "all",
                top: numify(object.get("top")) + 60,
                left: numify(object.get("left")) - 135,
                color: "rgb(255, 215, 0)",
                text: "HP " + monster.elite.health,
                font_size: 26,
                font_family: "Contrail"
            });

            ObjectProperties.placeCenterStat(object, ObjectProperties.MOVE_IMGSRC, -20,
                                             monster.normal.attack, monster.elite.attack);
            ObjectProperties.placeCenterStat(object, ObjectProperties.ATTACK_IMGSRC, 30,
                                             monster.normal.attack, monster.elite.attack);
            ObjectProperties.placeCenterStat(object, ObjectProperties.RANGE_IMGSRC, 80,
                                             monster.normal.range, monster.elite.range);

            // gold = rgb(255,215,0)
            ObjectProperties.placeTokens(object, name, monster.normal.health, monster.elite.health);
        }
    },

    handleObjectPropertiesMessage: function(tokens, msg){
        var objects = [];
        var objArgs = {};
        var getObjArg = null, objArgFinal = false;
        var properties = [], values = [];
        var relative = false;
        for (var i = 1; i < tokens.length; i++){
            if (getObjArg){
                objArgs[getObjArg] = tokens[i];
                getObjArg = null;
                if (objArgFinal){
                    if ((objArgs['_type']) && (objArgs['_id'])){
                        var obj = getObj(objArgs['_type'], objArgs['_id']);
                        if (obj){ objects.push(obj); }
                    }
                    else{
                        var objs = findObjs(objArgs);
                        while (objs.length > 0){
                            objects.push(objs.shift());
                        }
                    }
                    for (var k in objArgs){
                        if ((objArgs.hasOwnProperty(k)) && (k != '_type')){
                            delete objArgs[k];
                        }
                    }
                    objArgFinal = false;
                }
                continue;
            }
            switch (tokens[i]){
            case "-t":
            case "--type":
                getObjArg = '_type';
                break;
            case "-i":
            case "--id":
                getObjArg = '_id';
                objArgFinal = true;
                break;
            case "-n":
            case "--name":
                getObjArg = 'name';
                objArgFinal = true;
                break;
            case "-r":
            case "--relative":
                relative = true;
                break;
            default:
                if ((tokens[0] == "!getprop") || (tokens[0] == "!setprop" && properties.length == values.length)){
                    if (ObjectProperties.EXCLUDE_KEYS[tokens[i]]){
                        ObjectProperties.write("Warning: Skipping special property " + tokens[i], msg.who, "", "OP");
                        properties.push(null);
                    }
                    else{
                        properties.push(tokens[i]);
                    }
                }
                else{
                    values.push(tokens[i]);
                }
            }
        }
        if (getObjArg){
            ObjectProperties.write("Expected argument for " + getObjArg, msg.who, "", "OP");
            return ObjectProperties.showHelp(msg.who);
        }

        // if no objects specified, look for selected objects
        if ((objects.length <= 0) && (msg.selected)){
            for (var i = 0; i < msg.selected.length; i++){
                var obj = getObj(msg.selected[i]._type, msg.selected[i]._id);
                if (obj){ objects.push(obj); }
            }
        }

        // if still no objects specified, error
        if (objects.length <= 0){
            ObjectProperties.write("No objects specified or selected", msg.who, "", "OP");
            return ObjectProperties.showHelp(msg.who);
        }

        if (tokens[0] == "!getprop"){
            for (var i = 0; i < objects.length; i++){
                ObjectProperties.rawWrite("<hr>", msg.who, "", "OP");
                ObjectProperties.displayObjectProperties(msg.who, objects[i], properties);
            }
            ObjectProperties.rawWrite("<hr>", msg.who, "", "OP");
        }
        else if (tokens[0] == "!setprop"){
            // !setprop; verify command has at least one property and same number of properties and values
            if (properties.length <= 0){
                ObjectProperties.write("Must specify at least one property to set", msg.who, "", "OP");
                return ObjectProperties.showHelp(msg.who);
            }
            if (properties.length != values.length){
                ObjectProperties.write("Must specify a value for each property to set", msg.who, "", "OP");
                return ObjectProperties.showHelp(msg.who);
            }
            for (var i = 0; i < objects.length; i++){
                ObjectProperties.rawWrite("<hr>", msg.who, "", "OP");
                ObjectProperties.setObjectProperties(msg.who, objects[i], properties, values, relative);
            }
            ObjectProperties.rawWrite("<hr>", msg.who, "", "OP");
        } else {
            for (var i = 0; i < objects.length; i++) {
                ObjectProperties.triggerGloomhavenActions(msg.who, objects[i], values);
            }
        }
    },

    handleChatMessage: function(msg){
        if ((msg.type !== "api") ||
            ((msg.content.indexOf("!GH ") !== 0) &&
             (msg.content.indexOf("!getprop") !== 0) &&
             (msg.content.indexOf("!setprop") !== 0))) {
            return;
        }

        return ObjectProperties.handleObjectPropertiesMessage(msg.content.split(" "), msg);
    },

    registerObjectProperties: function(){
        if ((typeof(Shell) != "undefined") && (Shell) && (Shell.registerCommand)){
            Shell.registerCommand("!getprop", "!getprop [options] [property]", "Get object properties", ObjectProperties.handleObjectPropertiesMessage);
            Shell.registerCommand("!setprop", "!setprop [options] property value", "Set object property", ObjectProperties.handleObjectPropertiesMessage);
            Shell.registerCommand("!GH", "!GH [options] command", "Gloomhaven command", ObjectProperties.handleGloomhavenMessage);
            if (Shell.rawWrite){
                ObjectProperties.rawWrite = Shell.rawWrite;
            }
            if (Shell.write){
                ObjectProperties.write = Shell.write;
            }
        }
        else{
            on("chat:message", ObjectProperties.handleChatMessage);
        }
    }
};

on("ready", function () {
    ObjectProperties.registerObjectProperties();
});
