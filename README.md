# roll20-gloomhaven
Roll20.net scripts to setup Gloomhaven tabletop scenarios and play

## !GH build-deck

To easily create custom card decks, follow these steps.

First, create a page dedicated to your deck. All *graphic* objects on the page will be considered during deck building. (*Note:* This means you can add *text* or other object types to the page if desired for readability or other reasons.)

Next, create the card deck back by placing an image token on the page. This image will be used when the deck is shown through *roll20.net*. In addition, both the name attribute of the token as well as the size are used during deck creation and play.

The *name* attribute will be used to find an existing deck to update, or the name of a new deck to create. (*Note:* To quickly make multiple decks consisting of the same cards, simply change the *name* and re-run the *build-deck* command.)

The *size* of the image token will determine the size of the cards when played. This deck attribute, along with other standard deck options, may be edited after creation normally; it is there for convenience.

All other graphic objects on the page without the *name* attribute equal to the deck name will be used as the cards in the deck. (*Note:* Since running *build-deck* updates existing decks, adding or removing cards during game play is simply a matter of changing the images on the page.)

![Card deck page](/documentation/build-deck.png)
