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
					).tabs('select', false).tabs(
						"option", 
						"show", 
						{ effect: "slideDown", duration: 5000 }	
					);					
					if(this.hasClass('cms-actions-row')){
						var parent = this.parent().parent();
						$('#view-mode-batchactions').click(function(){
							$(this).parent('li').toggleClass('checked');
						});

						if($(parent).hasClass('cms-tree-view-sidebar')){							
							$('.ui-tabs-nav li').hover(function(){								
								$(this).parent().find('li .active').removeClass('active');
								$(this).find('a').addClass('active');															
							});

							this.tabs({
								beforeActivate:function(event, ui){
									var activePanel = ui.newPanel;
									$(activePanel).attr("style","left : auto; right: auto");																	
								}					
							});	



						}else{							
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
