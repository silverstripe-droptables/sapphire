<div class="cms-navigator">
	<ul class="preview-selector select-mode">
	    <li>
	        <span class="preview-selected">
	        	<a href="" class="icon-split">	
	        	<% _t('SilverStripeNavigator.SplitView', 'Split mode') %>
	        	</a>
	    	</span> 
	        <ul class="preview-size-menu">
	            <li class="active">
					<a class="icon-split" href="">Split mode</a> 
				</li>
				<li>
					<a class="icon-preview" href="">Preview mode</a> 
				</li>
				<li>
					<a class="icon-edit" href="">Edit mode</a> 
				</li>
				<li class="last">
					<a class="icon-window" href="">Dual window</a> 
				</li>
	        </ul>
	    </li>
	</ul>

	<ul class="preview-selector double-label select-size">
	    <li>
	        <span class="preview-selected">
	        	<a href="" class="icon-auto">Auto <span>Responsive</span></a>
	        </span>
	        <ul class="preview-size-menu">
	            <li class="active">
					<a class="icon-auto" href="">Auto <span>Responsive</span></a> 
				</li>
				<li>
					<a class="icon-desktop" href="">Desktop <span>1024px width</span></a> 
				</li>
				<li>
					<a class="icon-tablet" href="">Tablet <span>800px width</span></a> 
				</li>
				<li class="last">
					<a class="icon-mobile" href="">Mobile <span>400px width</span></a> 
				</li>
	        </ul>
	    </li>
	</ul>


	<div class="cms-preview-states">
	    <input type="checkbox" name="cms-preview" class="hide cms-preview" id="cms-preview-state" checked>
	    <label for="cms-preview-state">
		    <span class="switch-options">
		    	<% loop Items %>
		    	<a href="$Link" class="$FirstLast <% if isActive %> active<% end_if %>">
		    			$Title		
				</a>
				<% end_loop %>
		    </span>
		    <span class="switch"></span>
	    </label>
    </div> 

    <!-- To remove 
    <span class="field dropdown">
		<select id="cms-preview-mode-dropdown" class="preview-dropdown dropdown nolabel" autocomplete="off" name="Action">
			<option value="split"><% _t('SilverStripeNavigator.SplitView', 'Split mode') %></option>
			<option value="preview"><% _t('SilverStripeNavigator.Preview View', 'Preview mode') %></option>
		</select>
	</span>
	-->

	<!-- To remove 
    <ul class="cms-preview-states">
		<% loop Items %>
			<li class="<% if isActive %> active<% end_if %>">$HTML
			</li>
		<% end_loop %>
	</ul>-->
</div>
