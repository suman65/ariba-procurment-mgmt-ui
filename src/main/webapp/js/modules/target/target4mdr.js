/**
 * @author rabindranath.s
 */

var TARGET_MDR =	
{
	init: function()
	{
		this.defineTargetMDR();
		this.defineMDR();
		this.defineAssignTargetMDR();
		this.defineCustomAjax();
	}
	,defineTargetMDR : function()
	{
		Ext.define('ATP.data.TARGET_MDR',
		{
			extend	: 'Ext.data.Model'
			,fields	:
			[
				 {	name: 'mdrName'						,mapping: 'mdr.name'}
				,{	name: 'targetDate'					}
				,{	name: 'targetActivityCount'			}
				,{	name: 'targetFarmerCount'			}
			]
		});
	}
	,defineMDR : function()
	{
		Ext.define('ATP.data.USER_MDR',
		{
			extend	: 'Ext.data.Model'
			,fields	:
			[
				 {	name: 'id'						}
				,{	name: 'name'					}
				,{	name: 'mobileNo'				}
			]
		});
	}
	,defineAssignTargetMDR: function()
	{
		Ext.define('ATP.data.ASSIGN_TARGET_MDR',
		{
			extend	: 'Ext.data.Model'
			,fields	:
			[
				 {	id	: 'id'							}
				,{	name: 'targetDate'					}
				,{	name: 'targetActivityCount'			}
				,{	name: 'targetFarmerCount'			}
			]
			,validators:
			[
			 	 {type: 'presence'	,field: 'targetDate'}
				,{type: 'presence'	,field: 'targetActivityCount'}
				,{type: 'presence'	,field: 'targetFarmerCount'}
			]
		});
	}
	,defineCustomAjax: function()
	{
		Ext.define('Ext.data.proxy.CustomAjax',
		{
			extend: 'Ext.data.proxy.Ajax'
			,alias : 'proxy.customajax'
			,slashRe: /\/$/
			,actionMethods: {create: 'POST', read: 'POST', update: 'POST', destroy: 'DELETE'}
			,batchActions: false
			,buildUrl: function(request)
			{
				var me			= this,
					operation	= request.getOperation(),
					records		= operation.getRecords(),
					record		= records ? records[0] : null,
					url			= me.getUrl(request),
					method		= me.getMethod(request),
					id, params;

				if (record && !record.phantom) {
					id = record.getId();
				} else {
					id = operation.getId();
				}

				if (method.toUpperCase() == 'DELETE' && me.isValidId(id))
				{
					if (!url.match(me.slashRe)) {url += '/';}
					url += encodeURIComponent(id);
					params = request.getParams();
					if (params) {delete params[me.getIdParam()];}
					request.setUrl(url);
				}

				return me.callParent([request]);
			}
			,isValidId: function(id)
			{
				return id || id === 0;
			}
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
				,url 		: ATP.Urls.getDemandSeasonCalendarsByRegionId
				,reader 	: 'combojsonreader'
			}
		});
	}
	,getHybrids: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.getHybridsByCropId
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;
		return Ext.create('Ext.data.ComboStore',
				{
					proxy	: proxy
					,autoLoad: false
				});
	}
	,getMDRs	: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.getMDRsByTBLId
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;
		return Ext.create('Ext.data.ComboStore',
				{
					proxy	: proxy
					,autoLoad: false
				});
	}
	,getTarget4MDRs: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;
		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'ATP.data.TARGET_MDR'
					,proxy	: proxy
					,autoLoad: false
				});
	}
	,getAssignTarget4MDRs: function(extraParams)
	{
		var proxy = {
				type		: 'customajax'
				,api		: {
					read		: ATP.Urls.getTargetDateWise
					,create		: ATP.Urls.saveTargetDateWise
					,update		: ATP.Urls.saveTargetDateWise
					,destroy	: ATP.Urls.deleteTargetDateWise
				}
				,extraParams: {actionType : ''}
				,reader		: 'jsonreader'
				,writer		:
				{
					type	: 'json'
					,writeAllFields: true
					,clientIdProperty: 'clientId'
				}
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;
		return Ext.create('Ext.data.GridStore',
			{
				 model	: 'ATP.data.ASSIGN_TARGET_MDR'
				,proxy	: proxy
				,autoLoad: false
				,autoSync: true
				,pageSize: 0
				,autoSyncCallback: Ext.emptyFn
				,onEndUpdate: function()
				{
					var me = this;
					if (me.needsSync && me.autoSync && !me.autoSyncSuspended)
					{
						me.sync({callback: me.autoSyncCallback});
					}
				}
			});
	}
	,getTarget4MDRPanel: function()
	{
		var me = this;
		var panel = {
				xtype		: 'panel'
				,itemId		: 'mainContainer'
				,layout		: {type: 'hbox', align: 'stretch'}
				,defaults	: {height: '100%'}
				,items		:
				[
					me.getTarget4MDRGrid()
					,{
						xtype		: 'splitter'
						,style		: 'background-color:#a9a9a9;'
						,width		: 2
					},{
						xtype		: 'panel'
						,itemId		: 'section_2'
						//,disabled	: true
						//,flex		: 1
						,width		: 500
						,layout		: {type: 'vbox', align: 'stretch'}
						,defaults	: {width: '100%'}
						/*,listeners	:
						{
							afterrender: function(panel) {
								Ext.defer(function() {
									panel.disable();
								}, 10);
							}
						}*/
						,items		:
						[
							{
								 xtype		: 'container'
								,itemId		: 'targetContainer'
								,scrollable	: true
								,layout		: 'fit'
								,height		: 80
								,tpl		:
								[
									'<table style="width: 100%; margin: 0 auto; border: 1px solid #BFBFBF; border-collapse: collapse; font-family: Calibri;">'
									,'<tbody>'
										,'<tr>'
											,'<th style="border: 1px solid #BFBFBF;">Target Type</th>'
											,'<th style="border: 1px solid #BFBFBF;">Target Set By RBM</th>'
											,'<th style="border: 1px solid #BFBFBF;">Assigned</th>'
											,'<th style="border: 1px solid #BFBFBF;">Balance</th>'
										,'</tr>'
										,'<tr>'
											,'<td style="border: 1px solid #BFBFBF; text-align: left; padding-left: 5px;">Target(Activity)</td>'
											,'<td style="border: 1px solid #BFBFBF; text-align: right; padding-right: 10px;">{activitiesCountSetByRBM}</td>'
											,'<td style="border: 1px solid #BFBFBF; text-align: right; padding-right: 10px;">{activitiesAssigned}</td>'
											,'<td style="border: 1px solid #BFBFBF; text-align: right; padding-right: 10px;">{activitiesBalance}</td>'
										,'</tr>'
										,'<tr>'
											,'<td style="border: 1px solid #BFBFBF; text-align: left; padding-left: 5px;">Target(Farmer)</td>'
											,'<td style="border: 1px solid #BFBFBF; text-align: right; padding-right: 10px;">{farmersCountSetByRBM}</td>'
											,'<td style="border: 1px solid #BFBFBF; text-align: right; padding-right: 10px;">{farmersAssigned}</td>'
											,'<td style="border: 1px solid #BFBFBF; text-align: right; padding-right: 10px;">{farmersBalance}</td>'
										,'</tr>'
									,'</tbody>'
									,'</table>'
								]
								,data	: {activitiesCountSetByRBM: 0, activitiesAssigned: 0, activitiesBalance: 0, farmersCountSetByRBM: 0, farmersAssigned: 0, farmersBalance: 0}
							},{
								xtype		: 'splitter'
								,style		: 'background-color:#a9a9a9;'
								,height		: 2
							}
							,me.getTargetAssignGrid()
						]
					}
				]
		};

		return panel;
	}
	,getTarget4MDRGrid : function()
	{
		var me			=	this;
		var target4MDRGrid	=	{
			xtype		: 'customgrid'
			,flex		: 1.2
			,autoLoad	: false
			//,pagination	: false
			,itemId		: 'target4MDRGrid'
			,store		: me.getTarget4MDRs()
			,dockedItems: me.getGridActions()
			,columns	: 
			[
				 {	text : 'MDR Name'				,dataIndex : 'mdrName'				}
				//,{	text : 'Season'				,dataIndex : 'seasonName'			}
				//,{	text : 'Crop'				,dataIndex : 'cropName'				}
				//,{	text : 'Hybrid'				,dataIndex : 'hybridName'			}
				//,{	text : 'Activity Type'		,dataIndex : 'activityName'			}
				,{	text : 'Target Date'			,dataIndex : 'targetDate'			}
				,{	text : 'Target (Activity)'		,dataIndex : 'targetActivityCount'	}
				,{	text : 'Target (Farmer)'		,dataIndex : 'targetFarmerCount'	}
			]
		};

		return target4MDRGrid;
	}
	,updateTarget: function(targetContainer, seasonId, cropId, hybridId, activityId, seasonCalendarId, regionId, tblId)
	{
		targetContainer.setLoading(true);
		Ext.Ajax.request(
		{
			url 		: ATP.Urls.getTplTarget
			,method		: 'POST'
			,params   	: {seasonId: seasonId, cropId: cropId, hybridId: hybridId, activityId: activityId, seasonCalendarId: seasonCalendarId, regionId: regionId, tblId: tblId}
			,success	: function (response) 
			{
				var responseData = Ext.decode(response.responseText);
				targetContainer.update(responseData);
				targetContainer.setLoading(false);
			}
			,failure: function (response) 
			{
				targetContainer.setLoading(false);
			}
		});
	}
	,getTargetAssignGrid: function()
	{
		var me			=	this;
		var targetAssignGrid	=	{
			xtype		: 'customgrid'
			,flex		: 1
			,autoLoad	: false
			,pagination	: false
			,applyFilter: false
			,enableColumnHide: false
			,itemId		: 'targetAssignGrid'
			,selModel	: {fireSelectionChangeOnStoreRefresh: true}
			,store		: me.getAssignTarget4MDRs()
			,plugins	: [me.getRowEditingPlugin()]
			,listeners	: 
			{
				selectionchange	: function(selModel, records)
				{
					//var disabled = records.length ? !records[0].phantom : true;
					selModel.view.grid.down('button#removeRecord').setDisabled(!records.length);
				}
				,afterrender: function(grid)
				{
					this.getStore().autoSyncCallback = function()
					{
						me.updateAll(grid);
					}
				}
			}
			,tbar		:
			[
				{
					xtype		: 'customtbarbutton'
					,text		: 'Add Rec'
					,itemId		: 'addRecord'
					,disabled	: true
					,handler 	: function(btn)
					{
						var grid = btn.up('grid#targetAssignGrid');
						var editingPlugin = grid.findPlugin('rowediting');
						if (editingPlugin.editing)	editingPlugin.cancelEdit();
						var r = Ext.create(grid.getStore().getModel().getName(), {});
						grid.getStore().insert(0, r);
						editingPlugin.startEdit(0, 0);
					}
				},{
					xtype		: 'customtbarbutton'
					,text		: 'Remove Rec'
					,itemId		: 'removeRecord'
					,disabled	: true
					,handler 	: function(btn)
					{
						var grid = btn.up('grid');
						var store = grid.getStore();
						var sm = grid.getSelectionModel();
						grid.editingPlugin.cancelEdit();
						var rec = sm.getSelection()[0];
						//if (rec.phantom)
						{
							store.remove(rec);
							if (store.getCount() > 0) 
							{
								sm.select(0);
							}
						}
					}
				},{
					xtype		: 'customcombo'
					,store		: me.getMDRs()
					,fieldLabel	: 'MDR'
					,labelWidth	: 50
					,emptyText	: 'Select MDR'
					,name		: 'mdr'
					,flex		: 1
					,disabled	: true
					,listeners	:
					{
						select: function(combo, rec)
						{
							var targetAssignGrid = combo.up('grid#targetAssignGrid');
							var mainPanel = targetAssignGrid.up('panel#mainContainer');
							var hybridCombo = mainPanel.down('combo[name=hybrid]');
							var seasonCalendarId = hybridCombo.seasonCalendarId;
							var seasonId = hybridCombo.seasonId;
							var cropId = hybridCombo.cropId;
							var activityId = hybridCombo.activityId;
							var hybridId = hybridCombo.getValue();
							var mdrId =  rec.get('id');
							var regionId =  hybridCombo.regionId;
							var tblId =  hybridCombo.tblId;

							var extraParams = {seasonId: seasonId, cropId: cropId,	hybridId: hybridId, activityId: activityId, mdrId: mdrId, seasonCalendarId: seasonCalendarId, regionId: regionId, tblId: tblId};
							targetAssignGrid.getStore().getProxy().setExtraParams(extraParams);
							targetAssignGrid.getStore().load();
							if (hybridCombo.locked)
							{
								targetAssignGrid.down('button#addRecord').disable();
								targetAssignGrid.findPlugin('rowediting').disable();
							}
							else
							{
								targetAssignGrid.down('button#addRecord').enable();
								targetAssignGrid.findPlugin('rowediting').enable();
							}
						}
						,change: function(combo, newValue)
						{
							var targetAssignGrid = combo.up('grid#targetAssignGrid');
							targetAssignGrid.getStore().suspendAutoSync();
							targetAssignGrid.getStore().removeAll();
							targetAssignGrid.getStore().resumeAutoSync();
							targetAssignGrid.down('button#addRecord').setDisabled(!newValue);
							targetAssignGrid.down('button#removeRecord').disable();
						}
					}
				}
			]
			,columns	: 
			[
				 {	text : 'Date'				,dataIndex : 'targetDate'				
					,editor:	 {xtype: 'datefield'	,allowBlank: false, getValue: function() {
							var val = this.rawToValue(this.processRawValue(this.getRawValue()));
							this.value = val;
							return val ? Ext.Date.format(val, this.submitFormat || this.format) : '';
						}}/*,	renderer:	me.renderFormattedDate*/}
				,{	text : 'Target (Activity)'	,dataIndex : 'targetActivityCount'	
					,editor:	 {xtype: 'numberfield'	,allowBlank: false}}
				,{	text : 'Target (Farmer)'	,dataIndex : 'targetFarmerCount'	
					,editor:	 {xtype: 'numberfield'	,allowBlank: false}}
			]
		};

		return targetAssignGrid;
	}
	,updateAll: function(targetAssignGrid)
	{
		var me = this;
		var targetContainer = targetAssignGrid.prev('container#targetContainer');
		//Target Update
		var extraParams = targetAssignGrid.getStore().getProxy().getExtraParams();
		me.updateTarget(targetContainer, extraParams.seasonId, extraParams.cropId, extraParams.hybridId, extraParams.activityId, extraParams.seasonCalendarId, extraParams.regionId, extraParams.tblId)

		//Target Hybrid Wise Grid
		var mainPanel = targetContainer.up('panel#mainContainer');
		var targetGrid = mainPanel.down('grid#target4MDRGrid');
		targetGrid.getStore().load();
	}
	,renderFormattedDate: function(value)
	{
		if (value != '' && value != null)
		{
			if (!Ext.isDate(value))  value = new Date(value);
			var date = Ext.Date.format(value, 'd-m-Y');
		}
		return date;
	}
	,getRowEditingPlugin: function()
	{
		var me = this;
		return {
			ptype			: 'rowediting'
			,errorSummary	: false
			,autoCancel		: false
			,pluginId		: 'rowEditing'
			,listeners:
			{
				beforeedit: function(editor, context)
				{
					return !editor.disabled;
				}
			}
		};
	}
	,getGridActions: function()
	{
		var me = this;
		var dockedItems = [
		TARGET_DEMAND.getGeographicFilterToolBar4MDR()
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
					,labelWidth	: 55
					,emptyText	: 'Select Season'
					,flex		: 1
					,listeners	:
					{
						select: function(combo, rec)
						{
							var mainPanel = combo.up('panel#mainContainer');
							var target4MDRGrid = combo.up('grid#target4MDRGrid');
							var section_2 = mainPanel.down('panel#section_2');
							var hybridCombo = combo.next('combo[name=hybrid]');
							var regionCombo = target4MDRGrid.down('combo[name=region]');
							var tblCombo = target4MDRGrid.down('combo[name=tbl]');
							//if (!section_2.isDisabled()) section_2.disable();
							var seasonCalendarId = rec.get('id');
							var seasonId	= rec.get('seasonId');
							var cropId		= rec.get('cropId');
							var activityId	= rec.get('activityId');
							var regionId	= regionCombo.getValue();
							var tblId		= tblCombo.getValue();

							this.next('textfield[name=crop]').setValue(rec.get('cropName'));
							this.next('textfield[name=activity]').setValue(rec.get('activityName'));

							hybridCombo.seasonCalendarId = seasonCalendarId;
							hybridCombo.seasonId = seasonId;
							hybridCombo.cropId = cropId;
							hybridCombo.activityId = activityId;
							hybridCombo.locked = rec.get('locked');
							hybridCombo.regionId = regionId;
							hybridCombo.tblId = tblId;

							hybridCombo.clearValue();
							hybridCombo.getStore().getProxy().setExtraParam('cropId', cropId);
							hybridCombo.getStore().load();

							//Grid
							target4MDRGrid.getStore().removeAll();
						}
					}
				},{
					xtype		: 'textfield'
					,fieldLabel	: 'Crop'
					,name		: 'crop'
					,labelWidth	: 45
					,readOnly	: true
					,name		: 'crop'
					//,flex		: 1
					,width		: 120
				},{
					xtype		: 'textfield'
					,fieldLabel	: 'Activity'
					,labelWidth	: 50
					,readOnly	: true
					,name		: 'activity'
					//,flex		: 1
					,width		: 100
				},{
					xtype		: 'customcombo'
					,store		: me.getHybrids()
					,fieldLabel	: 'Hybrid'
					,labelWidth	: 50
					,emptyText	: 'Select Hybrid'
					,name		: 'hybrid'
					,flex		: 1
					,listeners	:
					{
						select: function(combo, rec)
						{
							var mainPanel = combo.up('panel#mainContainer');
							var target4MDRGrid = combo.up('grid#target4MDRGrid');
							//For Target Container(itemId{targetContainer})
							var section_2 = mainPanel.down('panel#section_2');
							//section_2.enable();
							var hybridId = rec.get('id');
							var extraParams = this.seasonId + ',' + this.cropId + ',' + hybridId + ',' + this.seasonCalendarId + ',' + this.regionId + ',' + this.tblId;
							var actionType = "";
							target4MDRGrid.getStore().getProxy().setExtraParam('extraParams', extraParams);

							if (this.activityId == CONSTANTS.ACTIVITY_IDS.PDA)
							{
								actionType = "targetDemandPDA4MDRDateWiseService";
							}
							else if (this.activityId == CONSTANTS.ACTIVITY_IDS.PSA)
							{
								actionType = "targetDemandPSA4MDRDateWiseService";
							}
							else if (this.activityId == CONSTANTS.ACTIVITY_IDS.OSA)
							{
								actionType = "targetDemandOSA4MDRDateWiseService";
							}

							target4MDRGrid.getStore().getProxy().setExtraParam('actionType', actionType);
							target4MDRGrid.getStore().load();

							var targetContainer = mainPanel.down('container#targetContainer');
							me.updateTarget(targetContainer, this.seasonId, this.cropId, hybridId, this.activityId, this.seasonCalendarId, this.regionId, this.tblId);
						}
						,change: function(combo, newValue)
						{
							var mainPanel = this.up('panel#mainContainer');
							var targetAssignGrid = mainPanel.down('grid#targetAssignGrid');
							var mdrCombo = targetAssignGrid.down('combo[name=mdr]');
							mdrCombo.clearValue();
							mdrCombo.setDisabled(!newValue);
						}
					}
				}
			]
		}];

		return dockedItems;
	}
};

TARGET_MDR.init();
