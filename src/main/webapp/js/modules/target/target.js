/**
 * @author rabindranath.s
 */

var TARGET_DEMAND =	
{
	init: function()
	{
		this.defineTARGET_DEMAND();
	}
	,defineTARGET_DEMAND: function()
	{
		Ext.define('ATP.data.TARGET_DEMAND', 
		{
			extend	: 'Ext.data.Model'
			,fields	:
			[
				 {	name: 'id'								}
				,{	name: 'targetId'						}
				,{	name: 'name'							}
				,{	name: 'empId'							}
				,{	name: 'mobileNo'  						}
				,{	name: 'seasonName'						}
				,{	name: 'seasonId'						}
				,{	name: 'cropName'						}
				,{	name: 'cropId'							}
				,{	name: 'hybridName'						}
				,{	name: 'hybridId'						}
				//,{	name: 'transactedOn'				}
				,{	name: 'seasonCalendarName'				}
				,{	name: 'seasonCalendarId'				}
			]
			/*,constructor: function (data, session)
			{
				this.callParent([data, session]);
			}*/
		});
	}
	,getCommercialUnits: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: false
			,proxy 		: 
			{
				type 		: 'ajax'
				,url 		: ATP.Urls.comboData
				,extraParams: {actionType : 'commercialUnitService'}
				,reader 	: 'combojsonreader'
			}
		});
	}
	,getRegions: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: false
			,proxy 		: 
			{
				type 		: 'ajax'
				,url 		: ATP.Urls.comboData
				,extraParams: {actionType : 'regionService'}
				,reader 	: 'combojsonreader'
			}
		});
	}
	,getRBMs: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: false
			,proxy 		: 
			{
				type 		: 'ajax'
				,url 		: ATP.Urls.getRbmsByRegionId
				,reader 	: 'combojsonreader'
			}
		});
	}
	,getTBLs: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: false
			,proxy 		: 
			{
				type 		: 'ajax'
				,url 		: ATP.Urls.getTblsByRegionId
				,reader 	: 'combojsonreader'
			}
		});
	}
	,getGeographicFilterToolBar: function()
	{
		return {
			xtype		: 'toolbar'
			,itemId		: 'geographicFilter'
			,dock		: 'top'
			,items		:
			[
				{
					xtype		: 'customcombo'
					,name		: 'commercialUnit'
					,store		: TARGET_DEMAND.getCommercialUnits()
					,fieldLabel	: 'Commercial Unit'
					,labelWidth	: 100
					,emptyText	: 'Select Commercial Unit'
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.CU 
											|| CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.REGION)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.CU, 0, false, true, true);
										if (CURRENTUSER.CU && r)
										{
											combo.setValue(r);
										}
									}
								}
							});

							combo.getStore().load();
						}
						,change: function(combo, newVal)
						{
							var regionStore = combo.next('combo[name=region]').getStore();
							if(!!newVal)
							{
								regionStore.getProxy().setExtraParam('extraParams', newVal);
								regionStore.load();
							}
						}
					}
				},{
					xtype		: 'customcombo'
					,name		: 'region'
					,store		: TARGET_DEMAND.getRegions()
					,fieldLabel	: 'Region'
					,labelWidth	: 50
					,emptyText	: 'Select Region'
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.REGION)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.REGION, 0, false, true, true);
										if (CURRENTUSER.REGION && r)
										{
											combo.setValue(r);
										}
									}
								}
							});
						}
						,change: function(combo, newVal)
						{
							var grid = combo.up('grid');
							var seasonCalendarCombo = grid.down('toolbar#hybridBasedFilter combo[name=seasonCalendar]');
							var rbmCombo = combo.next('combo[name=rbm]');
							var seasonCalendarStore	= seasonCalendarCombo.getStore();
							var rbmStore = rbmCombo.getStore();
							seasonCalendarCombo.clearValue();
							rbmCombo.clearValue();
							if(!!newVal)
							{
								seasonCalendarStore.getProxy().setExtraParam('regionId', newVal);
								rbmStore.getProxy().setExtraParam('regionId', newVal);
								rbmStore.load();
								seasonCalendarStore.load();
							}
							else
							{
								seasonCalendarStore.removeAll();
								rbmStore.removeAll();
							}
						}
					}
				},{
					xtype		: 'customcombo'
					,name		: 'rbm'
					,store		: TARGET_DEMAND.getRBMs()
					,fieldLabel	: 'RBM'
					,labelWidth	: 40
					,emptyText	: 'Select RBM'
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.REGION)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.ID, 0, false, true, true);
										if (CURRENTUSER.ID && r)
										{
											combo.setValue(r);
										}
									}
								}
							});
						}
					}
				}
			]
		};
	}
	,getGeographicFilterToolBar4MDRAgronomy: function()
	{
		return {
			xtype		: 'toolbar'
			,itemId		: 'geographicFilter'
			,dock		: 'top'
			,items		:
			[
				{
					xtype		: 'customcombo'
					,name		: 'commercialUnit'
					,store		: TARGET_DEMAND.getCommercialUnits()
					,fieldLabel	: 'Commercial Unit'
					,labelWidth	: 100
					,emptyText	: 'Select Commercial Unit'
					,flex		: 1
					,maxWidth	: 250
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.CU 
											|| CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.REGION
											|| CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.CU, 0, false, true, true);
										if (CURRENTUSER.CU && r)
										{
											combo.setValue(r);
										}
									}
								}
							});

							combo.getStore().load();
						}
						,change: function(combo, newVal)
						{
							var regionStore = combo.next('combo[name=region]').getStore();
							if(!!newVal)
							{
								regionStore.getProxy().setExtraParam('extraParams', newVal);
								regionStore.load();
							}
						}
					}
				},{
					xtype		: 'customcombo'
					,name		: 'region'
					,store		: TARGET_DEMAND.getRegions()
					,fieldLabel	: 'Region'
					,labelWidth	: 50
					,emptyText	: 'Select Region'
					,flex		: 1
					,maxWidth	: 250
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.REGION
											|| CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.REGION, 0, false, true, true);
										if (CURRENTUSER.REGION && r)
										{
											combo.setValue(r);
										}
									}
								}
							});
						}
						,change: function(combo, newVal)
						{
							var grid = combo.up('grid');
							var seasonCalendarCombo = grid.down('toolbar#hybridBasedFilter combo[name=seasonCalendar]');
							var tblCombo = combo.next('combo[name=tbl]');
							var seasonCalendarStore	= seasonCalendarCombo.getStore();
							var tblStore = tblCombo.getStore();
							seasonCalendarCombo.clearValue();
							tblCombo.clearValue();
							if(!!newVal)
							{
								seasonCalendarStore.getProxy().setExtraParam('regionId', newVal);
								tblStore.getProxy().setExtraParam('regionId', newVal);
								tblStore.load();
								seasonCalendarStore.load();
							}
							else
							{
								seasonCalendarStore.removeAll();
								tblStore.removeAll();
							}
						}
					}
				},{
					xtype		: 'customcombo'
					,name		: 'tbl'
					,store		: TARGET_DEMAND.getTBLs()
					,fieldLabel	: 'TBL'
					,labelWidth	: 40
					,emptyText	: 'Select TBL'
					,flex		: 1
					,maxWidth	: 250
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.ID, 0, false, true, true);
										if (CURRENTUSER.ID && r)
										{
											combo.setValue(r);
										}
									}
								}
							});
						}
					}
				}
			]
		};
	}
	,getGeographicFilterToolBar4MDR: function()
	{
		return {
			xtype		: 'toolbar'
			,itemId		: 'geographicFilter'
			,dock		: 'top'
			,items		:
			[
				{
					xtype		: 'customcombo'
					,name		: 'commercialUnit'
					,store		: TARGET_DEMAND.getCommercialUnits()
					,fieldLabel	: 'Commercial Unit'
					,labelWidth	: 100
					,emptyText	: 'Select Commercial Unit'
					,flex		: 1
					,maxWidth	: 250
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.CU 
											|| CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.REGION
											|| CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.CU, 0, false, true, true);
										if (CURRENTUSER.CU && r)
										{
											combo.setValue(r);
										}
									}
								}
							});

							combo.getStore().load();
						}
						,change: function(combo, newVal)
						{
							var regionStore = combo.next('combo[name=region]').getStore();
							if(!!newVal)
							{
								regionStore.getProxy().setExtraParam('extraParams', newVal);
								regionStore.load();
							}
						}
					}
				},{
					xtype		: 'customcombo'
					,name		: 'region'
					,store		: TARGET_DEMAND.getRegions()
					,fieldLabel	: 'Region'
					,labelWidth	: 50
					,emptyText	: 'Select Region'
					,flex		: 1
					,maxWidth	: 250
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.REGION
											|| CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.REGION, 0, false, true, true);
										if (CURRENTUSER.REGION && r)
										{
											combo.setValue(r);
										}
									}
								}
							});
						}
						,change: function(combo, newVal)
						{
							var grid = combo.up('grid');
							var seasonCalendarCombo = grid.down('toolbar#hybridBasedFilter combo[name=seasonCalendar]');
							var tblCombo = combo.next('combo[name=tbl]');
							var seasonCalendarStore	= seasonCalendarCombo.getStore();
							var tblStore = tblCombo.getStore();
							seasonCalendarCombo.clearValue();
							tblCombo.clearValue();
							if(!!newVal)
							{
								seasonCalendarStore.getProxy().setExtraParam('regionId', newVal);
								tblStore.getProxy().setExtraParam('regionId', newVal);
								tblStore.load();
								seasonCalendarStore.load();
							}
							else
							{
								seasonCalendarStore.removeAll();
								tblStore.removeAll();
							}
						}
					}
				},{
					xtype		: 'customcombo'
					,name		: 'tbl'
					,store		: TARGET_DEMAND.getTBLs()
					,fieldLabel	: 'TBL'
					,labelWidth	: 40
					,emptyText	: 'Select TBL'
					,flex		: 1
					,maxWidth	: 250
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.ID, 0, false, true, true);
										if (CURRENTUSER.ID && r)
										{
											combo.setValue(r);
										}
									}
								}
							});
						}
						,change: function(combo, newVal)
						{
							var target4MDRGrid = combo.up('grid#target4MDRGrid');
							var mainPanel = target4MDRGrid.up('panel#mainContainer');
							var targetAssignGrid = mainPanel.down('grid#targetAssignGrid');
							var mdrCombo = targetAssignGrid.down('combo[name=mdr]');
							var mdrStore = mdrCombo.getStore();
							mdrCombo.clearValue();
							if(!!newVal)
							{
								mdrStore.getProxy().setExtraParam('tblId', newVal);
								mdrStore.load();
							}
							else
							{
								mdrStore.removeAll();
							}
						}
					}
				}
			]
		};
	}
};

TARGET_DEMAND.init();
