/**
 * @author rabindranath.s
 */

var TARGET_AGRONOMY_MDR =	
{
	init: function()
	{
		this.defineTargetAgronomy4MDR();
	}
	,defineTargetAgronomy4MDR : function()
	{

		Ext.define('ATP.data.TARGET_Agronomy_MDR',
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
	,getTargetAgronomy4MDRs: function(extraParams)
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
				,extraParams: {actionType : 'targetAgronomy4MDRService'}
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
					 model	: 'ATP.data.TARGET_Agronomy_MDR'
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
	,getTargetAgronomy4MDRGrid : function()
	{
		var me			=	this;
		var targetAgronomy4MDRGrid	=	{
			xtype		: 'customgrid'
			,autoLoad	: false
			,enableColumnHide: false
			,itemId		: 'targetAgronomy4MDR'
			,store		: me.getTargetAgronomy4MDRs()
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

		return targetAgronomy4MDRGrid;
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
				beforeedit: function(editor, context)
				{
					return !editor.disabled;
				}
			}
		}
	}
	,updateTarget: function(seasonId, cropId, hybridId, seasonCalendarId, regionId, tblId, hybridField)
	{
		Ext.Ajax.request(
		{
			url 		: ATP.Urls.getTblTargetAgronomy
			,method		: 'POST'
			,params   	: {seasonId: seasonId, cropId: cropId, hybridId: hybridId, seasonCalendarId: seasonCalendarId, regionId: regionId, tblId: tblId}
			,success	: function (response) 
			{
				var responseData = Ext.decode(response.responseText);
				//if (console && console.log) console.log(responseData);
			}
			,failure: function (response) 
			{
			}
		});
	}
	,getGridActions: function()
	{
		var me = this;
		var dockedItems = [
		TARGET_DEMAND.getGeographicFilterToolBar4MDRAgronomy()
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
							if (rec.get('locked'))
							{
								grid.findPlugin('cellediting').disable();
							}
							else
							{
								grid.findPlugin('cellediting').enable();
							}

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
					,width		: 120
				},{
					xtype		: 'customcombo'
					,store		: me.getHybrids()
					,fieldLabel	: 'Hybrid'
					,labelWidth	: 60
					,emptyText	: 'Hybrid'
					,width		: 150
					,listeners	:
					{
						select: function(combo, rec)
						{
							var grid = this.up('grid');
							var cuCombo	= grid.down('toolbar#geographicFilter combo[name=commercialUnit]');
							var regionCombo	= grid.down('toolbar#geographicFilter combo[name=region]');
							var tblCombo	= grid.down('toolbar#geographicFilter combo[name=tbl]');
							var commercialUnitId = cuCombo.getValue();
							var regionId = regionCombo.getValue();
							var tblId = tblCombo.getValue();
							var hybridId = rec.get('id');

							var extraParams = this.seasonId + ',' + this.cropId + ',' + hybridId + ',' + this.seasonCalendarId + ',' + regionId + ',' + tblId;
							grid.getStore().getProxy().setExtraParam('extraParams', extraParams);
							grid.getStore().load();
							me.updateTarget(this.seasonId, this.cropId, hybridId, this.seasonCalendarId, regionId, tblId, combo);
						}
					}
				}
			]
		}];

		return dockedItems;
	}
};

TARGET_AGRONOMY_MDR.init();
