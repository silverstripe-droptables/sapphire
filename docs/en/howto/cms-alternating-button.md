# How to implement an alternating button #

## Introduction ##

*Save* and *Save & publish* buttons alternate their appearance to reflect the state of the underlying `SiteTree` object. This is based on a `ssui.button` extension available in `ssui.core.js`.

The button can be configured via the data attributes in the backend, or through jQuery UI initialisation options. The state can be toggled from the backend (again through data attributes), and can also be easily toggled or set on the frontend.

This how-to will walk you through creation of a "Clean-up" button with two appearances:

* appears as "Clean-up now" green (constructive) button if the actions can be performed.
* appears as "Cleaned" default button if the action does not need to be done.

The controller code that goes with this example is listed in [Extend CMS Interface](../reference/extend-cms-interface).

## Backend support ##

First we create and configure the button with alternate state on a page type.

	:::php
	public function getCMSActions() {
		$fields = parent::getCMSActions();

		$fields->fieldByName('MajorActions')->push(
			$cleanupAction = FormAction::create('cleanup', 'Cleaned')
				// Set up an icon for the neutral state that will use the default text.
				->setAttribute('data-icon', 'accept')
				// Initialise the alternate constructive stat
				->setAttribute('data-icon-alternate', 'addpage')
				->setAttribute('data-text-alternate', 'Clean-up now')
		);

		return $fields;
	}

The button will default to the neutral state, but we will want to initialise into the alternate state in certain situations. Let's add a function to check for this.

	:::php
	/**
	 * Check if our page is dirty and needs some automated cleanup.
	 */
	public function needsCleaning() {
		return (strpos($this->Content, "...")!==false);
	}

We can now reflect the internal state of the page with the button appearance.

	:::php
	public function getCMSActions() {
		// ...
		if ($this->needsCleaning()) {
			// Will initialise the button into alternate state.
			$cleanupAction->addExtraClass('ss-ui-alternate');
		}
		// ...
	}
 
## Frontend support ##

As with the *Save* and *Save & publish* buttons, we might want to add some scripted reactions to user actions on the frontend. We can affect the state of the button using the jQuery UI framework.

First of all, we can toggle the state of the button to the opposite - you can just put this into the console of the browser to see how it works.

	:::js
	jQuery('.cms-edit-form .Actions #Form_EditForm_action_cleanup').button('toggleAlternate');

Another, more useful, scenario is to check the current state.

	:::js
	jQuery('.cms-edit-form .Actions #Form_EditForm_action_cleanup').button('option', 'showingAlternate');

We can also force the button into a specific state by using UI options.

	:::js
	jQuery('.cms-edit-form .Actions #Form_EditForm_action_cleanup').button({showingAlternate: true});

This will allow you to react to user actions in the CMS and give immediate feedback. Here is an example for the *Save* button taken from the CMS core that tracks the changes to the input fields and reacts by enabling the button (changetracker will automatically add `changed` class to the form if a modification is detected).

	:::js
	/**
	 * Enable save buttons upon detecting changes to content.
	 * "changed" class is added by jQuery.changetracker.
	 */
	$('.cms-edit-form .changed').entwine({
		onmatch: function(e) {
			var form = this.closest('.cms-edit-form');
			form.find('#Form_EditForm_action_save').button({showingAlternate: true});
			form.find('#Form_EditForm_action_publish').button({showingAlternate: true});
			this._super(e);
		},
		onunmatch: function(e) {
			this._super(e);
		}
	});

## Frontend hooks ##

`ssui.button` defines additional hooks so we can react to the button state changes. This is for example used in the CMS to style the alternate state of the buttons. Three hooks are available:

* `ontogglealternate`: invoked when the `toggleAlternate` is called. Return `false` to prevent the toggling.
* `beforerefreshalternate`: invoked before the alternate-specific rendering takes place, including the button initialisation.
* `afterrefreshalternate`: invoked after the rendering has been done, including on init. Good place to add styling extras.

Continuing our simple example, let's add a constructive styling to our *Clean-up* button. First we need to be able to add custom JS code into the CMS. We do this by adding a new source file, here `mysite/javascript/CMSMain.CustomActionsExtension.js` and requiring it from the config.

	:::ss
	LeftAndMain::require_javascript('mysite/javascript/CMSMain.CustomActionsExtension.js');

We can now add the styling in response to `afterrefreshalternate` event. We use entwine to avoid accidental memory leaks. The entwine handle is constructed as follows:

* `on` signifies entiwne event handler.
* `button` is jQuery UI widget name.
* `afterrefreshalternate`: the event from ssui.button to react to.

Here is the entire handler put together. You don't need to add a separate initialisation code, this will handle all cases.

	:::js
	(function($) {

		$.entwine('mysite', function($){
			$('.cms-edit-form .Actions #Form_EditForm_action_cleanup').entwine({
				/**
				 * onafterrefreshalternate is SS-specific jQuery UI hook that is executed
				 * every time the button is rendered (including on initialisation).
				 */
				onbuttonafterrefreshalternate: function() {
					if (this.button('option', 'showingAlternate')) {
						this.addClass('ss-ui-action-constructive');
					}
					else {
						this.removeClass('ss-ui-action-constructive');
					}
				}
			});
		});

	}(jQuery));

## Summary ##

The code presented here gives you a fully functioning alternating button, similar to the default ones that come with the the CMS. They can be used to give user the advantage of visual feedback on his actions in the CMS.
