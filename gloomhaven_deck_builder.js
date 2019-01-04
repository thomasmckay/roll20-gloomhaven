/* global Gloomhaven:true */
/* exported GloomhavenDeckBuilderCommand */
var GloomhavenDeckBuilderCommand = {
    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    run: function(msg, args) {

        var _getDeckName = function(args) {
            if (args.length < 2) {
                return;
            }
            return(args.slice(1).join(" "));
        };

        var _getDeck = function(msg, deckName) {
            var deck = findObjs({type: "deck", name: deckName});
            if (deck.length !== 0) {
                deck = deck[0];
            }
            return(deck);
        };

        var _addCard = function(msg, args) {
            var deckName = _getDeckName(args);
            if (!deckName) {
                Gloomhaven.write("Usage: build-deck add-card $DECK-NAME WITH selected card to add", msg.who, "", "GH build-deck");
                return;
            }
            if (!msg.selected) {
                Gloomhaven.write("Usage: build-deck add-card $DECK-NAME WITH selected card to add", msg.who, "", "GH build-deck");
                return;
            }

            var card = getObj(msg.selected[0]._type, msg.selected[0]._id);
            var deck = _getDeck(msg, deckName);
            createObj("card", {
                _deckid: deck.get("id"),
                name: card.get("name"),
                avatar: card.get("imgsrc")
            });
            Gloomhaven.write(Gloomhaven.sprintf("Deck '%s' updated with new card", deckName),
                             msg.who, "", "GH build-deck");
        };

        var _removeCard = function(msg, args) {
        };

        var _updateDeck = function(msg, args) {
            var i;

            if (!msg.selected) {
                Gloomhaven.write("Usage: build-deck WITH selected card backing", msg.who, "", "GH build-deck");
                return;
            }
            var backing = getObj(msg.selected[0]._type, msg.selected[0]._id);
            var deckName = backing.get("name");

            var deck = _getDeck(deckName);
            if (!deck) {
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
                avatar: Gloomhaven.getCleanImgsrc(backing.get("imgsrc")),
                defaultheight: backing.get("height"),
                defaultwidth: backing.get("width")
            });

            // Add all the cards back to deck
            var allObjects = findObjs({ _pageid: backing.get("pageid"), type: "graphic"});
            var cardCount = 0;
            for (i = 0; i < allObjects.length; i++) {
                var card = allObjects[i];
                // Don't add the backing card or "dead" cards
                if (card.get("name") !== backing.get("name") && card.get("statusmarkers") !== "dead") {
                    createObj("card", {
                        _deckid: deck.get("id"),
                        name: card.get("name"),
                        avatar: card.get("imgsrc")
                    });
                    cardCount++;
                }
            }
            Gloomhaven.write(Gloomhaven.sprintf("Deck '%s' updated with %s cards", deckName, cardCount),
                             msg.who, "", "GH build-deck");
        };


        if (args[0] == "add-card") {
            _addCard(msg, args);
        } else if (args[0] == "remove-card") {
            _removeCard(msg, args);
        } else {
            _updateDeck(msg, args);
        }

        /*
        var i, deckName, object, pageid, card;
        var addCard;

        if (args[0] == "add-card") {
        } else {
            addCard = false;

            if (!msg.selected) {
                Gloomhaven.write("Usage: build-deck WITH selected card backing", msg.who, "", "GH build-deck");
                return;
            }

            object = getObj(msg.selected[0]._type, msg.selected[0]._id);
            pageid = object.get("pageid");
            deckName = object.get("name");
        }

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

        if (addCard == false) {
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
            var cardCount = 0;
            for (i = 0; i < allObjects.length; i++) {
                card = allObjects[i];
                // Don't add the backing card or "dead" cards
                if (card.get("name") !== object.get("name") && card.get("statusmarkers") !== "dead") {
                    createObj("card", {
                        _deckid: deck.get("id"),
                        name: card.get("name"),
                        avatar: card.get("imgsrc")
                    });
                    cardCount++;
                }
            }

            Gloomhaven.write(Gloomhaven.sprintf("Deck '%s' updated with %s cards", deckName, cardCount),
                             msg.who, "", "GH build-deck");
        } else {
            createObj("card", {
                _deckid: deck.get("id"),
                name: card.get("name"),
                avatar: card.get("imgsrc")
            });
            Gloomhaven.write(Gloomhaven.sprintf("Deck '%s' updated with new card", deckName),
                             msg.who, "", "GH build-deck");
        }
        */
    }
};
