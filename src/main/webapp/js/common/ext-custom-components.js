Ext.define('Ext.data.reader.JsonReader',
{
	extend			: 'Ext.data.reader.Json'
	,alias 			: 'reader.jsonreader'
	,keepRawData	: false
	,rootProperty	: 'content'
	,totalProperty	: 'page.totalElements'
	,successProperty: 'success'
	,messageProperty: 'message'
});

Ext.define('Ext.data.reader.ComboJsonReader',
{
	extend			: 'Ext.data.reader.Json'
	,alias 			: 'reader.combojsonreader'
	,keepRawData	: false
	,successProperty: 'success'
	,messageProperty: 'message'
});

/** Combo Field common Model Throughout Application **/

Ext.define('ComboModel', 
{
	extend		: 'Ext.data.Model'
	,fields		: ['id'		, 'name'	, 'refId'	, 'refName']
	,idProperty	: 'xyz'
});

Ext.define('Ext.data.GridStore',
{
	 extend		: 'Ext.data.Store'
	,alias		: 'store.gridstore'
	,pageSize	: 20
	,autoLoad 	: false
	,autoDestroy: true
	,remoteSort	: true
	,remoteFilter: true
});

Ext.define('Ext.data.ComboStore',
{
	 extend		: 'Ext.data.Store'
	,alias		: 'store.combostore'
	,model		: 'ComboModel'
	,autoLoad 	: false
	,autoDestroy: true
	,pageSize	: 0
});

