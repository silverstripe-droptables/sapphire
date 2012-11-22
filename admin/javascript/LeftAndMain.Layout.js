/**
 * File: LeftAndMain.Layout.js
 */

(function($) {

	$.fn.layout.defaults.resize = false;

	/**
	 * Acccess the global variable in the same way the plugin does it.
	 */
	jLayout = (typeof jLayout === 'undefined') ? {} : jLayout;

	/**
	 * Factory function for generating new type of algorithm for our CMS.
	 *
	 * Spec requires a definition of three column elements:
	 * - `menu` on the left
	 * - `content` area in the middle (includes the EditForm, side tool panel, actions, breadcrumbs and tabs)
	 * - `preview` on the right (will be shown if there is enough space)
	 *
	 * Spec also requires the following size parameters:
	 * - `minMenuWidth`: expanded menu size
	 * - `maxMenuWidth`: collapsed menu size
	 * - `minContentWidth`: minimum size for the content display as long as the preview is visible.
	 * - `minPreviewWidth`: preview will not be displayed below this size.
	 *
	 * The algorithm tries to assign half of non-menu space to preview and the other half to content. If there is not
	 * enough space for either content or preview, it tries to allocate the minimum acceptable space to that column, and
	 * the rest to the other one. If the minimum requirements are still not met, it falls back to showing content
	 * only.
	 *
	 * @param spec A structure defining columns and parameters as per above.
	 */
	jLayout.threeColumnCompressor = function (spec, options) {
		// Spec sanity checks.
		if (typeof spec.menu==='undefined' ||
			typeof spec.content==='undefined' ||
			typeof spec.preview==='undefined') {
			throw 'Spec is invalid. Please provide "menu", "content" and "preview" elements.';
		}
		if (typeof options.minMenuWidth==='undefined' ||
			typeof options.maxMenuWidth==='undefined' ||
			typeof options.minContentWidth==='undefined' ||
			typeof options.minPreviewWidth==='undefined') {
			throw 'Spec is invalid. Please provide "minMenuWidth", "maxMenuWidth", '
				+ '"minContentWidth" and "minPreviewWidth".';
		}

		// Instance of the algorithm being produced.
		var obj = {
			options: options
		};

		// Internal column handles, also implementing layout.
		var menu = $.jLayoutWrap(spec.menu),
			content = $.jLayoutWrap(spec.content),
			preview = $.jLayoutWrap(spec.preview);

		/**
		 * Required interface implementations follow.
		 * Refer to https://github.com/bramstein/jlayout#layout-algorithms for the interface spec.
		 */
		obj.layout = function (container) {
			var contentHidden = (content.item.is('.is-collapsed'));
			var previewHidden = false;

			var size = container.bounds(),
				insets = container.insets(),
				top = insets.top,
				bottom = size.height - insets.bottom,
				left = insets.left,
				right = size.width - insets.right;

			var menuWidth = 0, 
				contentWidth = 0,
				previewWidth = 0;

			// Set the preferred menu width.
			if ($('#cms-menu.cms-panel').hasClass('collapsed')) {
				menuWidth = this.options.minMenuWidth;
			} else {
				menuWidth = this.options.maxMenuWidth;
			}

			if (contentHidden) {
				// All non-menu space allocated to preview.
				contentWidth = 0;
				previewWidth = right - left - menuWidth;
			} else {
				// Try 50-50 distribution
				contentWidth = (right - left - menuWidth) / 2;
				previewWidth = right - left - (menuWidth + contentWidth);

				// If violating one of the minima, try to readjust towards satisfying it.
				if (contentWidth < this.options.minContentWidth) {
					contentWidth = this.options.minContentWidth;
					previewWidth = right - left - (menuWidth + contentWidth);
				} else if (previewWidth < this.options.minPreviewWidth) {
					previewWidth = this.options.minPreviewWidth;
					contentWidth = right - left - (menuWidth + previewWidth);
				}

				// If still violating one of the (other) minima, remove the preview and allocate everything to content.
				if (contentWidth < this.options.minContentWidth || previewWidth < this.options.minPreviewWidth) {
					contentWidth = right - left - menuWidth;
					// Preview will be hidden by putting it behind the content panel.
					previewWidth = contentWidth;
					previewHidden = true;
				}
			}

			// Apply the widths to columns, and call subordinate layouts to arrange the children.
			menu.bounds({'x': left, 'y': top, 'height': bottom - top, 'width': menuWidth});
			menu.doLayout();
			left += menuWidth;

			content.bounds({'x': left, 'y': top, 'height': bottom - top, 'width': contentWidth});
			content.item.css({display: contentHidden ? 'none' : 'block'});
			content.doLayout();
			if (!previewHidden) left += contentWidth;

			preview.bounds({'x': left, 'y': top, 'height': bottom - top, 'width': previewWidth});
			preview.doLayout();

			return container;
		};

		/**
		 * Helper to generate the required `preferred`, `minimum` and `maximum` interface functions.
		 */
		function typeLayout(type) {
			var func = type + 'Size';

			return function (container) {
				var menuSize = menu[func](),
					contentSize = content[func](),
					previewSize = preview[func](),
					insets = container.insets();

				width = menuSize.width + contentSize.width + previewSize.width;
				height = Math.max(menuSize.height, contentSize.height, previewSize.height);

				return {
					'width': insets.left + insets.right + width,
					'height': insets.top + insets.bottom + height
				};
			};
		}

		// Generate interface functions.
		obj.preferred = typeLayout('preferred');
		obj.minimum = typeLayout('minimum');
		obj.maximum = typeLayout('maximum');

		return obj;
	};

}(jQuery));
