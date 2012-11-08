<div class="cms-navigator">
	<span class="field dropdown">
		<select id="cms-preview-state-dropdown" class="preview-dropdown dropdown nolabel" autocomplete="off" name="Action">
			<option value="split"><% _t('SilverStripeNavigator.SplitView', 'Split View') %></option>
			<option value="preview"><% _t('SilverStripeNavigator.Preview View', 'Preview View') %></option>
		</select>
	</span>

	<ul class="cms-preview-states">
		<% loop Items %>
			<li class="<% if isActive %> active<% end_if %>">$HTML
				<!-- <% if Watermark %><span class="cms-preview-watermark">$Watermark</span><% end_if %> not needed -->
			</li>
		<% end_loop %>
	</ul>
</div>
