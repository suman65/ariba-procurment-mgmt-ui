
Ext.override(Ext.data.reader.Reader,
{
	config:
	{
		totalProperty: 'total',
		successProperty: 'success',
		rootProperty: '',
		messageProperty: '',
		typeProperty: '',
		implicitIncludes: true,
		readRecordsOnFailure: true,
		model: null,
		proxy: null,
		transform: null,
		keepRawData: false
	}
});


/**
 * Overridden to render mandatory field mark
 */
Ext.override(Ext.form.field.Base,
{
	getFieldLabel: function()
	{
		var label = this.callParent(arguments);
		return label = (label && this.allowBlank === false) ? label + ATP.mandatoryIndicator : label;;
	}
});

Ext.override(Ext.form.FieldContainer,
{
	/**
	 * Overridden to render mandatory field mark
	 * set {@link #fieldLabel}. Otherwise returns the fieldLabel like normal. You can also override
	 * this method to provide a custom generated label.
	 * @return {String} The label, or empty string if none.
	 */
	getFieldLabel: function()
	{
		var label = this.fieldLabel || '';
		if (!label && this.combineLabels) {
			label = Ext.Array.map(this.query('[isFieldLabelable]'), function(field) {
				return field.getFieldLabel();
			}).join(this.labelConnector);
		}

		return label = (label && this.allowBlank === false) ? label + ATP.mandatoryIndicator : label;;
	}
});

/**
 * @author rabindranath.s
 * @class Ext.grid.filters.filter.Base
 * @overrides Ext.grid.filters.filter.Base
 * overridden to pass fieldName
 * Provide the fieldName config in {@link Ext.data.Field} in case the server side mapping is different from mapping or name
 */
Ext.override(Ext.grid.filters.filter.Base,
{
	createFilter: function (config, key)
	{
		var filterConfig = this.getFilterConfig(config, key);

		if (this.getGridStore().getRemoteFilter())
		{
			var model = this.getGridStore().getModel();
			var field = model && model.getField(this.dataIndex);
			filterConfig.fieldName = (field && (field.fieldName || field.mapping)) || this.dataIndex;
		}

		return new Ext.util.Filter(filterConfig);
	}
	,getActiveState: function (config, value)
	{
		// An `active` config must take precedence over a `value` config.
		var active = config.active;

		return (active != undefined) ? active : value !== undefined;
	}
});

/**
 * @author rabindranath.s
 * @class Ext.grid.filters.filter.SingleFilter
 * @overrides Ext.grid.filters.filter.SingleFilter
 * This is the code for overriding constructor method
 * overridden to pass data type: "type"
 */
Ext.override(Ext.grid.filters.filter.SingleFilter,
{
	constructor: function (config)
	{
		var me = this, filter, value;
		/**
		 * callSuper to bypass the overridden method
		 */
		me.callSuper(arguments);
		value = me.value;
		filter = me.getStoreFilter();
		if (filter)
		{
		    me.active = true;
		}
		else
		{
			if (me.grid.stateful && me.getGridStore().saveStatefulFilters) {
				value = undefined;
			}

			me.active = me.getActiveState(config, value);
			filter = me.createFilter({
				operator: me.operator,
				value: value,
				type : config.type
			});

			if (me.active) {
				me.addStoreFilter(filter);
			}
		}

		if (me.active) {
		    me.setColumnActive(true);
		}

		me.filter = filter;
	}
});

/**
 * @author rabindranath.s
 * @class Ext.grid.filters.filter.TriFilter
 * @overrides Ext.grid.filters.filter.TriFilter
 * This is the code for overriding constructor method
 * overridden to pass two extra params: "type" and "dateFormat" in case date type filter
 * Now it supports two more type filter i.e. "less than equal" and "greater than equal"
 * Greater Than Equal and Less Than Equal Support Added and not tested in case of local filter
 */
