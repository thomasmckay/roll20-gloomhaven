/* global Gloomhaven:true */
/* exported GloomhavenSetLevelCommand */

var GloomhavenSetLevelCommand = {
    scenarioLevel: 1,

    run: function(msg, args) {
        var level;
        if (args.length === 0) {
            var obj = getObj(msg.selected[0]._type, msg.selected[0]._id);
            if (obj !== undefined && obj.get("type") === "text" &&
                obj.get("text").startsWith("Level: ")) {
                level = obj.get("text").substring(7);
            }
        } else if (args.length === 1) {
            level = args[0];
        }

        if (level === undefined) {
            Gloomhaven.write("Usage: set-level $number OR selected text 'Level: '", msg.who, "", "GH set-level");
            return;
        }
        Gloomhaven.scenarioLevel = Gloomhaven.numify(level);
        Gloomhaven.write("set-level " + Gloomhaven.scenarioLevel, msg.who, "", "GH set-level");
    }
};
