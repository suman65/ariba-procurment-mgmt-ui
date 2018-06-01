/**
 * @author rabindranath.s
 */

var TARGET_UPLOAD = 
{
	init: function()
	{
		
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
				,url 		: ATP.Urls.getActiveUnlockedSeasonCalendarsByregionId
				,reader 	: 'combojsonreader'
			}
		});
	}
	,getTargetUploadScreen: function()
	{
		var me = this;
		var formPanel =  {
			xtype		: 'customform'
			,defaults	: {allowBlank: false	,labelWidth: 150	/*,maxWidth: 500*/}
			,items		:
			[
				{
					xtype		: 'customcombo'
					,name		: 'commercialUnit'
					,store		: TARGET_DEMAND.getCommercialUnits()
					,fieldLabel	: 'Commercial Unit'
					,emptyText	: 'Select Commercial Unit'
					,submitValue: false
					,listeners	:
					{
						afterrender: function(combo)
						{
							combo.getStore().on({
								load : function(s, records)
								{
									if (CURRENTUSER.ACCESS_LEVEL != CONSTANTS.ROLES_ACCES_LEVEL.COUNTRY)
									{
										combo.setReadOnly(true);
										var r = s.findRecord('id', CURRENTUSER.CU, 0, false, true, true);
										if (CURRENTUSER.CU && r)
										{
											combo.setValue(r);
											combo.resetOriginalValue();
										}
									}
								}
							});
	
							combo.getStore().load();
						}
						,change: function(combo, newVal)
						{
							var regionStore = combo.next('combo[name=region]').getStore();
							if (!!newVal)
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
					,emptyText	: 'Select Region'
					,submitValue: false
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
											combo.resetOriginalValue();
										}
									}
								}
							});
						}
						,change: function(combo, newVal)
						{
							var rbmCombo = combo.next('combo[name=rbm]');
							var tblCombo = combo.next('combo[name=tbl]');
							var seasonCalendarCombo = combo.next('combo[name=seasonCalendar]');

							var rbmStore = rbmCombo.getStore();
							var tblStore = tblCombo.getStore();
							var seasonCalendarStore = seasonCalendarCombo.getStore();

							rbmCombo.clearValue();
							tblCombo.clearValue();
							seasonCalendarCombo.clearValue();

							if (!!newVal)
							{
								rbmStore.getProxy().setExtraParam('regionId', newVal);
								tblStore.getProxy().setExtraParam('regionId', newVal);
								seasonCalendarStore.getProxy().setExtraParam('regionId', newVal);

								rbmStore.load();
								tblStore.load();
								seasonCalendarStore.load();
							}
							else
							{
								rbmStore.removeAll();
								tblStore.removeAll();
								seasonCalendarStore.removeAll();
							}
						}
					}
				}
				/**
				 * RBM Selection is required to set the TBL Target
				 */
				,{
					xtype		: 'customcombo'
					,name		: 'rbm'
					,store		: TARGET_DEMAND.getRBMs()
					,fieldLabel	: 'RBM'
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
											combo.resetOriginalValue();
										}
									}
								}
							});
						}
					}
				},{
					xtype		: 'customcombo'
					,name		: 'tbl'
					,store		: TARGET_DEMAND.getTBLs()
					,fieldLabel	: 'TBL'
					,emptyText	: 'Select TBL'
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
											combo.resetOriginalValue();
										}
									}
								}
							});
						}
					}
				},{
					xtype		: 'customcombo'
					,name		: 'seasonCalendar'
					,store		: me.getSeasonCalendars()
					,fieldLabel	: 'Season Calendar'
					,emptyText	: 'Select Season Calendar'
					,listeners	:
					{
						select: function(combo, rec)
						{
							var hybridCombo = combo.next('combo[name=hybrid]');
							var seasonCalendarId = rec.get('id');
							var seasonId	= rec.get('seasonId');
							var cropId		= rec.get('cropId');
							var activityId	= rec.get('activityId');

							this.next('textfield[name=crop]').setValue(rec.get('cropName'));
							this.next('textfield[name=activity]').setValue(rec.get('activityName'));
							this.next('textfield[name=season]').setValue(rec.get('seasonName'));
							this.next('textfield[name=conductedYear]').setValue(rec.get('conductedYear'));
						}
					}
				},{
					xtype		: 'textfield'
					,fieldLabel	: 'Crop'
					,name		: 'crop'
					,readOnly	: true
					,name		: 'crop'
					,submitValue: false
				},{
					xtype		: 'textfield'
					,fieldLabel	: 'Activity'
					,readOnly	: true
					,name		: 'activity'
					,submitValue: false
				},{
					xtype		: 'textfield'
					,fieldLabel	: 'Season'
					,readOnly	: true
					,name		: 'season'
					,submitValue: false
				},{
					xtype		: 'textfield'
					,fieldLabel	: 'Conducted Year'
					,readOnly	: true
					,name		: 'conductedYear'
					,submitValue: false
				},{
					xtype		: 'filefield'
					,fieldLabel	: 'Select File'
					,name		: 'multipartFile'
					,allowBlank	: false
					,clearOnSubmit: false
					,buttonText	: '<b>Browse</b>'
				}
				/*,{	xtype : 'tbspacer' , height : 30}
				,{
					xtype: 'button', text: 'Download Excel' ,iconCls: 'x-atp-excel' ,handler:function()
					{
						window.open('./excelFormats/TARGET_DEMAND_MDR_DATEWISE_FORMAT.xlsx');
					}
				}*/
			]
			,buttons	:
			[
				'->'
				,{
					xtype		: 'customformsubmitbutton'
					,text		: 'Submit'
					,handler 	: function()
					{
						var form	=	this.up('form');
						var fileField = form.down('[name=multipartFile]');
						var fileExtention		=	fileField.getValue().split('.');
						var extention			=	fileExtention[fileExtention.length-1];
						if (extention	== 'xlsx' || extention == 'xls' || extention == 'xlsm')
						{
							form.getForm().submit(
							{
								url	: ATP.Urls.uploadMDRTarget
								,success: function(p1, p2) 
								{
									var jsonData = Ext.JSON.decode(p2.response.responseText);
									U.showAlert(getLabel('ATP.GLOBAL.SUCCESS'), jsonData.message);
									fileField.clearOnSubmit = true;
									form.reset();
									fileField.clearOnSubmit = false;
								}
								,failure : function(form, action)
								{
									U.showAlert(getLabel('ATP.GLOBAL.FAILURE') , action.result.message ? action.result.message : 'Unable To Upload.', Ext.MessageBox.ERROR);
								}
							});
						}
						else
						{
							U.showAlert(getLabel('ODCH.GLOBAL.WARNING'), "Only Excel File Can Be Uploaded, Please Select Required File");
						}
					}
				}
			]
		};

		return formPanel;
	}
}

TARGET_UPLOAD.init();