Ext.override(Ext.grid.filters.filter.TriFilter,
{
	constructor: function (config)
	{
		var me = this, stateful = false, filter = { }, filterGt, filterLt, filterEq, value, operator,
			dateFormat, filterLe, filterGe;
		/**
		 * callSuper to bypass the overridden method
		 */
		me.callSuper([config]);
		value = me.value;
		filterLt = me.getStoreFilter('lt');
		filterGt = me.getStoreFilter('gt');
		filterEq = me.getStoreFilter('eq');
		//Added
		filterLe = me.getStoreFilter('le');
		filterGe = me.getStoreFilter('ge');
		//

		if (filterLt || filterGt || filterEq || filterLe || filterGe)
		{
			/**
			 * This filter was restored from stateful filters on the store so enforce it as active.
			 */
			stateful = me.active = true;
			if (filterLt) {me.onStateRestore(filterLt);}
			if (filterGt) {me.onStateRestore(filterGt);}
			if (filterEq) {me.onStateRestore(filterEq);}
			if (filterLe) {me.onStateRestore(filterLe);}
			if (filterGe) {me.onStateRestore(filterGe);}
		}
		else
		{
			if (me.grid.stateful && me.getGridStore().saveStatefulFilters)
			{
				value = undefined;
			}

			me.active = me.getActiveState(config, value);
		}

		if (config.type == 'date')
		{
			dateFormat = (config.dateFormat || Ext.Date.defaultFormat);
			dateFormat = me.convertExtToJavaFormat(dateFormat);
		}

		filter.lt = filterLt || me.createFilter({
			operator: 'lt',
			value: (!stateful && value && value.lt) || null,
			type: config.type,
			dateFormat: dateFormat
		}, 'lt');

		filter.gt = filterGt || me.createFilter({
			operator: 'gt',
			value: (!stateful && value && value.gt) || null,
			type: config.type,
			dateFormat: dateFormat
		}, 'gt');

		filter.eq = filterEq || me.createFilter({
			operator: 'eq',
			value: (!stateful && value && value.eq) || null,
			type: config.type,
			dateFormat: dateFormat
		}, 'eq');

		//Added
		filter.le = filterLe || me.createFilter({
			operator: 'le',
			value: (!stateful && value && value.le) || null,
			type: config.type,
			dateFormat: dateFormat
		}, 'le');

		filter.ge = filterGe || me.createFilter({
			operator: 'ge',
			value: (!stateful && value && value.ge) || null,
			type: config.type,
			dateFormat: dateFormat
		}, 'ge');
		//

		me.filter = filter;
		if (me.active)
		{
			me.setColumnActive(true);
			if (!stateful) {for (operator in value) {me.addStoreFilter(me.filter[operator]);}}
			// TODO: maybe call this.activate?
		}
	}
	/**
	 * Convert Extjs date literal to Java date literal
	 */
	,convertExtToJavaFormat: function(format)
	{
		var code = [], special = false, ch = '', i;

		for (i = 0; i < format.length; ++i)
		{
			ch = format.charAt(i);
			if (!special && ch == "\\")
			{
				special = true;
			}
			else if (special)
			{
				special = false;
				code.push(Ext.String.escape(ch));
			}
			else
			{
				code.push(this.getJavaFormatCode(ch));
			}
		}

		return (code.join(''));
	}
	,javaFormatCode :
	{
		d: "dd",
		m: "MM",
		Y: "yyyy"
	}
	,getJavaFormatCode : function(character)
	{
		var f = this.javaFormatCode[character];
		// note: unknown characters are treated as literals
		return f || (Ext.String.escape(character));
	}
	,setValue: function (value)
	{
		var me = this,
			fields = me.fields,
			filters = me.filter,
			add = [],
			remove = [],
			active = false,
			filterCollection = me.getGridStore().getFilters(),
			field, filter, v, i, len;

		if (me.preventFilterRemoval) {
			return;
		}

		me.preventFilterRemoval = true;

		if ('eq' in value)
		{
			v = filters.lt.getValue();
			if (v || v === 0) {
				remove.push(fields.lt);
			}

			v = filters.gt.getValue();
			if (v || v === 0) {
				remove.push(fields.gt);
			}

			//Added
			v = filters.le.getValue();
			if (v || v === 0) {
				remove.push(fields.le);
			}

			v = filters.ge.getValue();
			if (v || v === 0) {
				remove.push(fields.ge);
			}
			//

			v = value.eq;
			if (v || v === 0)
			{
				add.push(fields.eq);
				filters.eq.setValue(v);
			}
			else
			{
				remove.push(fields.eq);
			}
		}
		else if ('lt' in value || 'gt' in value)
		{
			v = filters.eq.getValue();
			if (v || v === 0) {
				remove.push(fields.eq);
			}

			//Added
			v = filters.le.getValue();
			if (v || v === 0) {
				remove.push(fields.le);
			}

			v = filters.ge.getValue();
			if (v || v === 0) {
				remove.push(fields.ge);
			}
			//

			if ('lt' in value)
			{
				v = value.lt;
				if (v || v === 0)
				{
					add.push(fields.lt);
					filters.lt.setValue(v);
				}
				else
				{
					remove.push(fields.lt);
				}
			}

			if ('gt' in value)
			{
				v = value.gt;
				if (v || v === 0)
				{
					add.push(fields.gt);
					filters.gt.setValue(v);
				}
				else
				{
					remove.push(fields.gt);
				}
			}
		}
		else if ('le' in value || 'ge' in value)
		{
			//Added
			v = filters.eq.getValue();
			if (v || v === 0) {
				remove.push(fields.eq);
			}

			v = filters.lt.getValue();
			if (v || v === 0) {
				remove.push(fields.lt);
			}

			v = filters.gt.getValue();
			if (v || v === 0) {
				remove.push(fields.gt);
			}

			if ('le' in value)
			{
				v = value.le;
				if (v || v === 0)
				{
					add.push(fields.le);
					filters.le.setValue(v);
				}
				else
				{
					remove.push(fields.le);
				}
			}

			if ('ge' in value)
			{
				v = value.ge;
				if (v || v === 0)
				{
					add.push(fields.ge);
					filters.ge.setValue(v);
				}
				else
				{
					remove.push(fields.ge);
				}
			}
			//
		}

		if (remove.length || add.length)
		{
			filterCollection.beginUpdate();

			if (remove.length)
			{
				for (i = 0, len = remove.length; i < len; i++)
				{
					field = remove[i];
					filter = field.filter;

					field.setValue(null);
					filter.setValue(null);
					me.removeStoreFilter(filter);
				}
			}

			if (add.length)
			{
				for (i = 0, len = add.length; i < len; i++)
				{
					me.addStoreFilter(add[i].filter);
				}
			
				active = true;
			}

			filterCollection.endUpdate();
		}

		if (!active && filterCollection.length) { active = me.hasActiveFilter(); }
		if (!active || !me.active) { me.setActive(active); }
		me.preventFilterRemoval = false;
	}
});

