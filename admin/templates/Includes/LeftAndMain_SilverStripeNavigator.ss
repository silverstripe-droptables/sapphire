<div class="cms-navigator">

 <!-- To remove 
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
				<li class="last">
					<a class="icon-edit" href="">Edit mode</a> 
				</li>
				<!-- <li class="last">
					<a class="icon-window" href="">Dual window</a> 
				</li> /-->
	        </ul>
	    </li>
	</ul>
-->

	
   
    <span class="field dropdown">
		<select id="cms-preview-mode-dropdown" class="preview-dropdown dropdown nolabel" autocomplete="off" name="Action">
			<option class="icon-split icon-view" value="split"><% _t('SilverStripeNavigator.SplitView', 'Split mode') %></option>
			<option class="icon-preview icon-view" value="preview"><% _t('SilverStripeNavigator.PreviewView', 'Preview mode') %></option>
			<option class="icon-edit icon-view" value="edit"><% _t('SilverStripeNavigator.EditView', 'Edit mode') %></option>
			<option class="icon-window icon-view" value="window"><% _t('SilverStripeNavigator.DuelWindowView', 'Duel Window') %></option>
		</select>
	</span>
	

    <!-- To remove -->
    <span class="field dropdown">
		<select id="cms-preview-mode-dropdown" class="preview-dropdown dropdown nolabel" autocomplete="off" name="Action">
			<option value="split"><% _t('SilverStripeNavigator.SplitView', 'Split mode') %></option>
			<option value="preview"><% _t('SilverStripeNavigator.Preview View', 'Preview mode') %></option>
		</select>
	</span>

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


	<% include Switch %>

</div>
