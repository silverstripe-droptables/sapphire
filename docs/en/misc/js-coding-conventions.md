# JS Coding Conventions

## Overview

This document summarises the low-level coding conventions recommended for core SilverStripe JS programming. 

All of these guidelines are strongly advised for any new code checked into the version control. Some of these will be
enforced via automated testing suites (e.g. line length by Travis).

## File Formatting

### Indentation and Spacing

Use single tab for each level of indentation.

Avoid mixing tabs and spaces.

It is recommended that lines with nothing on them should have no whitespace and that there should be no whitespace at
the end of a line.

	:::js
	// For the purpose of this example, tab is denoted by '____', space with '.'.

	// Good.
	var.good.=.true;

	// Bad.
	____
	var..bad____..=true;...____
	....

As a rule of thumb, use spacing liberally for enhancing readability and for grouping related code. Consequently, use
whitespace for splitting unrelated code.

### Semicolons

Semicolons should always be used to prevent semicolon insertion changing the intended meaning of code (see [Google
JavaScript Style
Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=Semicolons#Semicolons) for more
in-depth explanation.

### Maximum Line Length

The bulk of the code should be under 80 characters wide. The maximum length of any line of code should be no more than
120 characters.

### Line Termination

Code files should use Unix line termination format - lines should end with a single linefeed (LF) character (0x0A).

## Comments

We recommend adhering to the advice from [Crockford](http://javascript.crockford.com/code.html) on writing good
comments, quoted below.

"Be generous with comments. It is useful to leave information that will be read at a later time by people (possibly
yourself) who will need to understand what you have done. The comments should be well-written and clear, just like the
code they are annotating. An occasional nugget of humor might be appreciated. Frustrations and resentments will not.

"It is important that comments be kept up-to-date. Erroneous comments can make programs even harder to read and
understand.

"Make comments meaningful. Focus on what is not immediately visible. Don't waste the reader's time with stuff like `i =
0; // Set i to zero.`"

### Formal Comments

Formal comments should be added before most functions, event handlers, entwine methods and entwine properties and should
generally follow the
[JSDoc](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=Comments#Comments) format:

	:::js
	/**
	 * Resizes the window to fit the panel.
	 *
	 * @param {Object} panel Panel DOM element.
	 * @param {number} minWidth Minimum window width.
	 * @return {number} The new width of the window.
	 */
	 function resizeWindow(panel, minWidth) {
		...

		return newWidth;
	 }

### Inline Comments

Any other comments should use `//`, even if the comment spans several lines. They should immediately precede the
code block being commented and should be written using full sentences - starting with upper case letter and ending
with full stop (or other diacritic mark).

A blank line is preferred before the inline comment.

	:::js
	var maxSize = 1000;

	// Resize the panel to fit the window, while keeping a reasonable maximum.
	// (notice empty line above).
	if (size < maxSize) {
	...

### Trailing Comments

Trailing comments should generally be avoided as they can be overlooked easily, and they force unnecessary conciseness.
Acceptable exception is when commenting a variable declaration block.

	:::js
	// Good.

	// Store the original object's state so we can rebuild the layout later.
	var origParentLayoutApplied = (typeof origParent.data('jlayout')!=='undefined');

	// Bad.
	var origParentLayoutApplied = (typeof origParent.data('jlayout')!=='undefined'); // Original layout flag.

	// Acceptable.
	var foo = 1, // Initial baseline.
		bar = 2, // Maximum coefficient.
		zap = 3; // Minimum factor.

### Section Separator

For long files (if breaking the file up is not pracitcal) we recommend using a following section separator if one is
needed:

	:::js
	/********************************************************************************
	 * 80 Stars top and bottom.
	 * Can have multiple lines too.
	 ********************************************************************************/

## Naming Conventions

Names should be constructed from the upper and lowercase latin alphabet (A..Z, a..z), digits (0..9) and `_`.

Use of `_` as the first character of a name should be avoided unless otherwise requested by this guidelines. We reserve
it for special purposes (as Entwine already does with `_super`).

Names should be descriptive, which also means they should in most cases be at least 3 characters.

	:::
	// Bad.
	var grep = function(a, f) {
		var o = [];

		mce.each(a, function(v) {
			if (!f || f(v))
				o.push(v);
		});

		return o;
	},

	// Good.
	var each = function(inputArray, filterFunction) {
		var outputArray = [];

		tinymce.each(inputArray, function(element) {
			if (!filterFunction || filterFunction(element)) {
				outputArray.push(element);
			}
		}

		return outputArray;
	}

It is not necessary to prefix jQuery variables with `$`.

	:::js
	// Good.
	var element = $('.element');

	// Bad.
	var $element = $('.element');

### Variables and Functions

Variables and functions should be all named with `lowerCamelCase`. 

	:::js
	$('.element').entwine({
		someMethod: function() {
			var someVariable;
		}
	});

### Entwine Properties

Entwine properties should use `UpperCamelCase`:

	$('.element').entwine({
		EntwineProperty: 'some'
	});

### Event Names and Handlers

Event names, and consequently event handler names, should use `alllowercase`.

	$('.element').entwine({
		onaftersubmitform: function() {
			// ...
		}
	});

### this in Closure

The variable used to access outer `this` from within a closure should be named `self`.

	var outer = function() {
		var self = this;

		var inner = function() {
			alert(self);
		}
	}

### Pseudo-constant Variables

If variable is intended to be used as a constant, it should be named with `ALL_UPPER_CASE`.

	:::js
	$('.element').entwine({
		var CODE_FOR_FATAL_ERROR = 7;
	});

## Coding Style

### Variable Declarations

All variables should be declared before they are used. Implied global variables should be avoided as these usually
mean programmer has made a mistake.

	:::js
	function() {
		var good = true;

		// Undeclared variable leaks into global scope.
		bad = true;
	}

Assignments in declaration blocks should always be on their own line, indented with one tab. As an exception, the
declarations that don't have an assignment can be listed together at the start of the declaration. For example:

	:::js
	// Good.
	var a, b, c,
		foo = true,
		bar = false;

	// Bad.
	var a, foo = true, c,
		d;

### Curly Braces

Because of implicit semicolon insertion, always start your curly braces on the same line as whatever they're opening.

	if (foo === 1) {
		// ...
	} else {
		// ...
	}

### Equality

Strict equality checks (`===` and `!==`) should be used in favor of `==` and `!=` to avoid type coercion problems.

### Type Checks

For type checking the following conditionals should be used (from [jQuery Core Style
Guidelines](http://docs.jquery.com/JQuery_Core_Style_Guidelines)):

* String: `typeof object === "string"`
* Number: `typeof object === "number"`
* Boolean: `typeof object === "boolean"`
* Object: `typeof object === "object"`
* Plain Object: `jQuery.isPlainObject(object)`
* Function: `jQuery.isFunction(object)`
* Array: `jQuery.isArray(object)`
* Element: `object.nodeType`
* null: `object === null`
* null or undefined: `object == null`
* undefined:
  * Global Variables: `typeof variable === "undefined"`
  * Local Variables: `variable === undefined`
  * Properties: `object.prop === undefined`

### Strings

Prefer `'` over `"`.

#### String Concatentation

Strings should be concatenated using the `+` operator. A space should always be added before and after the `+` operator
to improve readability:

	:::js
	var string = 'Current date is ' + date + '!';

#### Multiline Strings

It is encouraged to break the long strings into multiple lines to improve readability using the concatenation operator.
Subsequent lines should be indented by one tab to allow easy manipulation later.

	:::js
	// Good.
	var string = 'Are you sure to quit the application?' +
		+ 'This will destroy all your unsaved changes.';

	// Bad.
	var string = 'Are you sure to quit the application? \
				 This will destroy all your unsaved changes.';


### [] and {}

Use `[]` for Array instantiation and `{}` for Object instantiation.

Avoid using Arrays for associative data structures.

Prefer the multiline version of the object/array definition if the property list is longer than 3 elements, or if the
property names are long and hard to read inline.

	:::js
	// Good: still somewhat readable.
	var enum = {one: 1, two: 2, three: 3};

	// Good.
	var xhr = $.ajax({
		headers: headers,
		url: state.url
	});

	// Bad: hard to read.
	self.trigger('afterstatechange', {data: data, status: status, xhr: xhr, element: els});

### Long Method Chains

Long method chains should be broken into multiple lines after the initial invocation. Each new line should start with a
dot, should be indented with at least one tab, and contain only one method invocation (avoid mixing styles).

	:::js
	// Godd: short and still readable.
	this.find('.cms-panel-layout').redraw();

	// Bad: arbitrary and inconsistent line break.
	this.find('select').val(mode)
		.trigger('liszt:updated')._addIcon().show();

	// Good.
	this.find('select')
		.val(mode)
		.trigger('liszt:updated')
		._addIcon()
		.show();

### Object Properties

#### Property Definition

Prefer omitting `'` in object property definitions.

	:::js
	$('.element').entwine({
		// Good.
		resize: function() {},

		// Bad.
		'resize': function() {},

		// Necessary because of space and a dot.
		'from .otherElement': function() {}
	});

#### Property Access

Prefer dot notation over bracket notation when accessing properties.

	:::js
	// Good.
	var length = this.length;

	// Bad.
	var length = this['length'];

	// Necessary for parameter unrolling.
	var property = 'length';
	var length = this[property];

### Function Declaration

Function declaration should not have spaces directly before or after the opening parathesis, as well as no space before
the closing parenthesis.  There should be one space after the closing parenthesis. The opening brace should be kept on
the same line as the statement. 

	:::js
	// Good.
	function foo(arg1, arg2) {
		// ...	
	}

	// Bad.
	function foo ( arg1, arg2 )
	{
		// ...
	}

Avoid single-line functions.

	// Bad.
	function foo() { return 'bar'; }

In cases where the argument list exceeds the maximum line length, line breaks should be introduced.  Additional
arguments to the function or method should be indented one additional level beyond the function or method declaration.

A line break should then occur before the closing argument paren, which should then be placed on the same line as the
opening brace of the function or method with one space separating the two, and at the same indentation level as the
function or method declaration. 

	:::js
	function bar(arg1, arg2, arg3,
		arg4, arg5, arg6
	) {
		// indented code
	}

Function and method arguments should be separated by a single trailing space after the comma delimiter, apart from the
last argument.

#### Anonymous Functions

Anonymous functions should have no space before the argument list.

	:::js
	var bar = function(arg1, arg2) {
		// ...
	};

Naming anonymous functions for better stack traces can be considered.

	:::js
	var bar = function bar(arg1, arg2) {
		// ...
	};

#### Immediate Function Execution

Where the function is immediately invoked after being declared, function and the invocation should both be wrapped
in parens.

	:::js
	(function($) {
		// ...
	}(jQuery));

### Eval

Avoid `eval`, unless deserialising.

### with

Avoid `with`.

### Operator Precedence

Generally avoid relying on implied operator precedence. Make order obvious.

	:::js
	// Bad.
	if (foo & bar * zap) {}

	// Good.
	if ((foo & bar) * zap) {}

### Control Structures

#### Conditional Structures

No control structure is allowed to have spaces after the opening parathesis, as well as no space before the closing
parenthesis.

The opening brace and closing brace are written on the same line as the conditional statement.  Any content within the
braces should be indented using one tab.

	:::js
	if (foo !== 1) {
		// ...
	}

If the conditional statement causes the line length to exceed the maximum line length and has several clauses, you may
break the conditional into multiple lines. Break the line prior to a logic operator, indent the line with one tab only
and close the paren in the subsequent line so the conditional logic block is clearl visible.

	:::js
	if ((foo === 1 && bar === 2)
		|| (zap !== 3 && baz !== 8)
	) {
		// ...
	}

`else if` and `else` should all be rolled into one line, including both brackets.

	:::js
	if (foo === 2) {
		bar = 2;
	} else if (foo === 3) {
		bar = 4;
	} else {
		bar = 7;
	}

`else if` can also be broken into multiple lines for readability, although refactoring of the conditional logic should
 be considered in this case. 

	:::js
	if (foo === 2) {
		bar = 2;
	} else if ((foo === 1 && bar === 2)
		|| (zap !== 3 && baz !== 8)
	) {
		bar = 6;
	}

#### Single-line Conditional Statements

Statements with `if` can be written without curly braces on a single line as the block, as long as no `else` statement
exists.

	:::js
	// Good.
	if (foo === 1) doThis();
	
	// Bad.
	if(foo === 1) doThis();
	else doThat();

#### switch

All content within the `switch` statement should be indented using one tab. Content under each `case` statement should
be indented using an additional tab and should include `break`, `return`, or `throw`. The construct `default` should
always be included.

	:::js
	switch(numPeople) {
		case 1:
			alert('A person.');
			break;
		case 2:
			alert('A couple.');
			break;
		default:
			alert('A crowd.');
			break;
	}

Fall-through is permitted if the `case` statements involved have no accompanying statements. Otherwise it should be
avoided.

	:::js
	// Good.
	switch(numPeople) {
		case 1:
		case 2:
		case 3:
			alert('Up to three people.');
			break;
		default:
			alert('A lot of people!');
			break;
	}

	// Bad.
	var count = 0;
	switch(numPeople) {
		case 1:
			count = 1;
		case 2:
			count = 7;
		case 3:
			count = 13;
		default:
			// Confused.
			alert(count);
	}

#### Loop Structures

Formatting generally follows the advice for conditional structures.

	:::js
	var i;
    for (i = 1; i<10; i++) {
		// ...
    }

    for (variable in object) {
		// ...
    }

	while (test !== false) {
		// ...
	} 

	do {
		// ...
	} while (test !== false);

The `for .. in` form should be used when iterating over Object's properties. It is recommended to filter for Object's true
properties to avoid pulling in prototype's properties.

	:::js
    for (variable in object) {
        if (object.hasOwnProperty(variable)) {
			// ...
        }
	}

### Deviations

We recommend the reasons for deviations from this guidelines to be documented inline (e.g. if a change has been
introduced for performance reasons).

## References

* [jQuery coding style](http://docs.jquery.com/JQuery_Core_Style_Guidelines)
* [Google JavaScript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
* [Crockford](http://javascript.crockford.com/code.html)
* [Felix's Node.js Style Guide](http://nodeguide.com/style.html)
* [Airbnb JavaScript Style Guide](http://nerds.airbnb.com/our-javascript-style-guide)
* [Idiomatic.js](https://github.com/rwldrn/idiomatic.js/)
* [Dojo Style Guide](http://dojotoolkit.org/community/styleGuide)

