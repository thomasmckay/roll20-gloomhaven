/* global Gloomhaven:true */
/* exported GloomhavenDeckBuilderCommand */
var GloomhavenDeckBuilderCommand = {

    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    run: function(msg, args) {
        var i;
        if (!msg.selected) {
            Gloomhaven.write("Usage: build-deck WITH selected card backing", msg.who, "", "GH build-deck");
            return;
        }

        var object = getObj(msg.selected[0]._type, msg.selected[0]._id);
        var pageid = object.get("pageid");
        var deckName = object.get("name");

        var deck = findObjs({type: "deck", name: deckName});
        if (deck.length === 1) {
            deck = deck[0];
        } else if (deck.length > 1) {
            Gloomhaven.write("Multiple decks named '" + deckName + "'", msg.who, "", "GH build-deck");
            return;
        } else {
            deck = createObj("deck", {
                name: deckName,
            });
        }

        // Remove all the current cards from deck
        var cards = findObjs({_deckid: deck.get("id")});
        for (i = 0; i < cards.length; i++) {
            cards[i].remove();
        }

        // Set the deck backing image from the selected image
        deck.set({
            avatar: Gloomhaven.getCleanImgsrc(object.get("imgsrc")),
            defaultheight: object.get("height"),
            defaultwidth: object.get("width")
        });

        // Add all the cards back to deck
        var allObjects = findObjs({ _pageid: pageid, type: "graphic"});
        for (i = 0; i < allObjects.length; i++) {
            var card = allObjects[i];
            // Don't add the backing card
            if (card.get("name") !== object.get("name")) {
                createObj("card", {
                    _deckid: deck.get("id"),
                    name: card.get("name"),
                    avatar: card.get("imgsrc")
                });
            }
        }

        Gloomhaven.write(Gloomhaven.sprintf("Deck '%s' updated with %s cards", deckName, allObjects.length - 1),
                         msg.who, "", "GH build-deck");
    }
};
