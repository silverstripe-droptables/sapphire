(function($){
	$.entwine('ss.ActionTabSet', function($){
		/**
		 * Special rules for ss-ui-action-tabset, used for: 
		 * * Site tree action tabs (to perform actions on the site tree)
		 * * Actions menu (Edit page actions)
		 */
		$('.ss-tabset.ss-ui-action-tabset').entwine({

			/**
			 * Lightweight wrapper around jQuery UI tabs: 
			 *	* onadd
			 *	* onremove
			 *	* redraw
			 */
			onafterredrawtabs: function() {								
				this.redraw();
				this._super();
			},
			onremove: function() {
				if(this.data('uiTabs')){
					this.tabs('destroy');
				}
				this._super();
			},
			redraw: function() {				
				this.actionTabs();	
				var that = this;
			}, 
		
			/**
			 * Custom functionality for special action tabsets
			 * * actionTabs - generic action tab rules
			 * * siteTreeActions - specific to site tree actuon tabs
			 * * actionsMenu - specific to action menus
			 * * attachCloseHandler - generic to handle close tabs
			 * * riseUp - generic to handle positioning
			 */


			/** 
			 * Apply generic rules for action tabs (collapsible, rise, and close), 
			 * then call specific functions to handle each type of action tab 
			 */
			actionTabs: function(){
				var that = this;

				//Set ignoreTabState to true so it will not be opened on form submission
				this.data('ignoreTabState', true);

				//Set actionTabs to allow closing and be closed by default
				this.tabs(
					'option', 
					'collapsible',
					true					
				).tabs('option', 'active', false);

								
				// Call riseUp function on beforeactivate to check if tabs should 
				// open upwards (based on available space) and adjust				
				this.on( "tabsbeforeactivate", function(event, ui) {
					that.riseUp(event, ui);
				});

				//Run attachCloseHandler function on click event
				this.on( "click", function(event, ui) {
					that.attachCloseHandler(event, ui);
				});
					
				// Apply special behaviour depending on whether tabs are 
				// sitetree actions, or an actionmenu
				if(this.parents('.cms-content-actions')){
					this.actionsMenu();
				} else if(this.hasClass('cms-actions-row')){
					this.siteTreeActions();	
				}				
			},

			/**
			 * Apply custom rules to the Actions Menu	
			 * Currently includes positioning logic
			 */
			actionsMenu: function(){	
				this.tabs({
					beforeActivate:function(event, ui){ //Set options before tab activated (but after clicked)
						var activePanel = ui.newPanel, activeTab = ui.newTab;
						//Set the position of the opening tab (if it exists)			
						if($(activePanel).length > 0){		
							$(activePanel).css('left', activeTab.position().left+"px");		
						}															
					}	
				});	
			},

			/**
			 *	Apply rules to the siteTree actions. These action panels should 
			 *	recieve different positions and classes depending on whether they are 
			 *	appearing in the full page site tree view, or in the sidebar
			 */
			siteTreeActions: function(){	
				var that = this, container = this.parent().parent();

				//Remove open classes on beforeactivate
				this.on( "tabsbeforeactivate", function(event, ui) {
					// Remove tabset open classes (last gets a unique class 
					// in the bigger sitetree, so remove this too)
					$(that).closest('.ss-ui-action-tabset')
							.removeClass('tabset-open')
							.removeClass('tabset-open-last'); 
				});

				// Apply specific rules if the actions panel appears in the side-bar:				  
				//  - hover helper class (for animation)
				//  - reset panel positions				
				if($(container).hasClass('cms-tree-view-sidebar')){	
					// If actions panel is within the sidebar, apply active class 
					// to help animate open/close on hover
					$('.ui-tabs-nav li').hover(function(){								
						$(this).parent().find('li .active').removeClass('active');
						$(this).find('a').addClass('active');															
					});

					// Reset position of tabs, else anyone going between the large 
					// and the small sitetree will see broken tabs
					this.tabs({
						// Note: beforeActivate runs when a tab is clicked, 
						// but before it is visible.
						beforeActivate:function(event, ui){
							var activePanel = ui.newPanel; //the new active panel	

							// Apply styles with .css, to avoid overriding currently applied styles	
							$(activePanel).css({'left': 'auto', 'right': 'auto'});	

							if($(activePanel).length > 0){								
								$(activePanel).parent().addClass('tabset-open');	
							}														
						}			
					});	
				}else{		
					// If the tabs are in the full site tree view, do some 
					// positioning so tabPanel stays with relevent tab				
					this.tabs({
						beforeActivate:function(event, ui){
							var activePanel = ui.newPanel, activeTab = ui.newTab; 

							if($(activePanel).length > 0){
								if($(activeTab).hasClass("last")){
									// Align open tab to the right (because opened tab is last)									
									$(activePanel).css({'left': 'auto', 'right': '0px'});	

									// last needs to be styled differently when open, so apply a unique class
									$(activePanel).parent().addClass('tabset-open-last');	
								}else{	
									// Assign position to tabpanel based on position of relivent activeTab item
									$(activePanel).css('left', activeTab.position().left+"px");	

									// If this is the first tab, make sure the position doesn't include border 
									// (hard set position to 0 ), and add the tab-set open class
									if($(activeTab).hasClass("first")){
										$(activePanel).css('left',"0px");	
										$(activePanel).parent().addClass('tabset-open');
									}
								}	
							}																						
						}	
					});
				}
			},
			
			/**
			 * Generic function to close open tabs when something other than 
			 * the open tab is clicked. Stores event in a handler, and removes 
			 * the bound event once activated. Used by ss-ui-action-tabset.
			 *
			 * Note: Should be called by a click event attached to 'this'
			 */
			attachCloseHandler: function(event, ui){
				var that = this, frame = $('.cms').find('iframe'), closeHandler; //get all iframes	on the page	

				// Create a handler for the click event so we can close tabs 
				// and easily remove the event once done
				closeHandler = function(event){	
					var panel, frame;
					panel = $(event.target).closest('.ss-ui-action-tabset .ui-tabs-panel');						
					// If anything except the ui-nav button is clicked, 
					// close panel and remove handler						
					if (!$(event.target).closest(that).length || $(panel).length) {
						that.tabs('option', 'active', false); // close tabs
						// remove click event from objects it is bound to (iframe's and document)
						frame = $('.cms').find('iframe');
						frame.each(function(index, iframe){
							$(iframe).contents().off('click', closeHandler);
						});										
						$(document).off('click', closeHandler);
				    }
				};

				// Bind click event to document, and use closeHandler to handle the event							
				$(document).on('click', closeHandler);	
				// Make sure iframe click also closes tab
				// iframe needs a special case, else the click event will not register here
				if(frame.length > 0){
					frame.each(function(index, iframe){
						$(iframe).contents().on('click', closeHandler);
					});									
				}
			},				
			/**  
			 * Function riseUp checks to see if a tab should be opened upwards 
			 * (based on space concerns). If true, the rise-up class is applied 
			 * and a new position is calculated and applied to the element. 
			 *
			 * Note: Should be called by a tabsbeforeactivate event
			 */
			riseUp: function(event, ui){	
				var elHeight, trigger, endOfWindow, elPos, activePanel, activeTab, topPosition, containerSouth, padding;

				// Get the numbers needed to calculate positions							
				elHeight = $(this).find('.ui-tabs-panel').outerHeight();				
				trigger = $(this).find('.ui-tabs-nav').outerHeight();
				endOfWindow = ($(window).height() + $(document).scrollTop()) - trigger;
				elPos = $(this).find('.ui-tabs-nav').offset().top;
				
				activePanel = ui.newPanel;
				activeTab = ui.newTab;	

				if (elPos + elHeight >= endOfWindow && elPos - elHeight > 0){					
					this.addClass('rise-up');					
							
					if (activeTab.position() !== null){
						topPosition = -activePanel.outerHeight();
						containerSouth = activePanel.parents('.south');
						if (containerSouth){
							// If container is the southern panel, make tab appear from the top of the container
							padding = activeTab.offset().top - containerSouth.offset().top;								
							topPosition = topPosition-padding;	
						}	 
						$(activePanel).css('top',topPosition+"px");									
					}
				} else {
					// else remove the rise-up class and set top to 0
					this.removeClass('rise-up'); 
					if (activeTab.position() !== null){
						$(activePanel).css('top','0px');	
					}
				}
				return false;		
			}
		});
	});
}(jQuery));
