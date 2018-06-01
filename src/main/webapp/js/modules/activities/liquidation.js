var LIQUIDATION = 
{
	init: function()
	{
		this.defineLiquidation();
	}
	,defineLiquidation : function()
	{
		Ext.define('ATP.model.Liquidation', 
		{
			extend	: 'Ext.data.Model',
			fields	:
			[
				 {	name: 'id'														}
				,{	name: 'tblName'					,mapping: 'tbl.name'			}
				,{	name: 'tbl'						,mapping: 'tbl.id'				}
				,{	name: 'seasonName'				,mapping: 'season.name'			}
				,{	name: 'season	'				,mapping: 'season.id'			}
				,{	name: 'cropName'				,mapping: 'crop.name'			}
				,{	name: 'crop'					,mapping: 'crop.id'				}
				,{	name: 'retailerName'			,mapping: 'retailerInfo.name'	}
				,{	name: 'retailerInfo'			,mapping: 'retailerInfo.id'		}
				,{	name: 'retailerMobileNo'										}
				,{	name: 'retailerPincode'											}
				,{	name: 'pioneerSales'											}
				,{	name: 'Competitor1'				,mapping: 'competitor1.name'	}
				,{	name: 'Competitor2'				,mapping: 'competitor2.name'	}
				,{	name: 'competitor1Sales'										}
				,{	name: 'competitor2Sales'										}
				,{	name: 'otherSales'												}
				,{	name: 'geolocation'												}
				,{	name: 'date'													}
				,{	name: 'transactedOn'											}
				
			 ]
		});
	}
	,getLiquidation: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'liquidationService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'ATP.model.Liquidation'
					,proxy	: proxy
				});
	}
	,getSeasons: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: true
			,proxy		: 
			{
				type	: 'ajax'
				,url	: './comboData?actionType=seasonService'
				,reader	: 'combojsonreader'
			}
		});
	}
	,getCrops: function()
	{
		return Ext.create('Ext.data.ComboStore',
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
	,getRetailers: function()
	{
		return Ext.create('Ext.data.ComboStore',
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
	,getLiquidationGrid : function()
	{
		var me			=	this;
		var liquidationGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.Liquidation.GRID.TITLE')
			,itemId		: 'liquidationGrid'
			,store		: me.getLiquidation()
			,tbar		: me.getGridToolBar()
			,columns	: 
			[
				 {	text : 'TBL Name'				,dataIndex : 'tblName'						}
				,{	text : 'Season'					,dataIndex : 'seasonName'					}
				,{	text : 'Crop'					,dataIndex : 'cropName'						}
				,{	text : 'Retailer'				,dataIndex : 'retailerName'					}
				,{	text : 'Retailer Mobile No'		,dataIndex : 'retailerMobileNo'				}
				,{	text : 'Retailer Pincode'		,dataIndex : 'retailerPincode'				}
				,{	text : 'Pioneer Sales'			,dataIndex : 'pioneerSales'					}
				,{	text : 'Competitor 1'			,dataIndex : 'Competitor1'					}
				,{	text : 'Competitor 2'			,dataIndex : 'Competitor2'					}
				,{	text : 'Competitor 1 Sales'		,dataIndex : 'competitor1Sales'				}
				,{	text : 'Competitor 2 Sales'		,dataIndex : 'competitor2Sales'				}
				,{	text : 'Other Sales'			,dataIndex : 'otherSales'					}
				,{	text : 'Geo Location'			,dataIndex : 'geolocation'					}
				,{	text : 'Date'					,dataIndex : 'date'				,filter : 'date'	,renderer: U.renderFormattedDate}
				,{	text : 'Transacted On'			,dataIndex : 'transactedOn'		,filter : 'date'	,renderer: U.renderFormattedDate}
			]
		};

		return liquidationGrid;
	}
	,getLiquidationGrid4Mobile : function()
	{
		var me			=	this;
		var liquidationGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.Liquidation.GRID.TITLE')
			,itemId		: 'liquidationGrid'
			,store		: me.getLiquidation()
			,tbar		: me.getGridToolBar()
			,columns	: 
			[
				 {	text : 'Season'					,dataIndex : 'seasonName'					}
				,{	text : 'Crop'					,dataIndex : 'cropName'						}
				,{	text : 'Retailer'				,dataIndex : 'retailerName'					}
				,{	text : 'Pioneer Sales'			,dataIndex : 'pioneerSales'					}
				,{	text : 'Competitor 1'			,dataIndex : 'Competitor1'					}
				,{	text : 'Competitor 2'			,dataIndex : 'Competitor2'					}
				,{	text : 'Competitor 1 Sales'		,dataIndex : 'competitor1Sales'				}
				,{	text : 'Competitor 2 Sales'		,dataIndex : 'competitor2Sales'				}
				,{	text : 'Other Sales'			,dataIndex : 'otherSales'					}
				,{	text : 'Date'					,dataIndex : 'date'				,filter : 'date'	,renderer: U.renderFormattedDate}
			]
		};

		return liquidationGrid;
	}
	,getGridToolBar: function()
	{
		var me = this,
			tbar = [
				{xtype: 'customtbarbutton'	,text : 'Add Record'	,iconCls : 'x-atp-add'	,handler : me.addLiquidation.bind(me)}
			];

		return tbar;
	}
	,addLiquidation: function(btn)
	{
		var me = this;
		var liquidationGrid = btn.up('grid#liquidationGrid')
		var liquidationForm = me.getLiquidationForm(liquidationGrid);
		return	Utilities.showWindow({
			title	: 'Liquidation'
			,items	: liquidationForm
			,width	: 500
		});
	}
	,getLiquidationForm: function(liquidationGrid)
	{
		var me = this;
		var liquidationForm = Ext.create('Ext.custom.form.Panel',
		{
			itemId			: 'liquidationForm'
			,fieldDefaults	: {labelWidth: 130}
			,items			:
			[
				{
					xtype		: 'fieldset'
					,defaults 	: { margin: 5}
					,items		: 
					[
						{
							xtype		: 'hidden'
							,name		: 'id'
						},{
							xtype		: 'datefield'
							,fieldLabel	: 'Select Date'
							,name		: 'date'
							,minValue	: Ext.Date.add(new Date(), Ext.Date.DAY, -2)
							,maxValue	: new Date()
							,allowBlank	: false
						},{
							xtype		: 'customcombo'
							,store		: me.getSeasons()
							,fieldLabel	: 'Select Season'
							,name		: 'season'
							,emptyText	: 'Select Season'
							,allowBlank	: false
							,listeners	:
							{
								select: function(combo, rec)
								{
									me.fetchCompetitors(combo);
								}
							}
						},{
							xtype		: 'customcombo'
							,store		: me.getCrops()
							,fieldLabel	: 'Crop'
							,name		: 'crop'
							,emptyText	: 'Select Crop'
							,allowBlank	: false
							,listeners	:
							{
								select: function(combo, rec)
								{
									me.fetchCompetitors(combo);
								}
							}
						},{
							xtype		: 'customcombo'
							,store		: me.getRetailers()
							,fieldLabel	: 'Select Retailer'
							,name		: 'retailerInfo'
							,emptyText	: 'Select Retailer'
							,allowBlank	: false
							,listeners	:
							{
								select: function(combo, rec)
								{
									this.next('textfield[name=retailerMobileNo]').setValue(rec.get('mobileNo'));
									this.next('textfield[name=retailerPincode]').setValue(rec.get('pinCode'));
								}
							}
						},{
							xtype		: 'textfield'
							,fieldLabel	: 'Retailer Mobile No'
							,name		: 'retailerMobileNo'
							,readOnly	: true
						},{
							xtype		: 'textfield'
							,fieldLabel	: 'Retailer Pincode'
							,name		: 'retailerPincode'
							,readOnly	: true
						},{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Pioneer Sales'
							,name		: 'pioneerSales'
							,allowBlank	: false
						},{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Competitor1 Sales'
							,name		: 'competitor1Sales'
							,allowBlank	: false
						},{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Competitor2 Sales'
							,name		: 'competitor2Sales'
							,allowBlank	: false
						},{
							xtype		: 'customnumberfield'
							,fieldLabel	: 'Other Sales'
							,name		: 'otherSales'
							,allowBlank	: false
						}
					]
				}
			]
			,buttons	: 
			[
				{
					xtype	: 'customformcancelbutton'
				},{
					xtype	: 'customformsubmitbutton'
					,handler : me.saveLiquidation.bind(me, liquidationGrid)
				}
			]
		});

		return liquidationForm;
	}
	,saveLiquidation: function(liquidationGrid, btn)
	{
		var me = this,
			liquidationForm = btn.up('form#liquidationForm');
		var loadMask = U.showLoadMask(liquidationForm).show();
		Ext.Ajax.request(
		{
			url 		: ATP.Urls.saveLiquidation
			,method		: 'POST'
			,jsonData	: Ext.encode(liquidationForm.getValues())
			,success	: function (response) 
			{
				loadMask.destroy();
				var responseData = Ext.decode(response.responseText);
				if(responseData.success)
				{
					liquidationForm.up('window').close();
					U.showAlert(getLabel('ATP.GLOBAL.SUCCESS'), responseData.message, false, false, function()
					{
						liquidationGrid.getStore().load();
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
	,fetchCompetitors: function(field)
	{
		var me = this;
		var formPanel = field.up('form#liquidationForm');
		var seasonId = formPanel.down('combo[name=season]').getValue();
		var cropId = formPanel.down('combo[name=crop]').getValue();
		if (seasonId && cropId)
		{
			//mainPanel.body.mask();
			var loadMask = U.showLoadMask(formPanel).show();
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
						formPanel.down('numberfield[name=competitor1Sales]').setFieldLabel(responseData.competitor1 + ' Sales' + ATP.mandatoryIndicator);
						formPanel.down('numberfield[name=competitor2Sales]').setFieldLabel(responseData.competitor2 + ' Sales' + ATP.mandatoryIndicator);
						//mainPanel.body.unmask();
					}
					else
					{
						field.clearValue();
						U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), responseData.message, Ext.Msg.ERROR);
					}
				}
				,failure: function (response) 
				{
					field.clearValue();
					loadMask.destroy();
					U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), "Unable To Fetch.", Ext.Msg.ERROR);
				}
			});
		}
	}
}

LIQUIDATION.init();
