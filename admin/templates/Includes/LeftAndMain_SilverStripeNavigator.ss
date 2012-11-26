<div class="cms-navigator">

    <span class="preview-selector field dropdown">
		<select id="cms-preview-mode-dropdown" class="preview-dropdown dropdown nolabel" autocomplete="off" name="Action">
			<option data-icon="icon-split" class="icon-split icon-view first" value="split"><% _t('SilverStripeNavigator.SplitView', 'Split mode') %></option>
			<option data-icon="icon-preview" class="icon-preview icon-view" value="preview"><% _t('SilverStripeNavigator.PreviewView', 'Preview mode') %></option>
			<option data-icon="icon-edit" class="icon-edit icon-view" value="edit"><% _t('SilverStripeNavigator.EditView', 'Edit mode') %></option>
			<option data-icon="icon-window" class="icon-window icon-view last" value="window"><% _t('SilverStripeNavigator.DualWindowView', 'Dual Window') %></option>
		</select>
	</span>
	
<!--
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
	</ul> -->

    <span class="preview-selector field dropdown">
		<select id="cms-preview-mode-dropdown" class="preview-dropdown dropdown nolabel" autocomplete="off" name="Action">
			<option data-icon="icon-auto" data-description="<% _t('SilverStripeNavigator.Responsive', 'Responsive') %>" class="icon-auto icon-view first" value="split">
				<% _t('SilverStripeNavigator.Auto', 'Auto') %>
			</option>
			<option data-icon="icon-desktop" data-description="1024px <% _t('SilverStripeNavigator.Width', 'width') %>" class="icon-desktop icon-view" value="preview">
				<% _t('SilverStripeNavigator.Desktop', 'Desktop') %>
			</option>
			<option data-icon="icon-tablet" data-description="800px <% _t('SilverStripeNavigator.Width', 'width') %>" class="icon-tablet icon-view" value="edit">
				<% _t('SilverStripeNavigator.Tablet', 'Tablet') %>
			</option>
			<option data-icon="icon-mobile" data-description="400px <% _t('SilverStripeNavigator.Width', 'width') %>" class="icon-mobile icon-view last" value="window">
				<% _t('SilverStripeNavigator.Mobile', 'Mobile') %>
			</option>
		</select>
	</span>


	<% include PreviewSwitch %>

</div>
