# Overview
A box element in which cards can be cycled independently of order with a variety of different transitions

# Usage

    <x-deck>
        <x-card>Lorem ipsum</x-card>
        
        <x-card><img src="http://placekitten.com/300"/></x-card>
        
        <x-card><button>Hello!</button></x-card>
    </x-deck>
    
Indicates that the browser should render a deck box with three cards: one with
the text "Lorem ipsum", one with an image, and one with a button.

Note that `<x-card>` elements can contain any kind of html markup!

# Attributes

## ___transition-type___ / ___transitionType___

Defines the type of animation to use for cycling between cards. The default is 
no transition animation - cars are switched instantaneously.

This property can either be set as an HTML attribute under the name `transition-type`, or
programmatically with the property `transitionType`

Valid options:

* [slide-left](demo/transition_type_gifs/scrollLeft.gif)
* [slide-up](demo/transition_type_gifs/scrollUp.gif)
* [slide-right](demo/transition_type_gifs/scrollRight.gif)
* [slide-down](demo/transition_type_gifs/scrollDown.gif)
* [fade-scale](demo/transition_type_gifs/coverLeft.gif)

## ___selected-index___ / ___selectedIndex___

Gets/sets the index of the currently selected card in the deck

Can either be set as an HTML attribute under the name `selected-index` or
programmatically with the property `selectedIndex`

## ___loop___ (boolean)

Toggle allowance of looping when calling nextCard and previousCard methods has 
reached the end of either side of the index.

# Accessors

## ___cards___ (getter only)

Returns an array of all the x-card elements contained in an x-deck


## ___selectedCard___ (getter only)

Returns the x-card DOM element that is currently displayed by the deck. Returns null if no such card exists.

# Methods

## ___showCard___(index||element, [direction])

Transitions to the x-card at the given index within the deck. 

If given a direction of 'forward', will perform the forwards/normal version of the current transition animation. 
If given 'reverse', will performs the reverse animation. 
If the direction is omitted, the deck will perform a forward animation.

## ___hideCard___(index||element)

Hides the card element or card located at a specified index.

## ___nextCard___([direction])

Transitions to the next card in the deck, looping back to the start if needed.

## ___previousCard___([direction])

Transitions to the previous card in the deck, looping back to the end if needed.

# Events

## ___show___

Fired from a card target after it has completed its show animation, and the show state has been finalized.

## ___hide___

Fired from a card target after it has completed its hide animation, and the hide state has been finalized.

# Styling

Because `<x-deck>` and `<x-card>` elements are just regular DOM elements,
you can style them as normal.

However, decks also add some extra selectors, allowing you to fine tune how cards
appear during animations. (The following examples use the same html structure as the usage example.)

* Styles applied to `x-deck > x-card[selected]` are only applied to the currently visible card in the deck.
* Styles applied to `x-deck > x-card[hide]` define how a card looks when in the middle of transitioning out of view
    - For example, if you wanted cards to be faded when leaving the deck's viewport, you could apply the following style:
            
            x-deck > x-card[hide]{
                opacity: 0.7;
            }


# Misc

## Adding/removing cards

To add and remove cards, you don't need any special x-deck specific methods. You can simply appendChild and removeChild &lt;x-card&gt;
elements to the &lt;x-deck&gt; as you would any other DOM element.
