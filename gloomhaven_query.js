/* global Gloomhaven:true */
/* exported GloomhavenQueryCommand */

var GloomhavenQueryCommand = {
    run: function(msg, args) {
        var value;
        var obj = getObj(msg.selected[0]._type, msg.selected[0]._id);
        if (args.length === 0 || obj === undefined) {
            Gloomhaven.write("Usage: query $property WITH selected object", msg.who, "", "GH query");
            return;
        }

        value = obj.get(args[1]);

        Gloomhaven.write(Gloomhaven.sprintf("Property: '%s' = '%s'", args[0], value), msg.who, "", "GH query");
    }
};
