var COMPETITOR_LIQUIDATION = 
{
	init	: function()
	{
		this.defineCompetitorLiquidation();
	}
	,seasons: null
	,crops	: null
	,defineCompetitorLiquidation : function()
	{
		Ext.define('CompetitorLiquidation', 
		{
			extend	: 'Ext.data.Model',
			fields	:
			[
				 {	name :'id'															}
				,{	name: 'seasonName'				,mapping : 'season.name'			}
				,{	name: 'season'					,mapping : 'season.id'				}
				,{	name: 'cropName'				,mapping : 'crop.name'				}
				,{	name: 'crop'					,mapping : 'crop.id'				}
				,{	name: 'competitor1Name'			,mapping : 'competitor1.name'		}
				,{	name: 'competitor1'				,mapping : 'competitor1.id'			}
				,{	name: 'competitor2Name'			,mapping : 'competitor2.name'		}
				,{	name: 'competitor2'				,mapping : 'competitor2.id'			}
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
	,getCompetitors: function()
	{
		var competitorStore = Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: false
			,proxy		: 
			{
				type	: 'ajax'
				,url	: './admin/getCompetitorsByCropId'
				//,extraParams: {cropId: 1}
				,reader	: 'combojsonreader'
			}
		});

		return competitorStore;
	}
	,getCompetitorLiquidationStore	: function(extraParams)
	{
		var proxy = {
			type		: 'ajax'
			,url		: ATP.Urls.gridData
			,extraParams: {actionType : 'competitorLiquidationService'}
			,reader		: 'jsonreader'
		}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
		{
			 model	: 'CompetitorLiquidation'
			,proxy	: proxy
		});
	}
	,getCompetitorLiquidationGrid : function()
	{
		var me			=	this;
		var competitorLiquidationGrid	=	{
			xtype		: 'customgrid'
			,itemId		: 'competitorLiquidation'
			,title		: 'Liquidation Competitor'
			,store		: me.getCompetitorLiquidationStore()
			,tbar		: 
			[
			 	{xtype	: 'customtbarbutton'		,text : 'Add'		,iconCls : 'x-atp-add'							,handler : function(btn) { me.createCompetitorLiquidation(btn)}	}
			 	,{xtype	: 'customtbarbutton'		,text : 'Edit'		,iconCls : 'x-atp-edit'	,itemId : 'editCmpBtn'	,handler : function(btn) { me.editCompetitorLiquidation(btn.up('grid#competitorLiquidation'))}	,disabled : true}
			 ]
			,columns		: 
			[
			 	{	text : 'Season'						,dataIndex : 'seasonName'				}
			 	,{	text : 'Crop'						,dataIndex : 'cropName'					}
				,{	text : 'Competitor1'				,dataIndex : 'competitor1Name'			}
				,{	text : 'Competitor2'				,dataIndex : 'competitor2Name'			}
			]
			,listeners :
			{
				itemdblclick : function(view)
				{
					me.editCompetitorLiquidation(view.grid)
				}
				,selectionchange : function(selModel, records)
				{
					if(records.length > 0)
					{
						selModel.view.grid.down('button#editCmpBtn').setDisabled(false);
					}
					else
					{
						selModel.view.grid.down('button#editCmpBtn').setDisabled(true);	
					}
				}
				
			}
		};
		return competitorLiquidationGrid;
	}
	,createCompetitorLiquidation : function(btn)
	{
		var me = this;
		var grid = btn.up('grid#competitorLiquidation');
		var form  = me.getCompetitorLiquidationForm(grid);
	}
	,editCompetitorLiquidation : function(grid)
	{
		var me = this;
		var record = grid.getSelectionModel().getSelection()[0];
		var form  = me.getCompetitorLiquidationForm(grid).down('form#cmpLiqForm');
		form.down('combo[name=competitor1]').getStore().load({params: {cropId: record.get('crop')}});
		form.loadRecord(record);
	}
	,getCompetitorLiquidationForm : function(mdrGrid)
	{
		var me = this;
		var competitors = me.getCompetitors();
		var cmpLiqForm = Ext.create('Ext.custom.form.Panel',
		{
			itemId			: 'cmpLiqForm'
			,defaultType	: 'textfield'
			,fieldDefaults	: {labelWidth: 100}
			,items			: 
			[
				{
					xtype		: 'hidden'
					,name		: 'id'
				},{
					xtype		: 'customcombo'
					,fieldLabel	: 'Season'
					,name		: 'season'
					,allowBlank		: false
					,store		: me.getSeasons()
				},{
					xtype		: 'customcombo'
					,fieldLabel	: 'Crop'
					,name		: 'crop'
					,allowBlank		: false
					,store		: me.getCrops()
					,listeners	:
					{
						select: function(combo, rec)
						{
							var competitor1Combo = this.next('combo[name=competitor1]');
							var competitor2Combo = this.next('combo[name=competitor2]');
							competitor1Combo.clearValue();
							competitor2Combo.clearValue();
							competitor1Combo.getStore().getProxy().setExtraParam('cropId', rec.get('id'));
							competitor1Combo.getStore().load();
						}
					}
				},{
					xtype			: 'customcombo'
					,fieldLabel		: 'Competitor 1'
					,itemId			: 'competitor1'
					,name			: 'competitor1'
					,allowBlank		: false
					,store			: competitors
					,listeners	:
					{
						select: function(combo, rec)
						{
							combo.getStore().clearFilter();
							combo.getStore().filterBy(function(r) {
								if(r.get('id') === rec.get('id')) {return false;}
								return true;
							});
						}
					}
					,getStoreListeners: function(store)
					{
						if (!store.isEmptyStore)
						{
							var me = this,
								result = {
									datachanged: me.onDataChanged,
									load: me.onLoad,
									exception: me.onException,
									update: me.onStoreUpdate,
									remove: me.checkValueOnChange
								};

							return result;
						}
					}
				},{
					xtype			: 'customcombo'
					,fieldLabel		: 'Competitor 2'
					,itemId			: 'competitor2'
					,name			: 'competitor2'
					,allowBlank		: false
					,store			: competitors
					,listeners	:
					{
						select: function(combo, rec)
						{
							//combo.getStore().clearFilter();
							combo.getStore().filterBy(function(r) {
								if(r.get('id') === rec.get('id')) {return false;}
								return true;
							});
						}
					}
					,getStoreListeners: function(store)
					{
						if (!store.isEmptyStore)
						{
							var me = this,
								result = {
									datachanged: me.onDataChanged,
									load: me.onLoad,
									exception: me.onException,
									update: me.onStoreUpdate,
									remove: me.checkValueOnChange
								};

							return result;
						}
					}
				}
			]
			,buttons	: 
			[
				{
					xtype	: 'customformcancelbutton'
				},{
					xtype	: 'customformsubmitbutton'
					,handler : function()
					{
						me.saveCmpLiqForm(cmpLiqForm, mdrGrid)
					}
				}
			]
		});

		return	Utilities.showWindow({
			title	: 'Competitor Liquidation Info'
			,items	: cmpLiqForm
			,width	: 500
		});
	}
	,saveCmpLiqForm : function(comLiqform, grid)
	{
		var mask = Utilities.showLoadMask(comLiqform.up('window')).show();
		comLiqform.submit({
			url		: './command?actionType=competitorLiquidationService'
			,jsonSubmit : true
			,method	: 'POST'
			,success : function(form, action)
			{
				mask.destroy();
				if(action.result.transacted == false)
				{
					Utilities.showAlert('Message', action.result.message);
				}
				else
				{
					comLiqform.up('window').close();
					Utilities.showAlert('Success', action.result.message);
					grid.getStore().load();
				}
				
			}
			,failure : function(form, action)
			{
				mask.destroy();
				Utilities.showAlert('Failure',action.result.message);
			}
		});
	}
};

COMPETITOR_LIQUIDATION.init();
