(function($){

	$.entwine('ss', function($){
		/**
		 * Lightweight wrapper around jQuery UI Menu.
		 */
		$('.ss-ui-menu').entwine({
			onadd: function() {
				// Can't name redraw() as it clashes with other CMS entwine classes
				this.redrawMenu();
				this._super();
			},
			onremove: function() {
				if(this.data('uiMenu')) this.menu('destroy');
				this._super();
			},

			onclick: function(){
				this.menu('expand');
				return false;
			},
			redrawMenu: function() {
				this.rewriteHashlinks();
				this.menu({
					icons:{
						submenu:"ui-no-icon"
					}, 
					position: {
						my: "left top+29", at: "left top"
					},
					menus: "div.ss-ui-action-menu"
				});
			},
		
			/**
			 * Ensure hash links are prefixed with the current page URL,
			 * otherwise jQuery interprets them as being external.
			 */
			rewriteHashlinks: function() {
				$(this).find('ul a').each(function() {
					var matches = $(this).attr('href').match(/#.*/);
					if(!matches) return;
					$(this).attr('href', document.location.href.replace(/#.*/, '') + matches[0]);
				});
			}
		});
	});
})(jQuery);