Ext.define('Ext.custom.grid.Panel',
{
	extend		: 'Ext.grid.Panel'
	,requires	: ['Ext.ux.ProgressBarPager']
	,alias		: 'widget.customgrid'
	,border		: false
	,emptyText	: 'No data Available'
	,columnLines: true
	/**
	 * @cfg {Array} pageSlaps
	 * It defines the pageSlaps to be applied. Default to [25, 50, 75, 100]
	 */
	,pageSlaps	: undefined	//Array
	,forceFit	: true
	/**
	 * @cfg {Boolean} pagination
	 * true to add paging bar, make false to avoid paging bar, default to true
	 */
	,pagination	: true
	/**
	 * @cfg {Boolean} applyFilter
	 * true to add filter plugin, make false to avoid filter plugin, default to true
	 */
	,applyFilter: true
	,applyColTooltip: true
	,cls		: 'x-custom-grid'
	//,allowDeselect: true
	,autoLoad 	: false
	,bufferedRenderer: false
	,initComponent: function()
	{
		var me = this;
		if (Ext.isObject(me.viewConfig))
		{
			Ext.applyIf(me.viewConfig, {stripeRows: true , deferEmptyText : false});
		}
		else
		{
			me.viewConfig = {stripeRows: true , deferEmptyText : false};
		}
		

		if (Ext.isArray(me.columns))
		{
			Ext.Array.each(me.columns, function(column)
			{
				if (column.hasOwnProperty('columns'))
				{
					Ext.Array.each(column.columns, function(col)
					{
						if (me.applyFilter)		Ext.applyIf(col, {filter: {type: 'string'}});
					});
				}
				else
				{
					if (me.applyFilter)		Ext.applyIf(column, {filter: {type: 'string'}});
				}
			});
		}

		/**
		 * Grid Filter
		 */
		if (me.applyFilter)
		{
			me.applyPlugin({ptype: 'gridfilters'});
		}

		/*if (me.applyColTooltip)
		{
			me.applyPlugin({ptype: 'gridcolumntooltip'});
		}*/

		if (me.pagination == true)
		{
			me.store = Ext.data.StoreManager.lookup(me.store || 'ext-empty-store')
			if (!me.pageSlaps)
			{
				me.pageSlaps = [25, 50, 75, 100];
			}

			if (me.store.pageSize)
			{
				if (!Ext.Array.contains(me.pageSlaps), me.store.pageSize)
				{
					/**
					 * If the pageSize doesn't fall in the page slap, then update it.
					 */
					me.updatePageSlap();
				}
			}
			else
			{
				/**
				 * Sets default page size
				 */
				me.store.pageSize = me.pageSlaps[0];
			}

			me.bbar	= {
				xtype		: 'pagingtoolbar'
				,store		: me.store
				,displayInfo: true
				,displayMsg	: '<b>Displaying Records {0} - {1} of {2} </b>'
				,emptyMsg	: '<b>No Records to Display</b>'
				,plugins	: Ext.create('Ext.ux.ProgressBarPager', {})
				,listeners: {
                    beforechange: function (page, currentPage) 
                    {
                    	console.log(page);
                    	console.log(currentPage);
                        var myProxy = this.store.getProxy();                        
                        myProxy.params = {
                            MENU_NAME: '',
                            MENU_DETAIL: ''
                        };
                        myProxy.setExtraParam('page', currentPage-1);
                    }
                }
				,items		:
				[
					'-'
					,'->'
					,{
						xtype			: 'combo'
						,fieldLabel		: 'Show'
						,labelSeparator : ''
						,store			: me.pageSlaps
						,width			: 110
						,labelWidth		: 40
						,queryMode		: 'local'
						,value			: me.store.pageSize
						,forceSelection : true
						,listeners		:
						{
							select: function(combo, rec)
							{
								this.up('grid').getStore().pageSize = rec.get('field1');
								this.up('grid').child('pagingtoolbar').moveFirst();
							} 
						}
					}
					,{xtype: 'tbtext', text: 'Records Per Page'}
				]
			}
		}

		me.callParent(arguments);
	}
	,updatePageSlap: function()
	{
		var me = this, len, pageSize;
		len = me.pageSlaps.length;
		pageSize = me.store.pageSize;
		for (var i = 0; i < len; i++)
		{
			if (pageSize < me.pageSlaps[i])
			{
				Ext.Array.insert(me.pageSlaps, i, [pageSize]);
				break;
			}
			else if (i == len - 1)
			{
				me.pageSlaps.push(pageSize);
			}
		}
	}
	,applyPlugin: function(plugin)
	{
		var me = this;
		if (me.plugins)
		{
			if (me.plugins.length)
			{
				me.plugins.push(plugin);
			}
			else if ((typeof plugin == "string") || (typeof plugin == "object"))
			{
				me.plugins = [me.plugins, plugin];
			}
			else
			{
				throw new Error('Invalid Plugin Config: ' + this.$className);
			}
		}
		else
		{
			me.plugins = [plugin];
		}
	}
	,onDestroy: function()
	{
		var store = this.store;
		this.callParent();
		if (store)
		{
			store.destroy();
		}
	}
	,listeners	:
	{
		
		/*// This only works in Extjs 5 and later as this listeners not removed if overriden
		afterlayout: function(grid)
		{
			applyScroller(grid);
		}*/
	}
});

/**
*	Combo Field
*/
Ext.define('Ext.custom.form.field.ComboBox',
{
	extend 			: 'Ext.form.ComboBox'
	,xtype			: 'customcombo'
	,forceSelection	: true
	,typeAhead		: true
	,displayField   : 'name'
	,valueField		: 'id'
	,minChars		: 1
	,autoLoadOnValue: false
	,queryMode 		: 'local'
	//,anyMatch		: true
	,initComponent	: function()
	{
		var me = this;
		me.callParent(arguments);
	}
});

/**
 * Form Panel
 */
Ext.define('Ext.custom.form.Panel',
{
	extend			: 'Ext.form.Panel'
	,alias			: 'widget.customform'
	,scrollable		: true
	,bodyPadding	: '5px 5px 0px'
	,trackResetOnLoad: true
	,viewReadOnly	: false
	,initComponent	: function()
	{
		var me = this,
		fieldDefaults = {
				labelAlign	: 'left'
				,labelWidth	: 120
				,anchor		: '100%'
				,labelStyle	: 'font-weight:bold;'
				,labelSeparator: ''
		};

		if (me.fieldDefaults)
		{
			Ext.applyIf(me.fieldDefaults, fieldDefaults);
		}
		else
		{
			me.fieldDefaults = fieldDefaults;
		}

		if (me.viewReadOnly)
		{
			me.on({
				afterrender: me.makeReadOnly
				,scope: me
				,single: true
			});
		}
		me.callParent(arguments);
	}
	,makeReadOnly: function()
	{
		var fields = this.query('field[isFormField]');
		for (var i = 0, len = fields.length; i < len; i++)
		{
			fields[i].setReadOnly(true);
		}
	}
	,loadRecord: function(record)
	{
		this.setLoading(true);
		this.callParent(arguments);
		this.setLoading(false);
	}
});

