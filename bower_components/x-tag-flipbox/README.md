# Overview
A flipbox acts as an element that can flip between two sides of content, much like a playing card.

# Usage

    <x-flipbox>
        <div>I'm the front face.</div>
        <div>I'm the back face.</div>
    </x-flipbox>

An `<x-flipbox>` should contain only two direct children elements, each of which can contain any markup.

The first child element will be considered the front face of the flipbox.

The last child element will be considered the back face of the flipbox.

# Attributes

## ___flipped___

A boolean attribute whose prescence indicates that the flipbox should display its back face.

Can also be accessed through the `.flipped` JavaScript property of the flipbox.

## ___direction___

Indicates which direction the flipping animation should turn in.

Valid options are `right`, `left`, `up`, and `down`. If not set, this defaults to `right`.

# Methods

## ___toggle()___

Flips the card to its opposite face.

## ___showFront()___

Forces the flipbox to display its front face.

## ___showBack()___

Forces the flipbox to display its back face.

# Events

## ___flipend___

The `<x-flipbox>` fires a `flipend` whenever it fully finishes a flipping animation. This will not fire if the flipping animation is interrupted before completion.

##: ___show___

If either the front face or the back face of the flipbox receives a `show` event, the flipbox will automatically show that side.

X-flipbox does not fire this event.

# Styling

- To style the front face of the flipbox, apply styles to `x-flipbox > *:first-child`
- To style the back face of the flipbox, apply styles to `x-flipbox > *:last-child`