/**
 * @author rabindranath.s
 * @class Ext.grid.filters.filter.Date
 * @overrides Ext.grid.filters.filter.Date
 * overridden to handle remote filtering
 */
Ext.override(Ext.grid.filters.filter.Date,
{
	config:
	{
		/**
		 * @cfg {Object} [fields]
		 * Configures field items individually. These properties override those defined
		 * by `{@link #itemDefaults}`.
		 *
		 * Example usage:
		 *      fields: {
		 *          gt: { // override fieldCfg options
		 *              width: 200
		 *          }
		 *      },
		 */
		fields: {
			lt: {text: 'Before'},
			gt: {text: 'After'},
			eq: {text: 'On'},
			le: {text: 'On Or Before'},
			ge: {text: 'On Or After'}
		}
	
		/**
		 * @cfg {Object} pickerDefaults
		 * Configuration options for the date picker associated with each field.
		 */
		,pickerDefaults: {
			xtype: 'datepicker',
			border: 0
		}
		,updateBuffer: 0
		,dateFormat: undefined
	}
	,onMenuSelect: function (picker, date)
	{
		var fields = this.fields,
			field = fields[picker.itemId],
			gt = fields.gt,
			lt = fields.lt,
			eq = fields.eq,
			le = fields.le,
			ge = fields.ge
			v = {};

		field.up('menuitem').setChecked(true, /*suppressEvents*/ true);

		//
		if (field === eq || field === lt || field === gt)
		{
			if (le)	le.up('menuitem').setChecked(false, true);
			if (ge)	ge.up('menuitem').setChecked(false, true);
		}
		if (field === eq || field === le || field === ge)
		{
			if (lt)	lt.up('menuitem').setChecked(false, true);
			if (gt)	gt.up('menuitem').setChecked(false, true);
		}
		//

		if (field === lt || field === gt)
		{
			eq.up('menuitem').setChecked(false, true);
			if (field === gt && (+lt.value < +date)) {
				lt.up('menuitem').setChecked(false, true);
				v.lt = null;
			} else if (field === lt && (+gt.value > +date)) {
			 	gt.up('menuitem').setChecked(false, true);
			 	v.gt = null;
			}
		}
		else if (field === le || field === ge)
		{
			eq.up('menuitem').setChecked(false, true);
			if (field === ge && (+le.value < +date)) {
				le.up('menuitem').setChecked(false, true);
				v.le = null;
			} else if (field === le && (+ge.value > +date)) {
				ge.up('menuitem').setChecked(false, true);
				v.ge = null;
			}
		}

		v[field.filterKey] = date;
		this.setValue(v);

		picker.up('menu').hide();
	}
});

