/**
 * @author rabindranath.s
 */

var TARGET_AGRONOMY_TBL =	
{
	init: function()
	{
		this.defineTargetAgronomy4TBL();
	}
	,defineTargetAgronomy4TBL : function()
	{

		Ext.define('ATP.data.TARGET_Agronomy_TBL',
		{
			extend	: 'ATP.data.TARGET_DEMAND'
			,fields	:
			[
				{	name: 'targetSampleCount'				}
			]
			,validators:
			[
				{type: 'presence'	,field: 'targetSampleCount'}
			]
		});
	
	}
	,getSeasonCalendars: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			 model		: 'ATP.data.SeasonCalendar'
			,autoLoad	: false
			,proxy 		: 
			{
				type 		: 'ajax'
				,url 		: ATP.Urls.getSeasonCalendarsByActivityIdNRegionId
				,extraParams: {activityId: CONSTANTS.ACTIVITY_IDS.AGRONOMY}
				,reader 	: 'combojsonreader'
			}
		});
	}
	,getTargetAgronomy4TBLs: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				//,url		: ATP.Urls.gridData
				,actionMethods: {create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'}
				,api			: {
					read    : ATP.Urls.gridData
					,create  : undefined
					,update  : ATP.Urls.command
					,destroy : undefined
				}
				,batchActions: false
				,extraParams: {actionType : 'targetAgronomy4TBLService'}
				,reader		: 'jsonreader'
				,writer		:
				{
					type	: 'json'
					,writeAllFields: true
				}
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;
		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'ATP.data.TARGET_Agronomy_TBL'
					,proxy	: proxy
					,autoLoad: false
					,autoSync: true
				});
	}
	,getHybrids: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.getHybridsByCropId
				,extraParams: {actionType : 'hybridInfoService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;
		return Ext.create('Ext.data.ComboStore',
				{
					proxy	: proxy
					,autoLoad: false
				});
	}
	,getTargetAgronomy4TBLGrid : function()
	{
		var me			=	this;
		var targetAgronomy4TBLGrid	=	{
			xtype		: 'customgrid'
			,autoLoad	: false
			,itemId		: 'targetAgronomy4TBL'
			,store		: me.getTargetAgronomy4TBLs()
			,plugins	: [me.getCellEditingPlugin()]
			,dockedItems: me.getGridActions()
			,columns	: 
			[
				 {	text : 'Name'				,dataIndex : 'name'					}
				,{	text : 'Emp Id'				,dataIndex : 'empId'				}
				,{	text : 'Mobile No'			,dataIndex : 'mobileNo'				}
				,{	text : 'Target (Sample)'	,dataIndex : 'targetSampleCount'	
					,editor:	 {xtype: 'numberfield'}}
			]
		};

		return targetAgronomy4TBLGrid;
	}
	,getGridActions: function()
	{
		var me = this;
		var dockedItems = [
		TARGET_DEMAND.getGeographicFilterToolBar()
		,{
			xtype		: 'toolbar'
			,itemId		: 'hybridBasedFilter'
			,dock		: 'top'
			,items		:
			[
				{
					xtype		: 'customcombo'
					,name		: 'seasonCalendar'
					,store		: me.getSeasonCalendars()
					,fieldLabel	: 'Season'
					,labelWidth	: 60
					,emptyText	: 'Select Season'
					,listeners	:
					{
						select: function(combo, rec)
						{
							this.next('textfield').setValue(rec.get('cropName'));
							var grid = this.up('grid');
							var hybridCombo = this.next('combo');

							hybridCombo.seasonCalendarId = rec.get('id');
							hybridCombo.seasonId = rec.get('seasonId');
							hybridCombo.cropId = rec.get('cropId');
							hybridCombo.clearValue();
							hybridCombo.getStore().getProxy().setExtraParam('cropId', rec.get('cropId'));
							hybridCombo.getStore().load();

							//Grid
							grid.getStore().suspendAutoSync();
							grid.getStore().removeAll();
							grid.getStore().resumeAutoSync();
						}
					}
				},{
					xtype		: 'textfield'
					,fieldLabel	: 'Crop'
					,labelWidth	: 50
					,readOnly	: true
				},{
					xtype		: 'customcombo'
					,store		: me.getHybrids()
					,fieldLabel	: 'Hybrid'
					,labelWidth	: 60
					,emptyText	: 'Select Hybrid'
					,listeners	:
					{
						select: function(combo, rec)
						{
							var grid = this.up('grid');
							var cuCombo	= grid.down('toolbar#geographicFilter combo[name=commercialUnit]');
							var regionCombo	= grid.down('toolbar#geographicFilter combo[name=region]');
							var rbmCombo	= grid.down('toolbar#geographicFilter combo[name=rbm]');
							var commercialUnitId = cuCombo.getValue();
							var regionId = regionCombo.getValue();
							var rbmId = rbmCombo.getValue();
							var extraParams = this.seasonId + ',' + this.cropId + ',' + rec.get('id') + ',' + this.seasonCalendarId + ',' + regionId + ',' + rbmId;
							grid.getStore().getProxy().setExtraParam('extraParams', extraParams);
							grid.getStore().load();
						}
					}
				}
			]
		}];

		return dockedItems;
	}
	,getCellEditingPlugin: function()
	{
		var me = this;
		return {
			ptype			: 'cellediting'
			,pluginId		: 'rowEditing'
			,clicksToEdit	: 2
			,listeners:
			{
				validateedit: function(editor, context)
				{
					return true;
				}
			}
		}
	}
};

TARGET_AGRONOMY_TBL.init();