/**
 * Window
 */
Ext.define('Ext.custom.window.Window',
{
	extend			: 'Ext.window.Window'
	,alias			: 'widget.customwindow'
	,cls			: 'x-custom-window'
	,autoShow 		: true
	,modal			: true
	,validateDirty	: true
	,draggable 		: false
	,monitorResize	: true
	,plugins		: 'responsive'
	/*,responsiveFormulas:
	{
		'window.desktop': function() {
			if (Ext.Element.getViewportWidth() >= this.cmp.maxWidth)
			{
				console.log(this.cmp.getInitialConfig('width'));
				console.log(Ext.Element.getViewportWidth());
				return true;
			}
			return false;
		}
		,'window.tablet': function() {
			if (Ext.Element.getViewportWidth() < this.cmp.maxWidth)
			{
				return true;
			}
			return false;
		}
	}*/
	/*,responsiveConfig:
	{
		'width >= 1000': {
			width: 700
		}
		,'width < 1000 && width >= 700': {
			width: 500
		}
		,'width < 700': {
			width: 300
		}
	}*/
	,initComponent	: function()
	{
		var me = this;
		me.callParent(arguments);
	}
	,beforeCloseWin: function()
	{
		var me = this;
		me.validateWinBeforeClose();
	}
	,onEsc	: function()
	{
		this.validateWinBeforeClose();
	}
	,validateWinBeforeClose : function()
	{
		var me = this;
		var form = me.down('form');
		if(form && !form.viewReadOnly && form.isDirty() && me.validateDirty)
		{
			Utilities.showAlert("Info", getLabel('FORM.DIRTY.CLOSE'), Ext.Msg.WARNING, Ext.Msg.YESNO, function(btn)
			{
				if (btn == 'yes')
				{
					me.close();
				}
			});
		}
		else
		{
			me.close();
		}
	}
	,initTools: function()
	{
		var me = this,
			tools = me.tools,
			i, tool;

		me.tools = [];
		for (i = tools && tools.length; i; ) {
			--i;
			me.tools[i] = tool = tools[i];
			tool.toolOwner = me;
		}

		// Add a collapse tool unless configured to not show a collapse tool
		// or to not even show a header.
		if (me.collapsible && !(me.hideCollapseTool || me.header === false || me.preventHeader)) {
		me.updateCollapseTool();
		// Prepend collapse tool is configured to do so.
		if (me.collapseFirst) {
			me.tools.unshift(me.collapseTool);
		}
		}

		// Add subclass-specific tools.
		me.addTools();
		
		if (me.pinnable) {
			me.initPinnable();
		}

		// Make Panel closable.
		if (me.closable) {
			me.addClsWithUI('closable');
			me.addTool({
				xtype : 'tool',
				type: 'close',
				scope: me,
				handler: me.beforeCloseWin
			});
		}

		// Append collapse tool if needed.
		if (me.collapseTool && !me.collapseFirst) {
			me.addTool(me.collapseTool);
		}
	}
	//Private
	,onWindowResize: function()
	{
		this.callParent(arguments);
		this.setMaxWidth(Ext.Element.getViewportWidth());
		this.setWidth(this.getUpdatedWidth());
		this.setMaxHeight(Ext.Element.getViewportHeight());
		//this.setHeight(this.getUpdatedHeight());
		this.center();
	}
	,getUpdatedWidth: function()
	{
		var initialWidth = this.getInitialConfig('width');
		var viewportWidth = Ext.Element.getViewportWidth();
		return viewportWidth >= initialWidth ? initialWidth : viewportWidth;
	}
	,getUpdatedHeight: function()
	{
		var initialHeight = this.getInitialConfig('height');
		var viewportHeight = Ext.Element.getViewportHeight();
		return viewportHeight >= initialHeight ? initialHeight : viewportHeight;
	}
});

