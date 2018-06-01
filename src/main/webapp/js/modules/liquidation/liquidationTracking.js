/**
 * @author rabindranath.s
 */

var LIQUIDATION_TRACKING =	
{
	init: function()
	{
		this.defineTopTenRetailerSale();
	}
	,seasons: null
	,crops	: null
	,retailers: null
	,defineTopTenRetailerSale : function()
	{
		Ext.define('ATP.model.TOP_TEN_RETAILER_SALE',
		{
			extend	: 'Ext.data.Model'
			,fields	:
			[
				 {	name: 'id'														}
				,{	name: 'retailerName'			,mapping: 'retailerInfo.name'	}
				,{	name: 'retailerInfo'			,mapping: 'retailerInfo.id'		}
				,{	name: 'competitor1'				,mapping: 'competitor1.name'	}
				,{	name: 'competitor2'				,mapping: 'competitor2.name'	}
				,{	name: 'retailerMobileNo'		,mapping: 'retailerMobileNo'	}
				,{	name: 'pioneerSales'			,mapping: 'pioneerSales'		}
				,{	name: 'competitor1Sales'		,mapping: 'competitor1Sales'	}
				,{	name: 'competitor2Sales'		,mapping: 'competitor2Sales'	}
				,{	name: 'otherSales'				,mapping: 'otherSales'			}
				,{	name: 'totalCounterPotential'	,mapping: 'totalCounterPotential'}
			]
			,clientIdProperty: 'clientId'
			,validators:
			[
				 {type: 'presence'	,field: 'retailerInfo'		}
				,{type: 'presence'	,field: 'pioneerSales'		}
				,{type: 'presence'	,field: 'competitor1Sales'	}
				,{type: 'presence'	,field: 'competitor2Sales'	}
				,{type: 'presence'	,field: 'otherSales'		}
				,{type: 'presence'	,field: 'totalCounterPotential'}
			]
		});
	}
	,getSeasons: function()
	{
		if(!this.seasons)
		{
			this.seasons = Ext.create('Ext.data.ComboStore',
			{
				autoLoad	: true
				,autoDestroy: false
				,proxy		: 
				{
					type	: 'ajax'
					,url	: './comboData?actionType=seasonService'
					,reader	: 'combojsonreader'
				}
			});
		}

		return this.seasons;
	}
	,getCrops: function()
	{
		if(!this.crops)
		{
			this.crops = Ext.create('Ext.data.ComboStore',
			{
				autoLoad	: true
				,autoDestroy: false
				,proxy		: 
				{
					type	: 'ajax'
					,url	: './comboData?actionType=cropService'
					,reader	: 'combojsonreader'
				}
			});
		}

		return this.crops;
	}
	,getYears: function()
	{
		var years = [], startYear = 2014, endYear = Ext.Date.format(new Date(), 'Y');

		for (var i = startYear; i <= endYear; i++)
		{
			years.push(i);
		}

		return years;
	}
	,getRetailers: function()
	{
		if(!this.retailers)
		{
			this.retailers = Ext.create('Ext.data.ComboStore',
			{
				autoLoad	: true
				,autoDestroy: false
				,proxy		: 
				{
					type	: 'ajax'
					,url	: './comboData?actionType=retailerInfoService'
					,reader	: 'combojsonreader'
				}
			});
		}

		return this.retailers;
	}
	,getTopTenRetailerSales: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.getTopTenRetailers
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
		{
			 model		: 'ATP.model.TOP_TEN_RETAILER_SALE'
			,proxy		: proxy
			,remoteSort	: false
			,remoteFilter: false
			,autoLoad	: false
			,pageSize	: 0
		});
	}
	,getLiquidationTrackingPanel: function()
	{
		var me = this;
		var panel = {
			xtype		: 'panel'
			,itemId		: 'mainPanel'
			,flex		: 1
			,layout		: {type: 'hbox'}
			,defaults	: {height: '100%'}
			,tbar		:
			[
				{
					xtype		: 'customtbarbutton'
					,text		: 'Save'
					,disabled	: true
					,action		: 'save'
					,handler	: me.saveLiquidationTracking.bind(me)
				},{
					xtype		: 'customcombo'
					,store		: me.getSeasons()
					,fieldLabel	: 'Season'
					,name		: 'season'
					,labelWidth	: 55
					,emptyText	: 'Select Season'
					,flex		: 1
					,maxWidth	: 200
					,listeners	: me.getToolbarFieldsListeners()
				},{
					xtype		: 'customcombo'
					,store		: me.getCrops()
					,fieldLabel	: 'Crop'
					,name		: 'crop'
					,labelWidth	: 55
					,emptyText	: 'Select Crop'
					,flex		: 1
					,maxWidth	: 180
					,listeners	: me.getToolbarFieldsListeners()
				},{
					xtype		: 'customcombo'
					,store		: me.getYears()
					,fieldLabel	: 'Conducted Year'
					,name		: 'year'
					,labelWidth	: 100
					//,emptyText	: 'Select Year'
					,flex		: 1
					,maxWidth	: 170
					,listeners	: me.getToolbarFieldsListeners()
				}
			]
			,items		:
			[
				{
					xtype		: 'customform'
					,itemId		: 'teritoryMaster'
					,trackResetOnLoad: false
					//,flex		: 1
					,width		: 250
					,title		: 'Territory Master'
					,fieldDefaults: {labelAlign	: 'top'}
					,items		:
					[
						{
							xtype		: 'hidden'
							,name		: 'id'
						},{
							xtype		: 'fieldcontainer'
							,layout		: 'hbox'
							,items		:
							[
								{
									xtype		: 'customnumberfield'
									,fieldLabel	: 'Pioneer Sales (Kg)'
									,name		: 'pioneerSales'
									,listeners	: me.getTeritorySalesFieldsListeners()
									,flex		: 1
										
								},{
									xtype		: 'tbtext'
									,html		: '0%'
									,margin		: {top: 30}
									,width		: 60
								}
							]
						}/*,{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Pioneer Sales'
							,name		: 'pioneerSales'
							,listeners	: me.getTeritorySalesFieldsListeners()
						}*/,{
							xtype		: 'fieldcontainer'
							,layout		: 'hbox'
							,items		:
							[
								{
									xtype		: 'customnumberfield'
									,fieldLabel	: 'Competitor1 Sales (Kg)'
									,name		: 'competitor1Sales'
									,listeners	: me.getTeritorySalesFieldsListeners()
									,flex		: 1
										
								},{
									xtype		: 'tbtext'
									,html		: '0%'
									,margin		: {top: 30}
									,width		: 60
								}
							]
						}/*,{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Competitor1 Sales'
							,name		: 'competitor1Sales'
							,listeners	: me.getTeritorySalesFieldsListeners()
						}*/,{
							xtype		: 'fieldcontainer'
							,layout		: 'hbox'
							,items		:
							[
								{
									xtype		: 'customnumberfield'
									,fieldLabel	: 'Competitor2 Sales (Kg)'
									,name		: 'competitor2Sales'
									,listeners	: me.getTeritorySalesFieldsListeners()
									,flex		: 1
										
								},{
									xtype		: 'tbtext'
									,html		: '0%'
									,margin		: {top: 30}
									,width		: 60
								}
							]
						}/*,{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Competitor2 Sales'
							,name		: 'competitor2Sales'
							,listeners	: me.getTeritorySalesFieldsListeners()
						}*/,{
							xtype		: 'fieldcontainer'
							,layout		: 'hbox'
							,items		:
							[
								{
									xtype		: 'customnumberfield'
									,fieldLabel	: 'Other Sales (Kg)'
									,name		: 'otherSales'
									,listeners	: me.getTeritorySalesFieldsListeners()
									,flex		: 1
										
								},{
									xtype		: 'tbtext'
									,html		: '0%'
									,margin		: {top: 30}
									,width		: 60
								}
							]
						}/*,{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Other Sales'
							,name		: 'otherSales'
							,listeners	: me.getTeritorySalesFieldsListeners()
						}*/,{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Total Territory Sales (Kg)'
							,name		: 'totalTerritorySales'
							,readOnly	: true
							,listeners	:
							{
								update: function(field, editedField)
								{
									var form = this.up('form');
									var pioneerSalesField = form.down('numberfield[name=pioneerSales]');
									var pioneerSales = pioneerSalesField.getValue() || 0;
									var competitor1SalesField = form.down('numberfield[name=competitor1Sales]');
									var competitor1Sales = competitor1SalesField.getValue() || 0;
									var competitor2SalesField = form.down('numberfield[name=competitor2Sales]');
									var competitor2Sales = competitor2SalesField.getValue() || 0;
									var otherSalesField = form.down('numberfield[name=otherSales]');
									var otherSales = otherSalesField.getValue() || 0;
									var totalSales = pioneerSales + competitor1Sales + competitor2Sales + otherSales;
									field.setValue(totalSales);

									pioneerSalesField.next('tbtext', 1).setHtml((totalSales == 0 ? 0 : (pioneerSales / totalSales * 100).toFixed(2)) + "%");
									competitor1SalesField.next('tbtext', 1).setHtml((totalSales == 0 ? 0 : (competitor1Sales / totalSales * 100).toFixed(2)) + "%");
									competitor2SalesField.next('tbtext', 1).setHtml((totalSales == 0 ? 0 : (competitor2Sales / totalSales * 100).toFixed(2)) + "%");
									otherSalesField.next('tbtext', 1).setHtml((totalSales == 0 ? 0 : (otherSales / totalSales * 100).toFixed(2)) + "%");

									var representationField = field.next('numberfield[name=representation]');
									representationField.fireEvent('update', representationField);
								}
							}
						},{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Representation in %'
							,name		: 'representation'
							,readOnly	: true
							,listeners	:
							{
								update: function(field, fn, value)
								{
									if (value)
									{
										field.totalCounterPotential = value;
									}
									var totalTerritorySales = this.prev('numberfield[name=totalTerritorySales]').getValue() || 0;
									var representation = totalTerritorySales == 0 ? 0 : ((field.totalCounterPotential || 0) / totalTerritorySales * 100);
									field.setValue(representation);
									field.setFieldStyle((parseFloat(representation) < 30) ? 'font-weight:bold; color:red;' : 'font-weight:bold; color:green;');
								}
							}
						}
					]
				},{
					xtype		: 'splitter'
					,style		: 'background-color:#a9a9a9;'
					,width		: 2
				}
				,me.getTopTenRetailerSalesGrid()
			]
		};

		return panel;
	}
	,getTopTenRetailerSalesGrid: function()
	{
		var me			=	this;
		var topTenRetailerSalesGrid	=	{
			xtype		: 'customgrid'
			,itemId		: 'topTenRetailerSalesGrid'
			,title		: 'Top Ten Retailer Master (<span style="color: green;">All units are in Kg</span>)'
			,flex		: 1
			,store		: me.getTopTenRetailerSales()
			,plugins	: [me.getRowEditingPlugin()]
			,applyFilter: false
			,pagination	: false
			,enableColumnHide: false
			,features	: [{ftype: 'summary'	,showSummaryRow: true}]
			,columns	: 
			[
				 {xtype	: 'rownumberer'}
				,{	text : 'Retailer Id'		,dataIndex : 'retailerInfo'	,hidden	: true	,enableColumnHide : false	,hideable: false
						,editor		:
						{
							xtype		: 'numberfield'
							,itemId		: 'retailerInfo'
							,readOnly	: true
							,hidden		: true
						}
					 }
				,{	text : 'Retailer'					,dataIndex : 'retailerName'		//,flex: 1
					,summaryType	: 'count'
					,summaryRenderer: function(value, summaryData, dataIndex) {return 'Total';}
					,editor		:
					{
						 xtype		: 'customcombo'
						,allowBlank	: false
						,preventMark: true
						,store		: me.getRetailers()
						,displayField: 'name'
						,valueField	: 'name'
						/*,onDestroy: function()
						{
							if (this.getStore())	this.getStore().destroy();
							this.callParent(arguments);
						}*/
						,listeners  :
						{
							select: function(combo, rec)
							{
								var retailerId = rec.get('id');
								combo.up('form').down('#retailerInfo').setValue(retailerId);
							}
						}
					}
				}
				,{	text : 'Pioneer Sales'				,dataIndex : 'pioneerSales'
					,summaryType: 'sum'
					,editor:	 {xtype: 'numberfield'	,allowBlank: false, name: 'pioneerSales', listeners: me.getGridEditorFieldsListeners()}
					,summaryRenderer: me.commonSummuryRenderer
				}
				,{	text : 'Competitor1 Sales'			,dataIndex : 'competitor1Sales'
					,summaryType: 'sum'
					,editor:	 {xtype: 'numberfield'	,allowBlank: false, name: 'competitor1Sales', listeners: me.getGridEditorFieldsListeners()}
					,summaryRenderer: me.commonSummuryRenderer
				}
				,{	text : 'Competitor2 Sales'			,dataIndex : 'competitor2Sales'
					,summaryType: 'sum'
					,editor:	 {xtype: 'numberfield'	,allowBlank: false, name: 'competitor2Sales', listeners: me.getGridEditorFieldsListeners()}
					,summaryRenderer: me.commonSummuryRenderer
				}
				,{	text : 'Other Sales'				,dataIndex : 'otherSales'
					,summaryType: 'sum'
					,editor:	 {xtype: 'numberfield'	,allowBlank: false, name: 'otherSales', listeners: me.getGridEditorFieldsListeners()}
					,summaryRenderer: me.commonSummuryRenderer
				}
				,{	text : 'Total Counter Potential'	,dataIndex : 'totalCounterPotential'
					,summaryType: 'sum'
					,summaryRenderer: function(value, summaryData, dataIndex)
					{
						var grid = this.up('grid#topTenRetailerSalesGrid');
						var form = grid.prev('form');
						var representationField = form.down('numberfield[name=representation]');
						if (value > 0) representationField.fireEvent('update', representationField, null, value);
						return value;
					}
					,editor:	 {xtype: 'numberfield'	,allowBlank: false, readOnly: true, name: 'totalCounterPotential'}}
			]
		};

		return topTenRetailerSalesGrid;
	}
	,getRowEditingPlugin: function()
	{
		var me = this;
		return {
			ptype			: 'rowediting'
			,errorSummary	: false
			,autoCancel		: false
			,pluginId		: 'rowEditing'
			,listeners		:
			{
				edit: function(editor, context, e)
				{
					context.grid.getView().refresh();
				}
			}
		};
	}
	,getTeritorySalesFieldsListeners: function()
	{
		return {
			change: function(field)
			{
				var totalTerritorySalesField = field.up('fieldcontainer').next('numberfield[name=totalTerritorySales]');
				totalTerritorySalesField.fireEvent('update', totalTerritorySalesField);
			}
		};
	}
	,getToolbarFieldsListeners: function()
	{
		var me = this;
		return {
			select: function(field)
			{
				me.fetchCompetitors(field);
			}
		};
	}
	,fetchCompetitors: function(field)
	{
		var me = this;
		var mainPanel = field.up('panel#mainPanel', 2);
		var toolbar = field.up('toolbar', 1);
		var seasonId = toolbar.down('combo[name=season]').getValue();
		var cropId = toolbar.down('combo[name=crop]').getValue();
		var year = toolbar.down('combo[name=year]').getValue();
		if (seasonId && cropId && year)
		{
			mainPanel.body.mask();
			var loadMask = U.showLoadMask(mainPanel).show();
			Ext.Ajax.request(
			{
				url 		: ATP.Urls.fetchCompetitors
				,method		: 'POST'
				,params   	: {seasonId: seasonId, cropId: cropId}
				,success	: function (response) 
				{
					loadMask.destroy();
					var responseData = Ext.decode(response.responseText);
					if(responseData.success)
					{
						var teritoryMasterForm = mainPanel.down('form#teritoryMaster');
						teritoryMasterForm.down('numberfield[name=competitor1Sales]').setFieldLabel(responseData.competitor1 + ' Sales');
						teritoryMasterForm.down('numberfield[name=competitor2Sales]').setFieldLabel(responseData.competitor2 + ' Sales');
						me.insertRecords(field);
						mainPanel.body.unmask();
					}
					else
					{
						U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), responseData.message, Ext.Msg.ERROR);
					}
				}
				,failure: function (response) 
				{
					loadMask.destroy();
					U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), "Unable To Fetch.", Ext.Msg.ERROR);
				}
			});
		}
	}
	,getGridEditorFieldsListeners: function()
	{
		return {
			change: function(field)
			{
				var form = field.up('form');
				var totalCounterPotentialField = form.down('numberfield[name=totalCounterPotential]');
				var pioneerSales = form.down('numberfield[name=pioneerSales]').getValue() || 0;
				var competitor1Sales = form.down('numberfield[name=competitor1Sales]').getValue() || 0;
				var competitor2Sales = form.down('numberfield[name=competitor2Sales]').getValue() || 0;
				var otherSales = form.down('numberfield[name=otherSales]').getValue() || 0;
				totalCounterPotentialField.setValue(pioneerSales + competitor1Sales + competitor2Sales + otherSales);
			}
		};
	}
	,insertRecords: function(field)
	{
		var me = this;
		var mainPanel = field.up('panel#mainPanel', 2);
		var toolbar = field.up('toolbar', 1);
		var seasonId = toolbar.down('combo[name=season]').getValue();
		var cropId = toolbar.down('combo[name=crop]').getValue();
		var year = toolbar.down('combo[name=year]').getValue();
		var grid = mainPanel.down('grid#topTenRetailerSalesGrid');
		var teritoryMasterForm = mainPanel.down('form#teritoryMaster');
		toolbar.down('button[action=save]').setDisabled(!(seasonId && cropId && year));
		var editingPlugin = grid.findPlugin('rowediting');
		if (editingPlugin.editing)	editingPlugin.cancelEdit();
		if (seasonId && cropId && year)
		{
			mainPanel.setLoading(true);
			grid.getStore().getProxy().setExtraParams({seasonId: seasonId, cropId: cropId, conductedYear: year});
			Ext.Ajax.request(
			{
				url 		: ATP.Urls.isExistLiquidtionTracking
				,method		: 'POST'
				,params   	: {seasonId: seasonId, cropId: cropId, conductedYear: year}
				,success	: function (response) 
				{
					var responseData = Ext.decode(response.responseText);
					if(responseData.success)
					{
						if(responseData.isExist)
						{
							grid.getStore().load();
							teritoryMasterForm.getForm().setValues(responseData.data);
						}
						else
						{
							teritoryMasterForm.reset();
							grid.getStore().removeAll();
							if (grid.getStore().getCount() === 0)
							{
								for (var i = 0; i < 10; i++)
								{
									//var editingPlugin = grid.findPlugin('rowediting');
									//if (editingPlugin.editing)	editingPlugin.cancelEdit();
									//var r = Ext.create(grid.getStore().getModel().getName(), {});
									grid.getStore().add({pioneerSales: 0, competitor1Sales: 0, competitor2Sales: 0, otherSales: 0, totalCounterPotential: 0});
									//grid.getStore().insert(0, r);
									//editingPlugin.startEdit(0, 0);
								}
							}
							grid.getView().refresh();
						}
					}
					else
					{
						
					}
					mainPanel.setLoading(false);
				}
				,failure: function (response) 
				{
					
				}
			});
		}
	}
	,saveLiquidationTracking: function(btn)
	{
		var me = this;
		var mainPanel = btn.up('panel#mainPanel', 2);
		var teritoryMasterForm = mainPanel.down('form#teritoryMaster');
		var toolbar = btn.up('toolbar', 1);
		var seasonId = toolbar.down('combo[name=season]').getValue();
		var cropId = toolbar.down('combo[name=crop]').getValue();
		var conductedYear = toolbar.down('combo[name=year]').getValue();
		var grid = mainPanel.down('grid#topTenRetailerSalesGrid');

		var teritoryMaster = teritoryMasterForm.getValues();
		Ext.apply(teritoryMaster, {season: seasonId, crop: cropId, conductedYear: conductedYear});
		var records = grid.getStore().getRange();
		var topTenRetailers = [];
		for (var i = 0, len = records.length; i < len; i++)
		{
			var record = records[i];
			if (!record.isValid())
			{
				U.showAlert('Info', 'Some Record(s) Consists Invalid Data.', Ext.Msg.WARNING, null, function() {
					//me.highlightRecords(grid.view, [record], false);
				});
				return false;
			}
			var data = {
				 id			 : record.get('id')
				,retailerInfo: record.get('retailerInfo')
				,pioneerSales: record.get('pioneerSales')
				,competitor1Sales: record.get('competitor1Sales')
				,competitor2Sales: record.get('competitor2Sales')
				,otherSales: record.get('otherSales')
				,totalCounterPotential: record.get('totalCounterPotential')
			}
			if (records[i].phantom)	delete data.id;
			Ext.apply(data, {season: seasonId, crop: cropId, conductedYear: conductedYear});
			topTenRetailers.push(data);
		}

		var liquidationTracking = {teritoryMaster: teritoryMaster, topTenRetailers: topTenRetailers};
		if (parseFloat(teritoryMaster.representation) < 30)
		{
			U.showAlert('Warning', 'Minimum 30% representative retailers are needed. Still you want to submit.', Ext.MessageBox.WARNING, Ext.MessageBox.YESNO
					,function(confirmBtn)
					{
						if(confirmBtn == 'yes')
						{
							me.save(mainPanel, teritoryMasterForm, grid, seasonId, cropId, conductedYear, liquidationTracking);
						}
						else
						{
							return false;
						}
					});
		}
		else
		{
			me.save(mainPanel, teritoryMasterForm, grid, seasonId, cropId, conductedYear, liquidationTracking);
		}
	}
	,save: function(mainPanel, teritoryMasterForm, grid, seasonId, cropId, conductedYear, liquidationTracking)
	{
		var loadMask = U.showLoadMask(mainPanel).show();
		Ext.Ajax.request(
		{
			url 		: ATP.Urls.saveLiquidationTracking
			,method		: 'POST'
			,params   	: {seasonId: seasonId, cropId: cropId, conductedYear: conductedYear}
			,jsonData	: Ext.encode(liquidationTracking)
			,success	: function (response) 
			{
				loadMask.destroy();
				var responseData = Ext.decode(response.responseText);
				if(responseData.success)
				{
					teritoryMasterForm.down('hidden[name=id]').setValue(responseData.teritoryMasterId);
					U.showAlert(getLabel('ATP.GLOBAL.SUCCESS'), responseData.message, false, false, function()
					{
						grid.getStore().load();
					});
				}
				else
				{
					U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), responseData.message, Ext.Msg.ERROR);
				}
			}
			,failure: function (response) 
			{
				loadMask.destroy();
				U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), "Unable To Save.", Ext.Msg.ERROR);
			}
		});
	}
	,highlightRecords: function(view, records, refreshed)
	{
		for (var i = 0; i < records.length; i++)
		{
			var record = records[i];
			if (refreshed)
			{
				record = view.getStore().findExact(record.getIdProperty(), record.getId());
				//record = view.getStore().findRecord(record.getIdProperty(), record.getId(), 0, false, true, true);
			}

			if (record && record != -1)
			{
				view.focusRow(record);
				Ext.fly(view.getNode(record)).highlight('ff0000');
			}
		}
	}
	,commonSummuryRenderer: function(value, summaryData, dataIndex, metaData)
	{
		var totalCounterPotential = metaData.record.get('totalCounterPotential');
		var per = totalCounterPotential == 0 ? 0 : (value / totalCounterPotential * 100).toFixed(2);
		return value + " (" + per + "%)";
	}
}

LIQUIDATION_TRACKING.init();