/**
 * @author rabindranath.s
 * @class Ext.grid.column.Column
 * @overrides Ext.grid.column.Column
 * overridden to handle remote sorting
 * returns sorting param
 */
Ext.override(Ext.grid.column.Column,
{
	requires	: 'Ext.grid.column.Column'
	,getSortParam: function()
	{
		var grid = this.up('tablepanel');
		if (grid.store.getRemoteSort())
		{
			var model = grid.store.getModel();
			var field = model && model.getField(this.dataIndex);
			return (field && (field.fieldName || field.mapping )) || this.dataIndex;
		}
		else
		{
			return this.dataIndex;
		}
	}
});

/**
 * @author rabindranath.s
 * @class Ext.tab.Tab
 * @overrides Ext.tab.Tab
 * overridden to handle icon alignment
 */
Ext.override(Ext.tab.Tab,
{
	setCard: function(card)
	{
		var me = this;

		me.card = card;
		if (card.textAlign) {
			me.setTextAlign(card.textAlign);
		}
		me.setText(me.title || card.title);
		me.setIconCls(me.iconCls || card.iconCls);
		me.setIcon(me.icon || card.icon);
		me.setGlyph(me.glyph || card.glyph);
	}
	,setIconValue: function(v)
	{
		this.btnIconEl.setHtml(v || ' ');
	}
	,getIconValue: function(v)
	{
		var value = this.btnIconEl.getHtml();
		var trimedValue =  value.trim();

		return (trimedValue ? parseInt(trimedValue) : 0);
	}
});

/**
 * @author rabindranath.s
 * @class Ext.selection.Model
 * @overrides Ext.selection.Model
 * Ovridden to fire the grid view selectionchange event when grid refresh and it has a selection
 * @cfg {Boolean} fireSelectionChangeOnStoreRefresh, pass true to fire
 */
Ext.override(Ext.selection.Model,
{
	updateSelectedInstances: function(selected)
	{
		this.callParent(arguments);
		if (this.hasSelection() && this.fireSelectionChangeOnStoreRefresh)
		{
			this.fireEvent('selectionchange', this, this.getSelection());
		}
	}
});

/**
 * @author rabindranath.s
 * Bug Fixes
 * Date Object Comparision
 */
Ext.Date.isEqual = function(date1, date2) {
        // check we have 2 date objects
        if (Ext.isDate(date1) && Ext.isDate(date2)) {
            return (date1.getTime() === date2.getTime());
        }
        // one or both isn't a date, only equal if both are falsey
        return !(date1 || date2);
    }

