var SEASON_CALENDAR =
{
	init : function()
	{
		this.defineSeasonCalendar();
	}
	,seasons : null
	,crops	: null
	,activities	: null
	,commercialUnits : null
	,regions : null
	,defineSeasonCalendar : function()
	{
		Ext.define('SeasonCalendar', 
		{
			extend	: 'Ext.data.Model',
			fields	:
			[
				 {	name: 'id'														}
				,{	name: 'name'													}
				,{	name: 'commercialUnitName'		,mapping: 'region.commercialUnit.name'}
				,{	name: 'commercialUnit'			,mapping: 'region.commercialUnit.id'}
				,{	name: 'regionName'				,mapping: 'region.name'			}
				,{	name: 'region'					,mapping: 'region.id'			}
				,{	name: 'seasonName'				,mapping: 'season.name'			}
				,{	name: 'season'					,mapping: 'season.id'			}
				,{	name: 'cropName'				,mapping: 'crop.name'			}
				,{	name: 'crop'					,mapping: 'crop.id'				}
				,{	name: 'activityName'			,mapping: 'activity.name'  		}
				,{	name: 'activity'				,mapping: 'activity.id'			}
				,{	name: 'seasonStartDate'											}
				,{	name: 'seasonEndDate'											}
				,{	name: 'active'													}
				,{	name: 'locked'													}
				,{	name: 'conductedYear'											}
			 ]
		});
	}
	,getSeasonCalendars: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'seasonCalendarService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'SeasonCalendar'
					,proxy	: proxy
				});
	}
	,getSeasonCalendarGrid : function()
	{
		var me			=	this;
		me.seasons = me.getSeasons();
		me.crops = me.getCrops();
		me.activities = me.getActivities();
		me.seasons.load();
		me.crops.load();
		me.activities.load();
		var seasonCalendarGrid	=	{
			xtype		: 'customgrid'
			,itemId		: 'seasonCalendarGrid'
			,title		: 'Season Calendar'
			,store		: me.getSeasonCalendars()
			,selModel	: {fireSelectionChangeOnStoreRefresh: true}
			,tbar		: 
			[
				{xtype	: 'customtbarbutton'		,text : 'Add Season Calendar'		,iconCls : 'x-atp-add'								,handler : function(btn) { me.createSeasonCalendar(btn)}	}
				,{xtype	: 'customtbarbutton'		,text : 'Edit Season Calendar'		,iconCls : 'x-atp-edit'			,itemId : 'editSeasonCalendarBtn'	,handler : function(btn) { me.editSeasonCalendar(btn.up('grid#seasonCalendarGrid'))}	,disabled : true}
				,{xtype	: 'customtbarbutton'		,text : 'Activate Season Calendar'	,iconCls : 'x-tab-activate'		,itemId : 'activateCalendarBtn'		,handler : function(btn) { me.activateSeasonCalendar(btn)}	,disabled: true	}
				,{xtype	: 'customtbarbutton'		,text : 'Deactivate Season Calendar',iconCls : 'x-tab-deactivate'	,itemId : 'inActivateCalendarBtn'	,handler : function(btn) { me.inActivateSeasonCalendar(btn)}	,disabled: true	}
				//,{xtype	: 'customtbarbutton'		,text : 'Lock Season Calendar'		,iconCls : 'x-tab-locked'		,itemId : 'lockCalendarBtn'		,handler : function(btn) { me.lockSeasonCalendar(btn)}	,disabled: true	}
			]
			,columns	: me.getColumns()
			,listeners	:
			{
				itemdblclick : function(view)
				{
					me.editSeasonCalendar(view.grid)
				}
				,selectionchange : function(selModel, records)
				{
					if(records.length > 0)
					{
						selModel.view.grid.down('button#editSeasonCalendarBtn').setDisabled(false);
					}
					else
					{
						selModel.view.grid.down('button#editSeasonCalendarBtn').setDisabled(true);	
					}

					if(records[0].get('active'))
					{
						selModel.view.grid.down('button#activateCalendarBtn').setDisabled(true);
						selModel.view.grid.down('button#inActivateCalendarBtn').setDisabled(false);
					}
					else
					{
						selModel.view.grid.down('button#activateCalendarBtn').setDisabled(false);
						selModel.view.grid.down('button#inActivateCalendarBtn').setDisabled(true);
					}

					/*if(records[0].get('locked') && CURRENTUSER.ROLE != CONSTANTS.ROLES.RBM)
					{
						selModel.view.grid.down('button#editSeasonCalendarBtn').setDisabled(true);
						selModel.view.grid.down('button#lockCalendarBtn').setDisabled(true);
					}
					else
					{
						selModel.view.grid.down('button#editSeasonCalendarBtn').setDisabled(false);
						selModel.view.grid.down('button#lockCalendarBtn').setDisabled(false);
					}*/
				}
			}
		};
		return seasonCalendarGrid;
	}
	,getColumns: function()
	{
		var me = this;
		var columns = [
			 {	text : 'Name'					,dataIndex : 'name'					}
			,{	text : 'Season'					,dataIndex : 'seasonName'			}
			,{	text : 'Crop'					,dataIndex : 'cropName'				}
			,{	text : 'Activity'				,dataIndex : 'activityName'			}
			,{	text : 'Start Date'				,dataIndex : 'seasonStartDate'	,filter: 'date'	,renderer : U.renderFormattedDate	}
			,{	text : 'End Date'				,dataIndex : 'seasonEndDate'	,filter: 'date'	,renderer : U.renderFormattedDate	}
			,{	text : 'Status'					,dataIndex : 'active'			,renderer : function(v) { return me.renderSeasonCalStaus(v);}}
			//,{	text : 'Locked '				,dataIndex : 'locked'			,renderer : function(v) {if(v){return "Yes";} else return "No";}		}
			,{	text : 'Year'					,dataIndex : 'conductedYear'		}
		];

		if (CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.COUNTRY || CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.CU)
		{
			columns.push({text : 'Region'	,dataIndex : 'regionName'	});
		}

		return columns;
	}
	,activateSeasonCalendar : function(btn)
	{
		var me = this;
		var grid = btn.up('grid#seasonCalendarGrid');
		var mask = Utilities.showLoadMask(grid);
		var record = grid.getSelectionModel().getSelection()[0];
		Ext.Ajax.request(
		{
			url	: ATP.Urls.activateCalendar
			,params : {
				id : record.get('id')
			}
			,success: function(response)
			{
				mask.destroy();
				var text = Ext.decode(response.responseText);
				if(text.success)
				{
					grid.down('button#activateCalendarBtn').setDisabled(true);
					grid.getStore().load();
					Utilities.showAlert("Success",text.message);
				}
				else
				{
					Utilities.showAlert("Failure",text.message,Ext.MessageBox.ERROR);
				}
			}
			,failure: function(response, opts) 
			{
				mask.destroy();
				var text = Ext.decode(response.responseText);
				Utilities.showAlert("Failure",text.message,Ext.MessageBox.ERROR);
			}
		});
	}
	,inActivateSeasonCalendar : function(btn)
	{
		var me = this;
		var grid = btn.up('grid#seasonCalendarGrid');
		var record = grid.getSelectionModel().getSelection()[0];
		
		Utilities.showAlert("Confirm","Do you want to In Active "+record.get('name'),"",Ext.MessageBox.OKCANCEL, function(btn){
			if(btn == "ok")
			{
				var mask = Utilities.showLoadMask(grid);
				Ext.Ajax.request({
					url	: ATP.Urls.deActivateCalendar
					,params : {
						id : record.get('id')
					},
					success: function(response)
					{
						mask.destroy();
						var text = Ext.decode(response.responseText);
						if(text.success)
						{
							grid.down('button#inActivateCalendarBtn').setDisabled(true);
							grid.getStore().load();
							Utilities.showAlert("Success",text.message);
						}
						else
						{
							Utilities.showAlert("Failure",text.message,Ext.MessageBox.ERROR);
						}
						
					}
					,failure: function(response, opts) 
					{
						mask.destroy();
						var text = Ext.decode(response.responseText);
						Utilities.showAlert("Failure",text.message,Ext.MessageBox.ERROR);
					}
				});
			}
		});
	}
	,lockSeasonCalendar : function(btn)
	{
		var me = this;
		var grid = btn.up('grid#seasonCalendarGrid');
		var record = grid.getSelectionModel().getSelection()[0];
		
		Utilities.showAlert("Confirm","Do you want to Lock "+record.get('name'),"",Ext.MessageBox.OKCANCEL, function(btn){
			if(btn == "ok")
			{
				var mask = Utilities.showLoadMask(grid);
				Ext.Ajax.request({
					url	: ATP.Urls.lockCalendar
					,params : {
						id : record.get('id')
					},
					success: function(response)
					{
						mask.destroy();
						var text = Ext.decode(response.responseText);
						if(text.success)
						{
							grid.down('button#lockCalendarBtn').setDisabled(true);
							grid.getStore().load();
							Utilities.showAlert("Success",text.message);
						}
						else
						{
							Utilities.showAlert("Failure",text.message,Ext.MessageBox.ERROR);
						}
						
					}
					,failure: function(response, opts) 
					{
						mask.destroy();
						var text = Ext.decode(response.responseText);
						Utilities.showAlert("Failure",text.message,Ext.MessageBox.ERROR);
					}
				});
			}
		});
		
		
	}
	,getSeasons : function()
	{
		var seasonService = Ext.create('Ext.data.ComboStore',
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

		return seasonService;
	}
	,getCrops : function()
	{
		var cropService = Ext.create('Ext.data.ComboStore',
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

		return cropService;
	}
	,getActivities : function()
	{
		var activityService = Ext.create('Ext.data.ComboStore',
				{
					autoLoad	: true
					,autoDestroy: false
					,proxy		: 
					{
						type	: 'ajax'
						,url	: './comboData?actionType=activityService'
						,reader	: 'combojsonreader'
					}
				});

		return activityService;
	}
	,createSeasonCalendar : function(btn)
	{
		var me = this;
		var grid = btn.up('grid#seasonCalendarGrid');
		var form = me.getSeasonCalendarForm(null,grid);
	}
	,editSeasonCalendar : function(grid)
	{
		var me = this;
		var record = grid.getSelectionModel().getSelection()[0];
		if (!record.get('locked') || (record.get('locked') && CURRENTUSER.ROLE == CONSTANTS.ROLES.RBM))
		{
			var form = me.getSeasonCalendarForm(record.get('id'),grid).down('form#seasonCalendarForm');
			form.loadRecord(record);
		}
	}
	,getSeasonCalendarForm : function(id,grid)
	{
		var me = this;
		var formItems = [];
		var labelWidth = 100;
		if(CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.COUNTRY)
		{
			labelWidth = 135;
			formItems.push(
			{
				xtype		: 'customcombo'
				,fieldLabel	: 'Commercial Unit'
				,name		: 'commercialUnit'
				,submitValue: false
				,store		: me.getCuommercialUnitStore()
				,allowBlank	: false
				,listeners	:
				{
					change	: function(combo,newVal)
					{
						var store = combo.next('combo#regionCombo').getStore();
						store.getProxy().getExtraParams().extraParams = newVal;
						store.load();
					}
				}
			}
			,{
				xtype		: 'customcombo'
				,fieldLabel	: 'Region'
				,itemId		: 'regionCombo'
				,name		: 'region'
				,store		: me.getRegionStore()
				,allowBlank	: false
			});
		}
		
		formItems.push(
				{
					xtype		: 'hidden'
					,name		: 'id'
				}
				,{
					fieldLabel	: 'Name'
					,name		: 'name'
					,allowBlank	: false
					,listeners	: 
					{
						change: function(field, value)
						{
							U.validateUniqueness(field, value, id, ATP.Urls.validateSeasonCalendar);
						}
					}
				}
				,{
					xtype			: 'customcombo'
					,fieldLabel		: 'Season'
					,name			: 'season'
					,allowBlank		: false
					,store			: me.seasons
				}
				,{
					xtype			: 'customcombo'
					,fieldLabel		: 'Crop'
					,name			: 'crop'
					,itemId			: 'crop'
					,allowBlank		: false
					,store			: me.crops
				}
				,{
					xtype			: 'customcombo'
					,fieldLabel		: 'Activity'
					,itemId			: 'activity'
					,allowBlank		: false
					,name			: 'activity'
					,store			: me.activities
				}
				,{
					xtype			: 'datefield'
					,fieldLabel		: 'Start Date'
					,name			: 'seasonStartDate'
					,endDateItemId	: 'seasonEndDate'
					,itemId			: 'seasonStartDate'
					,vtype			: 'dateRange'
					,allowBlank		: false
				}
				,{
					xtype			: 'datefield'
					,fieldLabel		: 'End Date'
					,vtype			: 'dateRange'
					,itemId			: 'seasonEndDate'
					,startDateItemId: 'seasonStartDate'
					,name			: 'seasonEndDate'
					,allowBlank		: false
				}
				,{
					xtype			: 'combobox'
					,fieldLabel		: 'Sale Year'
					,name			: 'conductedYear'
					,queryMode		: 'local'
					,forceSelection	: true
					,store			: me.getYearData()
					,allowBlank		: false
				}
				,{
					xtype			: 'customcombo'
					,fieldLabel		: 'Status'
					,itemId			: 'status'
					,name			: 'active'
					,value			: true
					,allowBlank		: false
					,store			: COMMON.getStatusStore()
				}
				,{
					xtype			: 'hidden'
					,name			: 'locked'
					,value			: false
				}
		);
		
		
		var me = this;
		var seasonCalendarForm = Ext.create('Ext.custom.form.Panel',
				{
					itemId			: 'seasonCalendarForm'
					,defaultType	: 'textfield'
					,fieldDefaults	: {labelWidth: labelWidth}
					,items			: formItems
					,buttons	: 
					[
						{
							xtype	: 'customformcancelbutton'
						},{
							xtype	: 'customformsubmitbutton'
							,handler : function()
							{
								me.saveSeasonCalendar(seasonCalendarForm, grid)
							}
						}
					]
				});
		
		return	Utilities.showWindow({
			title	: 'Season Calendar'
			,items	: seasonCalendarForm
			,width	: 500
		});
	}
	,renderSeasonCalStaus : function(status)
	{
		if(status)
		{
			return "<img src='./images/active.png' />";
		}
		else
		{
			return "<img src='./images/inactive.png' />";
		}
	}
	,getYearData	: function()
	{
		var years = [];
		var currentYear = new Date().getFullYear();
		for (var i = 2015;i<= (currentYear+3); i++)
		{
			years.push(i);
		}
		return years;
	}
	,saveSeasonCalendar : function(scForm, scGrid)
	{
		var mask = Utilities.showLoadMask(scForm.up('window')).show();
		scForm.submit({
			url		: './command?actionType=seasonCalendarService'
			,jsonSubmit : true
			,method	: 'POST'
			,success : function(form, action)
			{
				mask.destroy();
				if(action.result.transacted == false)
				{
					Utilities.showAlert('Message', action.result.message);
					return;
				}
				Utilities.showAlert('Success', action.result.message);
				scGrid.getStore().load();
				scForm.up('window').close();
			}
			,failure : function(form, action)
			{
				mask.destroy();
				Utilities.showAlert('Failure',action.result.message);
			}
		});
	}
	,getCuommercialUnitStore : function()
	{
		var me = this;
		if(me.commercialUnits != null)
		{
			return me.commercialUnits;
		}
		else
		{
			return me.commercialUnits = Ext.create('Ext.data.ComboStore',
			{
				autoLoad	: true
				,autoDestroy: false
				,proxy		: 
				{
					type	: 'ajax'
					,url	: './comboData?actionType=commercialUnitService'
					,reader	: 'combojsonreader'
				}
			});
		}
	}
	,getRegionStore : function()
	{
		var me = this;
		if(me.regions != null)
		{
			return me.regions;
		}
		else
		{
			return me.regions = Ext.create('Ext.data.ComboStore',
			{
				autoLoad	: false
				,autoDestroy: false
				,proxy		: 
				{
					type	: 'ajax'
					,url	: './comboData?actionType=regionService'
					,reader	: 'combojsonreader'
				}
			});
		}
	}
	
}

SEASON_CALENDAR.init();
