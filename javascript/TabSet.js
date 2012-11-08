(function($){
	$.entwine('ss', function($){
		/**
		 * Lightweight wrapper around jQuery UI tabs.
		 */
		$('.ss-tabset').entwine({
			onadd: function() {
				// Can't name redraw() as it clashes with other CMS entwine classes
				this.redrawTabs();
				this._super();
			},
			onremove: function() {
				if(this.data('uiTabs')) this.tabs('destroy');
				this._super();
			},
			redrawTabs: function() {
				this.rewriteHashlinks();
				this.tabs();
				
				if(this.hasClass('ss-ui-action-tabset')){
					this.tabs(
						'option', 
						'collapsible',
						true					
					).tabs('select', false);					
					if(this.hasClass('ss-ui-action-tabset')){
						this.tabs({
							beforeActivate:function(event, ui){
								var activePanel = ui.newPanel;
								var activeTab = ui.newTab;
								if($(activeTab).hasClass("last")){
									$(activePanel).attr("style","left : auto; right: "+ 0 +"px");
								}else{
									$(activePanel).attr("style","left: "+activeTab.position().left+"px");									
								}								
							}					
						});	
					}
				}
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