/**
 *  Grid Tool Bar Button custom class
 */
Ext.define('Ext.custom.tbar.Button',
{
	extend			: 'Ext.Button'
	,alias			: 'widget.customtbarbutton'
	,cls			: 'x-custom-tbar-btn'
	,iconCls		: 'x-atp-add'
	,text			: 'Add Record'
	,initComponent	: function()
	{
		var me = this;
		me.callParent(arguments);
	}
});

/**
 *  Form Submission button custom class
 */
Ext.define('Ext.custom.form.submit.Button',
{
	extend			: 'Ext.Button'
	,alias			: 'widget.customformsubmitbutton'
	,cls			: 'x-custom-form-btn'
	,iconCls		: 'x-tab-save'
	,scale			: 'medium'
	,text			: 'Save'
	,formBind 		: true
	,initComponent	: function()
	{
		var me = this;
		me.callParent(arguments);
	}
});

/**
 *  Form Cancel button custom class
 */
Ext.define('Ext.custom.form.cancel.Button',
{
	extend			: 'Ext.Button'
	,alias			: 'widget.customformcancelbutton'
	,cls			: 'x-custom-form-btn'
	,iconCls		: 'x-tab-cancel'
	,scale			: 'medium'
	,text			: 'Cancel'
	,initComponent	: function()
	{
		var me = this;
		me.callParent(arguments);
	}
	,handler : function()
	{
		var window = this.up('window');
		if (window.beforeCloseWin)	window.beforeCloseWin();
		else	window.close();
	}
});

/**
 * 	Custom Ext.form.VTypes
 */
Ext.apply(Ext.form.VTypes,
{
	dateRange : function(val, field)
	{
		var date = field.parseDate(val);
		
		if(!date){
			return false;
		}
		if (field.startDateItemId)
		{
			var start = field.prev('datefield#' + field.startDateItemId);
			if (!start.maxValue || (date.getTime() != start.maxValue.getTime()))
			{
				start.setMaxValue(date);
				start.validate();
			}
		}
		else if (field.endDateItemId)
		{
			var end = field.next('datefield#' + field.endDateItemId);
			if (!end.minValue || (date.getTime() != end.minValue.getTime()))
			{
				end.setMinValue(date);
				end.validate();
			}
		}
		/*
		 * Always return true since we're only using this vtype to set the
		 * min/max allowed values
		 */
		return true;
	}
});

Ext.apply(Ext.form.VTypes,
{
	/**
	 * Currently keyStroke filtering doesn't work in numberfield, use textfield instead
	 */
	mobileNo:  function(v)
	{
		return /^([\d]{10})$/.test(v); 
		//return /^(([0-9]{10}))$/.test(v);
		//return /^([\d]{6,10})$/.test(v);  
	}
	,mobileNoText: 'Exact 10 digits number allowed'
	,mobileNoMask:  /[\d\+]/i
	//,mobileNoMask:  /[0-9]/i
});