Ext.override(Ext.tab.Panel,
{
	initComponent: function() {
        var me = this,
            // Default to 0 if undefined and not null!
            activeTab = me.activeTab !== null ? (me.activeTab || 0) : null,
            dockedItems = me.dockedItems,
            header = me.header,
            tabBarHeaderPosition = me.tabBarHeaderPosition,
            tabBar = me.getTabBar(),
            headerItems;

        // Configure the layout with our deferredRender, and with our activeTeb
        me.layout = new Ext.layout.container.Card(Ext.apply({
            owner: me,
            deferredRender: me.deferredRender,
            itemCls: me.itemCls,
            activeItem: activeTab
        }, me.layout));

        if (tabBarHeaderPosition != null) {
            header = me.header = Ext.apply({}, header);

            headerItems = header.items = (header.items ? header.items.slice() : []);
            if (!me.donotOverrideItemPosition)
            header.itemPosition = tabBarHeaderPosition;
            headerItems.push(tabBar);
            header.hasTabBar = true;
        } else {
            dockedItems = [].concat(me.dockedItems || []);
            dockedItems.push(tabBar);
            me.dockedItems = dockedItems;
        }

        me.callSuper(arguments);

        // We have to convert the numeric index/string ID config into its component reference
        activeTab = me.activeTab = me.getComponent(activeTab);

        // Ensure that the active child's tab is rendered in the active UI state
        if (activeTab) {
            tabBar.setActiveTab(activeTab.tab, true);
        }
    }
});

/**
* @author rabindranath.s
* Bug Fixes
*/
Ext.override(Ext.chart.series.Series,
{
	updateTitle: function(newTitle)
	{
		var me = this,
			chart = me.getChart();
		if (!chart || chart.isInitializing) {return;}
		newTitle = Ext.Array.from(newTitle);
		var series = chart.getSeries(),
			seriesIndex = Ext.Array.indexOf(series, me),
			legendStore = chart.getLegendStore(),
			yField = me.getYField(),
			i, item, title, ln;

		if (legendStore && legendStore.getCount() && seriesIndex !== -1)
		{
			ln = yField ? Math.min(newTitle.length, yField.length) : newTitle.length;
			for (i = 0; i < ln; i++)
			{
				title = newTitle[i];
				item = legendStore.getAt(seriesIndex + i);
				if (title && item) {item.set('name', title);}
			}
		}
	}
});

/**
* @author rabindranath.s
* Bug Fixes And Customization
*/
Ext.override(Ext.layout.container.boxOverflow.Menu,
{
	createMenuConfig: function(component, hideOnClick)
	{
		var config = this.callParent(arguments);
		Ext.apply(config, {text: component.overflowText || component.text});
		return config;
	}
	,addComponentToMenu: function(menu, component)
	{
		if (component instanceof Ext.toolbar.TextItem) {return;}
		this.callParent(arguments);
	}
	/*,showTrigger: function(ownerContext)
	{
		var me = this,
			layout = me.layout,
			owner = layout.owner,
			names = layout.names,
			startProp = names.x,
			sizeProp = names.width,
			plan = ownerContext.state.boxPlan,
			available = plan.targetSize[sizeProp],
			childItems = ownerContext.childItems,
			menuTrigger = me.menuTrigger,
			menuItems = me.menuItems,
			childContext, comp, i, props, len;

		// We don't want the menuTrigger.show to cause owner's layout to be invalidated, so
		// we force just the button to be invalidated and added to the current run.
		menuTrigger.suspendLayouts();
		menuTrigger.show();
		menuTrigger.resumeLayouts(me._asLayoutRoot);

		available -= me.triggerTotalWidth;

		owner.suspendLayouts();

		// Hide all items which are off the end, and store them to allow them to be restored
		// before each layout operation.
		for (i = 0, len = menuItems.length; i < len; ++i) {
		    me.clearItem(menuItems[i]);
		}
		menuItems.length = 0;

		for (i = 0, len = childItems.length; i < len; i++)
		{
			childContext = childItems[i];
			props = childContext.props;
			if (props[startProp] + props[sizeProp] > available)
			{
				comp = childContext.target;
				me.menuItems.push(comp);
				comp.hide();
			}
		}

		owner.resumeLayouts();
	}*/
});
