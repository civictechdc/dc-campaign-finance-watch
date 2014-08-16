## Install

*Requirements*

Node / NPM

Bower (Package Manager)

```
npm install bower -g
```

Inside your project run:

```
bower install x-tag-switch
```

This downloads the component and dependencies to ./components


## Syntax

Switch provides you a slick iPhone-esque toggle switch with a single line

```
	<x-switch onText="Active" offText="Inactive"></x-switch>
```

## Usage

```
	var mySwitch = document.createElement('x-switch');
	mySwitch.toggle(); // toggles the checked property and visual appearance
	mySwitch.checked = true;
```