Ext.apply(Ext.form.field.VTypes,
{
	colorHexCode:  function(v)
	{
		return /^(#+[A-F0-9]{6})$/.test(v);
	}
	,colorHexCodeText: 'Letters A-F in upper case and digits are allowed'
	,colorHexCodeMask: /[A-F0-9#]/i
});

Ext.apply(Ext.form.field.VTypes,
{
	onlyNumber:  function(v)
	{
		return /^([\d]{*})$/.test(v);
	}
	,onlyNumberMask: /[\d\+]/i
});

Ext.apply(Ext.form.field.VTypes,
{
	textWithSpace:  function(v)
	{
		return /^[a-zA-Z ]+$/.test(v);
	}
	,textWithSpaceText: 'Letters A-Z and space only allowed'
	,textWithSpaceMask: /[a-zA-Z9 ]/i
});

Ext.apply(Ext.form.VTypes, 
{
		password: function (val, field)
		{
			if (field.initialPassField)
			{
				var matchnewpass 	= Ext.ComponentQuery.query('#changePasswordForm')[0];
				var login = matchnewpass.down('[name=newPassword]');
				this.passwordText = 'Confirmation does not match your intial password entry.';
				return (val == login.getValue());
			}

			this.passwordText = 'Passwords must adhere to the following <li align="left">Must contain at least 6 characters.<li align="left">Must contain one or more alphabets.<li align="left">Must contain one or more numbers.<li align="left">Must contain one or more valid special characters <br>(!@#$%^&*()-_=+)';
			var hasAlphabets = val.match(/[a-zA-Z]+/i);
			var hasNumbers = val.match(/[0-9]+/i);
			var hasSpecial = val.match(/[!@#\$%\^&\*\(\)\-_=\+]+/i);
			return (hasAlphabets && hasSpecial && hasNumbers && val.length >= 6);
		}
});

/**
 * 	End of Custom Ext.form.VTypes
 */

/**
 * MenuTool
 */
Ext.define('MenuTool',
{
	extend		: 'Ext.panel.Tool'
	//,alias	: 'widget.menutool'
	,xtype		: 'menutool'
	,type		: 'gear'
	,privates	:
	{
		onClick	: function(e, target)
		{
			var me = this,
			returnValue = me.callParent(arguments);
			if (returnValue && me.items)
			{
				if (!me.toolMenu)
				{
					me.toolMenu = new Ext.menu.Menu({
						items: me.items
						,menutool: me
					});
				}
		
				me.toolMenu.showBy(me.ownerCt, 'tr-br');
			}
		}
	}
	,onDestroy: function()
	{
		Ext.destroyMembers(this, 'toolMenu');
		this.callParent();
	}
});

/**
 * @author rabindranath.s
 * Custom Search Field is meant for to put in grid tool bar for applying custom filter
 * @cfg {array} filters e.g [{operator:"like",value:"",type:"string",fieldName:"name"}]
 * operator and type are optional and default to "like" and "string" respectively
 */
Ext.define('Ext.grid.field.Search',
{
	extend		: 'Ext.form.field.Text'
	,requires	: 'Ext.form.field.Text'
	,xtype		: 'gridsearchfield'
	,height		: 25
	,enableKeyEvents:true
	,width		: 200
	//,hideTrigger: true
	/**
	 * This line to be deleted
	 */
	,searchParam: 'searchParam'
	/**
	 * @cfg {array} filters
	 * e. g. [{operator:"like", type:"string", fieldName:"skuNo"}, {operator:"like", type:"string", fieldName:"mobileNo"}]
	 * operator and type are optional and default to "like" and "string" respectively
	 */
	,filters	: []
	,initComponent: function()
	{
		var me = this;

		me.filterParam = 'search';

		for (var i = 0; i < me.filters.length; i++)
		{
			Ext.applyIf(me.filters[i], {operator: 'like', type:"string"});
		}
		me.callParent();
	}
	,triggers	: 
	{
		clear: 
		{
			weight	: 0
			,cls	: Ext.baseCSSPrefix + 'form-clear-trigger'
			,hidden	: true
			,handler: function ()
			{
				this.reset();
				//this.clearContent();
			}
		},
		search: 
		{
			weight	: 1
			,cls	: Ext.baseCSSPrefix + 'form-search-trigger'
			,handler: function ()
			{
				this.searchContent();
			}
		}
	}
	,onChange	: function()
	{
		//this.setHideTrigger(!this.getValue());
		var clearTrigger = this.getTrigger('clear');
		clearTrigger[this.getValue() ? 'show' : 'hide'].apply(clearTrigger);
		if (!this.getValue())	this.clearContent();
		this.callParent();
	}
	,searchContent	:	function()
	{
		var me = this, searchText, grid, filters;

		searchText = me.getValue();
		grid = me.up('grid');
		filters = me.filters;
		if (searchText)
		{
			if (filters.length)
			{
				for (var i = 0; i < filters.length; i++)
				{
					filters[i].value = (filters[i].type == 'numeric' || filters[i].type == 'number') ? parseInt(searchText) : searchText;
				}

				grid.store.getProxy().setExtraParam(me.filterParam, Ext.encode(filters));
			}
			else
			{
				/**
				 * This line to be deleted
				 */
				grid.store.getProxy().setExtraParam(me.searchParam, searchText);
			}
			grid.store.load();
		}
		else
		{
			me.clearContent();
		}
	}
	,clearContent	: 	function()
	{
		var me = this, extraParams, grid;

		grid = me.up('grid');
		extraParams = grid.store.getProxy().getExtraParams();
		if (extraParams.hasOwnProperty(me.filterParam))  delete extraParams[me.filterParam];
		/**
		 * This line to be deleted
		 */
		if (extraParams.hasOwnProperty(me.searchParam))  delete extraParams[me.searchParam];
		grid.store.load();
	}
	,listeners	:
	{
		specialkey: function(field, e)
		{
			if (e.getKey() == e.ENTER) 
			{
				this.searchContent();
			}
		}
	}
});

/**
 * @author rabindranath.s
 */
Ext.define('Ext.button.MenuButton',
{
	alias: 'widget.menubutton'
	,extend: 'Ext.button.Button'
	,requires: ['Ext.button.Button']
	,renderTpl: 
		'<span id="{id}-btnWrap" data-ref="btnWrap" role="presentation" unselectable="on" style="{btnWrapStyle}" class="{btnWrapCls} {btnWrapCls}-{ui} {splitCls}{childElCls}">' +
			'<span id="{id}-btnEl" data-ref="btnEl" role="presentation" unselectable="on" style="{btnElStyle}" class="{btnCls} {btnCls}-{ui} {textCls} {noTextCls} {hasIconCls} {iconAlignCls} {textAlignCls} {btnElAutoHeightCls}{childElCls}">' +
				'<tpl if="iconBeforeText">{[values.$comp.renderIcon(values)]}</tpl>' +
				'<span id="{id}-btnInnerEl" data-ref="btnInnerEl" unselectable="on" class="{innerCls} {innerCls}-{ui}{childElCls}">{text}</span>' +
				'<tpl if="!iconBeforeText">{[values.$comp.renderIcon(values)]}</tpl>' +
			'</span>' +
			'<span id="{id}-btnNotificationEl" data-ref="btnNotificationEl" class="{btnCls} {btnCls}-{ui} {textAlignCls} {btnElAutoHeightCls} <tpl if="notification">{notificationCls}</tpl>">' +
				'<tpl if="notification">{notification}</tpl>' +
			'</span>' +
		'</span>' +
		'{[values.$comp.getAfterMarkup ? values.$comp.getAfterMarkup(values) : ""]}' +
		// if "closable" (tab) add a close element icon
		'<tpl if="closable">' +
			'<span id="{id}-closeEl" data-ref="closeEl" class="{baseCls}-close-btn">' +
				'<tpl if="closeText">{closeText}</tpl>' +
			'</span>' +
		'</tpl>'
	,getTemplateArgs: function()
	{
		return Ext.apply(this.callParent(), {notification: this.notification, notificationCls: this.notificationCls});
	}
	,childEls: ['btnEl', 'btnWrap', 'btnInnerEl', 'btnIconEl', 'btnNotificationEl']
	,setNotification: function(v)
	{
		this.btnNotificationEl.setHtml(v || '');
		if (v)
		{
			if (!this.btnNotificationEl.hasCls(this.notificationCls))	this.btnNotificationEl.addCls(this.notificationCls);
		}
		else
		{
			this.btnNotificationEl.removeCls(this.notificationCls);
		}
		this.up('toolbar').updateLayout({isRoot: true});
	}
	,getNotification: function(v)
	{
		var value = this.btnNotificationEl.getHtml();
		var trimedValue =  value.trim();

		return (trimedValue ? parseInt(trimedValue) : 0);
	}
});



/**
 * @author rabindranath.s
 */
Ext.define('Ext.form.field.RowEditorTime',
{
	extend		: 'Ext.form.field.Time'
	,requires	: 'Ext.form.field.Time'
	,alias		: 'widget.roweditortimefield'
	,alternateClassName: ['Ext.form.RowEditorTimeField', 'Ext.form.RowEditorTime']
	,getValue	: function()
	{
		/**
		 * Temporal solution
		 * It by passes some validation
		 * Need some improvement
		 */
		var me = this,
		date = me.rawToValue(me.processRawValue(me.getRawValue()));
		if(date != '' && date != null)
		return Ext.Date.format(date, me.format);
		return null;
	}
	/*,getValue	: function()
	{
		console.log(this.self.getName());
		console.log(Ext.getClass(this).superclass.self.getName());
		return this.rawToValue(this.callParent(arguments));
	}*/
});

/**
 * @author rabindranath.s
 * Filter Combo Field is meant for to put in grid tool bar for applying custom filter
 * @cfg {object} filter e.g {operator:"like", type:"string", property:"name"}
 * operator and type are optional and default to "eq" and "string" respectively
 */
/**
 * Note: Take care not to match any filter property config with any column dataIndex
 */
Ext.define('Ext.field.FilterComboBox',
{
	extend		: 'Ext.custom.form.field.ComboBox'
	,alternateClassName: ['Ext.field.FilterCombo']
	,xtype		: ['filtercombo', 'filtercombobox']
	,fieldLabel	: 'Filter By'
	,labelWidth	: 60
	,labelStyle	: 'font-weight: bold;'
	,width		: 400
	,filter		: null
	,triggers	:
	{
		clear: 
		{
			weight	: -1
			,cls	: Ext.baseCSSPrefix + 'form-clear-trigger'
			,hidden	: true
			,handler: function ()
			{
				this.reset();
			}
		}
	}
	,initComponent: function()
	{
		var fieldName = this.getMappingByDataIndex(this.up('grid').store, this.filter.property);
		this.filterConfig = {operator: 'eq', type: 'string', property: 'id'};
		Ext.apply(this.filterConfig, this.filter, {id: this.filter.property, fieldName: fieldName});
		this.callParent(arguments);
	}
	,onChange	: function(newVal, oldVal)
	{
		var clearTrigger = this.getTrigger('clear');
		clearTrigger[newVal ? 'show' : 'hide'].apply(clearTrigger);
		this.callParent(arguments);
		this.filterByStoreFilter(this.up('grid').store, Ext.apply(this.filterConfig, {value: newVal ? newVal + '' : newVal}));
	}
	,filterByStoreFilter: function(store, filterConfig)
	{
		var me = this;
		/**
		 * Removes all filters from the store
		 */
		//store.clearFilter(true/*suppressEvent*/);

		/**
		 * Use this method to apply filter via store
		 */
		if (filterConfig.value)
		{
			store.addFilter(filterConfig);
		}
		else
		{
			store.removeFilter(filterConfig.id);
		}
		//console.log(store.getFilters());
	}
	,getMappingByDataIndex: function(store, dataIndex)
	{
		var model = store.getModel();
		var field = model && model.getField(dataIndex);
		return (field && (field.fieldName || field.mapping )) || dataIndex;
	}
	
});

/**
 * @author rabindranath.s
 */
Ext.define('Ext.grid.column.Action.Print',
{
	extend	: 'Ext.grid.column.Action'
	,alias	: ['widget.printactioncolumn']
	,text	: 'Print'
	,width	: 50
	,align	: 'center'
	,url	: ''
	,tooltip: 'Print'
	,handler: function(view, rowIndex, colIndex, obj, e, rec, rowNode)
	{
		view.getSelectionModel().select(rec);
		window.open(this.url + rec.get('id'), "_blank");
	}
	,getClass	: function(value, metaData, r)
	{
		return (r.get('jurisdiction')) ? 'x-print-action-icon' : 'x-print-no-action-icon';
	}
	,initComponent: function()
	{
		var me = this;
		me.callParent(arguments);
	}
});

/**
 * @author rabindranath.s
 */
Ext.define('Ext.form.field.CustomNumberField',
{
	extend	: 'Ext.form.field.Number'
	,alias	: 'widget.customnumberfield'
	,mouseWheelEnabled: false
	,minValue: 0
});
