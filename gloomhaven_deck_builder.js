var TestObject = {
    rawWrite: function(s, who, style, from) {
        if (who){
            who = "/w " + who.split(" ", 1)[0] + " ";
        }
        sendChat(from, who + s.replace(/\n/g, "<br>"));
    },

    write: function(s, who, style, from) {
        return TestObject.rawWrite(s.replace(/</g, "<").replace(/>/g, ">"), who, style, from);
    },

    getCleanImgsrc: function (imgsrc) {
        var parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    },

    handleObjectPropertiesMessage: function(tokens, msg){
        TestObject.rawWrite("<hr>", msg.who, "", "TESTING");
        //log("##### " + DECKS["Bandit Archer"].name);

        if (msg.selected) {
            var object = getObj(msg.selected[0]._type, msg.selected[0]._id);
            var pageid = object.get("pageid");
            var deckName = object.get("name");
            var decks = findObjs({type: "deck"});

            var deck = findObjs({type: "deck", name: deckName});
            deck = deck[0];

            // Remove all the current cards from deck
            var cards = findObjs({_deckid: deck.get("id")});
            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                card.remove();
            }

            // Set the deck backing image from the selected image
            ObjectProperties.rawWrite("<i>", msg.who, "", "avatar = " + object.get("imgsrc"));
            deck.set({
                avatar: TestObject.getCleanImgsrc(object.get("imgsrc")),
                defaultheight: object.get("height"),
                defaultwidth: object.get("width")
            });

            // Add all the cards back to deck
            var allObjects = findObjs({ _pageid: pageid, type: "graphic"});
            ObjectProperties.rawWrite("<i>", msg.who, "", "allObjects=" + allObjects.length);
            for (var i = 0; i < allObjects.length; i++) {
                var card = allObjects[i];
                // Don't add the backing card
                if (card.get("name") !== object.get("name")) {
                    ObjectProperties.rawWrite("<i>", msg.who, "", "object=" + card.get("type"));
                    createObj("card", {
                        _deckid: deck.get("id"),
                        name: card.get("name"),
                        avatar: card.get("imgsrc")
                    })
                }
            }
        }
    },

    handleChatMessage: function(msg){
        if ((msg.type !== "api") ||
            (msg.content.indexOf("!GHtest") !== 0)) {
            return;
        }

        return TestObject.handleObjectPropertiesMessage(msg.content.split(" "), msg);
    },

    registerObjectProperties: function(){
        if ((typeof(Shell) != "undefined") && (Shell) && (Shell.registerCommand)){
            Shell.registerCommand("!GHtest", "!GHtest [options] command", "Gloomhaven command", ObjectProperties.handleGloomhavenMessage);
            if (Shell.rawWrite){
                TestObject.rawWrite = Shell.rawWrite;
            }
            if (Shell.write){
                TestObject.write = Shell.write;
            }
        }
        else{
            on("chat:message", TestObject.handleChatMessage);
        }
    }
};

on("ready", function () {
    TestObject.registerObjectProperties();
});
