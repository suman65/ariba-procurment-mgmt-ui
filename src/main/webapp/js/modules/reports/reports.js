var REPORTS = {
		init	: function()
		{
			this.defineATPReportForm();
		}
		,yearStore		: null
		,activityStore	: null
		,defineATPReportForm: function()
		{
			Ext.define('Ext.container.atpReports.Container', 
			{
				extend		: 'Ext.form.Panel'
				,xtype		: 'atpReportsfilter'
				,title		: 'Report Filter'
				,bodyStyle	: 'padding:15px'
				,cls		: 'x-atp-reportfilters'
				,width		: '100%'
				,fieldDefaults: {labelWidth	: 150,anchor: '100%',labelStyle: 'font-weight:bold;',labelSeparator: ''}
				,initComponent	: function()
				{
					var me = this;
					me.items = 
					[
						{
							 xtype			: 'customcombo'
							,fieldLabel		: 'Commercial Unit'
							,store			: REPORTS.getCuStore()
							,name			: 'commercialUnit'
							,allowBlank		: false
							,listeners		: 
							{
								change	: function(combo,newVal)
								{
									var regionCombo = combo.next('combo#regionCombo');
									var regionStore = regionCombo.getStore();
									if(newVal != 0)
									{
										regionStore.getProxy().setExtraParam('extraParams', newVal);
										regionStore.load();
									}
									else
									{
										regionStore.removeAll();
										regionStore.insert(0, {id : '0'		,name : "ALL"	});
										regionCombo.setValue(0);
									}
								}
								,render : function(combo)
								{
									combo.getStore().on({
										load : function()
										{
											if(CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.COUNTRY)
											{
												combo.setValue(0);
											}
											else
											{
												combo.setValue(CURRENTUSER.CU);
												combo.setReadOnly(true);
											}
										}
									});
								}
							}
						},{
							xtype			: 'customcombo'
							,fieldLabel		: 'Region'
							,itemId			: 'regionCombo'
							,name			: 'region'
							,store			: REPORTS.getRegionStore()
							,allowBlank		: false
							,listeners		:
							{
								render		: function(combo)
								{
									combo.getStore().on({
										load : function()
										{
											if(CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.COUNTRY || CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.CU)
											{
												combo.setValue(0);
												combo.setReadOnly(false);
											}
											else 
											{
												combo.setValue(CURRENTUSER.REGION);
												combo.setReadOnly(true);
											}
										}
									});
								}
							}
						},{
							xtype			: 'combobox'
							,fieldLabel		: 'Year'
							,name			: 'conductedYear'
							,queryMode		: 'local'
							,forceSelection	: true
							,store			: REPORTS.yearStore
							,allowBlank		: false
							,multiSelect	: true
						},{
							xtype 			: 'customcombo'
							,fieldLabel 	: 'Season'
							,name			: 'season'
							,store			: REPORTS.getSeasonStore()
							,allowBlank		: false
							,multiSelect	: true
						},{
							 xtype 			: 'customcombo'
							,fieldLabel 	: 'Crop'
							,name			: 'crop'
							,store			: REPORTS.getCropStore()
							,allowBlank		: false
							,multiSelect	: true
						}
						,me.specificItems
					]
					me.callParent(arguments);
				}
			});
		}
		,getReportsPanel : function()
		{
			var me = this;
			me.yearStore = me.getYearStore();
			me.activityStore = me.getAcivityStore();
			var reports =	{
				xtype		: 'container'
				,width		: '100%'
				,height		: '100%'
				,scrollable : true
				,layout		: {type	: 'vbox'}
				,items		:	
				[
					{
						xtype	: 'container'
						,layout	: 'hbox'
						,width	: '100%'
						,items	: 
						[
							{
								xtype		: 'atpReportsfilter'
								,itemId		:'report1Filters'
								,margin		: '0 2 2 0'
								,frame		: true
								,width		: '50%'
								,title		: 'Activity Wise Report'
								,specificItems 	:  {
									xtype 		: 'customcombo'
									,fieldLabel : 'Activity Type'
									,name		: 'activity'
									,store		: me.activityStore
									,allowBlank	: false
								}
								,buttons: 
								[
								'->',
									{
										xtype		: 'customformsubmitbutton'
										,text		: 'Export'
										,iconCls	: 'x-atp-excel'
										,formBind	: true
										,handler	: function(btn)
										{
											var report1form = btn.up('form#report1Filters');
											var values = report1form.getValues();
											values.conductedYear = values.conductedYear.join(', ');
											values.season = values.season.join(',');
											values.crop = values.crop.join(',');
											var str = Ext.encode(values)
											window.open("./reports/getReports?jsonData="+str+"&method=generateActivityReport&fileName=ActivityWiseReport");
										}
									}
								,'->'
								]
							}
							,{
								xtype		: 'atpReportsfilter'
								,title		: 'Sample Report'
								,itemId		: 'report2Filters'
								,frame		: true
								,width		: '50%'
								,specificItems: {
									xtype 		: 'customcombo'
									,fieldLabel : 'Pravakta'
									,name		: 'category'
									,store		: me.getCategoryStore()
									,allowBlank	: false
								}
								,buttons: 
								[
								 '->',
									{ 
										xtype		: 'customformsubmitbutton'
										,iconCls	: 'x-atp-excel'
										,text		: 'Export'
										,formBind	: true
										,handler	: function(btn)
										{
											var report2form = btn.up('form#report2Filters');
											var values = report2form.getValues();
											values.conductedYear = values.conductedYear.join(', ');
											values.season = values.season.join(',');
											values.crop = values.crop.join(',');
											var str = Ext.encode(values)
											window.open("./reports/getReports?jsonData="+str+"&method=generateSampleReport&fileName=SampleReport");
										}
									}
								,'->'
								]
							}
						]
					},
					{
						xtype	: 'container'
						,layout	: 'hbox'
						,width	: '100%'
						,items	:
						[
							{
								xtype		: 'atpReportsfilter'
								,title		: 'Activity Wise Summary Report'
								,itemId		:'report3Filters'
								,frame		: true
								,margin		: '0 2 2 0'
								,width		: '50%'
								,specificItems:  {
									xtype 		: 'customcombo'
									,fieldLabel : 'Activity Type'
									,name		: 'activity'
									,store		: me.activityStore
									,allowBlank	: false
								}
								,buttons: 
								[
								'->',
									{ 
									 	xtype		: 'customformsubmitbutton'
										,iconCls	: 'x-atp-excel'
										,text		: 'Export'
										,formBind	: true
										,handler	: function(btn)
										{
											var report2form = btn.up('form#report3Filters');
											var values = report2form.getValues();
											values.conductedYear = values.conductedYear.join(', ');
											values.season = values.season.join(',');
											values.crop = values.crop.join(',');
											var str = Ext.encode(values)
											window.open("./reports/getReports?jsonData="+str+"&method=getActivitySummaryReport&fileName=ActivitySummaryReport");
										}
									}
								 ,'->'
								]
							}
							,{
								xtype		: 'atpReportsfilter'
								,title		: 'Sample Summary Report'
								,frame		: true
								,itemId		: 'report4Filters'
								,width		: '50%'
								,specificItems: {
									xtype 		: 'customcombo'
									,fieldLabel : 'Pravakta'
									,name		: 'category'
									,store		: me.getCategoryStore()
									,allowBlank	: false
								}
								,buttons: 
								[
								'->',
									{
										xtype		: 'customformsubmitbutton'
										,iconCls	: 'x-atp-excel'
										,text		: 'Export' 
										,formBind	: true
										,handler	: function(btn)
										{
											var report2form = btn.up('form#report4Filters');
											var values = report2form.getValues();
											values.conductedYear = values.conductedYear.join(', ');
											values.season = values.season.join(',');
											values.crop = values.crop.join(',');
											var str = Ext.encode(values)
											window.open("./reports/getReports?jsonData="+str+"&method=getSampleSumaryReport&fileName=SampleSummaryReport");
										}
									}
								,'->'
								]
							}
						]
					}
				]
			}
			return reports;
		}
		,getCuStore		: function()
		{
			var commercialUnitStore = Ext.create('Ext.data.ComboStore',
				{
					autoLoad	: true
					,proxy		: 
					{
						type	: 'ajax'
						,url	: './comboData?actionType=commercialUnitService'
						,reader	: 'combojsonreader'
					}
					,listeners	:
					{
						load	: function(store, records)
						{
							if(CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.COUNTRY )
							{
								store.insert(0,{name: 'ALL'	,id: '0'});
							}
						}
					}
				});
			return commercialUnitStore;
		}
		,getRegionStore : function()
		{
			var regionStore = Ext.create('Ext.data.ComboStore',
				{
					autoLoad	: false
					,proxy		: 
					{
						type	: 'ajax'
						,url	: './comboData?actionType=regionService'
						,reader	: 'combojsonreader'
					}
					,listeners	:
					{
						load	: function(store, records)
						{
							if( CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.COUNTRY || CURRENTUSER.ACCESS_LEVEL == CONSTANTS.ROLES_ACCES_LEVEL.CU )
							{
								store.insert(0,{name: 'ALL'	,id: '0'});
							}
						}
					}
				});
			return regionStore;
		}
		,getSeasonStore : function()
		{
			var seasonService = Ext.create('Ext.data.ComboStore',
					{
						autoLoad	: true
						,proxy		: 
						{
							type	: 'ajax'
							,url	: './comboData?actionType=seasonService'
							,reader	: 'combojsonreader'
						}
					});
				return seasonService;
		}
		,getCropStore : function()
		{
			var cropStore =   Ext.create('Ext.data.ComboStore',
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
			return cropStore;
		}
		,getYearStore	: function()
		{
			var me = this;
			if (!me.yearStore)
			{
				var years = [];
				var currentYear = new Date().getFullYear();
				for (var i = 2014; i<= (currentYear); i++)
				{
					years.push(i);
				}
				me.yearStore = years;
			}
			return me.yearStore;
		}
		,getAcivityStore : function()
		{
			var me = this;
			if (!me.actvitiesStore)
			{
				me.actvitiesStore = Ext.create('Ext.data.Store',
				{
					fields	:	['id', 'name']
					,data	: 
					[
						 {id : 0									,name : "ALL"					}
						,{id : CONSTANTS.ACTIVITY_IDS.PDA			,name : CONSTANTS.ACTIVITIES.PDA}
						,{id : CONSTANTS.ACTIVITY_IDS.PSA			,name : CONSTANTS.ACTIVITIES.PSA}
						,{id : CONSTANTS.ACTIVITY_IDS.OSA			,name : CONSTANTS.ACTIVITIES.OSA}
					]
				});
			}
			return me.actvitiesStore;
		}
		,getCategoryStore : function()
		{
			var categoryStore = Ext.create('Ext.data.Store',
					{
						fields	:	['id', 'name']
						,data	: 
						[
						 	 {id : '0'					,name : "ALL"	}
						 	,{id : '1'					,name : "Yes"	}
						 	,{id : '2'					,name : "No"	}
						]
					});
			return categoryStore;
		}
};

REPORTS.init();