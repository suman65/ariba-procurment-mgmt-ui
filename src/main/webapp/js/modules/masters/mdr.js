/**
 * @author rabindranath.s
 */

var MDR_INFO =	
{
	init: function()
	{
		this.defineMDR();
	}
	,commercialUnits : null
	,defineMDR : function()
	{
		Ext.define('MDR', 
		{
			extend	: 'Ext.data.Model',
			fields	:
			[
				 {	name: 'id'														}
				,{	name: 'name'													}
				,{	name: 'loginId'													}
				,{	name: 'password'												}
				,{	name: 'mobileNo'  												}
				,{	name: 'email'													}
				,{	name: 'active'													}
				,{	name: 'createdDate'												}
				,{	name: 'updatedDate'												}
				,{	name: 'commercialUnitName'		,mapping: 'commercialUnit.name'	}
				,{	name: 'commercialUnit'			,mapping: 'commercialUnit.id'	}
				,{	name: 'regionName'				,mapping: 'region.name'			}
				,{	name: 'region'					,mapping: 'region.id'			}
				,{	name: 'stateName'				,mapping: 'state.name'			}
				,{	name: 'state'					,mapping: 'state.id'			}
				,{	name: 'districtName'			,mapping: 'district.name'		}
				,{	name: 'district'				,mapping: 'district.id'			}
				,{	name: 'reportingToName'			,mapping: 'reportingTo.name'	}
				,{	name: 'reportingTo'				,mapping: 'reportingTo.id'	}
				,{	name: 'forceChangePassword'										}
			 ]
		});
	}
	,getMDRs: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'mdrInfoService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'MDR'
					,proxy	: proxy
				});
	}
	,getMDRGrid : function()
	{
		var me			=	this;
		me.commercialUnits = me.getCommercialUnits();
		var mdrGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.MDR.GRID.TITLE')
			,itemId		: 'mdrGrid'
			,store		: me.getMDRs()
			,tbar		: 
			[
			 	{xtype	: 'customtbarbutton'		,text : 'Add MDR'		,iconCls : 'x-atp-add'							,handler : function(btn) { me.createMDR(btn)}	}
			 	,{xtype	: 'customtbarbutton'		,text : 'Edit MdR'		,iconCls : 'x-atp-edit'	,itemId : 'editMdrBtn'	,handler : function(btn) { me.editMDR(btn.up('grid#mdrGrid'))}	,disabled : true}
			 	,{xtype	: 'customtbarbutton'		,text : 'Resend MDR Password'	,iconCls : 'x-atp-sms'	,itemId : 'resendMdrPwd'	,handler : function(btn) { me.resendMDRPwd(btn.up('grid#mdrGrid'))}	,disabled : true}
			]
			/*,selModel: 
			{
				checkOnly	: true
				,selType: 'checkboxmodel'
			}*/
			,columns		: 
			[
				 {	text : 'Name'					,dataIndex : 'name'				}
				,{	text : 'Login Id'				,dataIndex : 'loginId'			}
				,{	text : 'Email Id'				,dataIndex : 'email'			}
				,{	text : 'Mobile No'				,dataIndex : 'mobileNo'			}
				,{	text : 'Commercial Unit'		,dataIndex : 'commercialUnitName'}
				,{	text : 'Region'					,dataIndex : 'regionName'		}
				,{	text : 'State'					,dataIndex : 'stateName'		}
				,{	text : 'District'				,dataIndex : 'districtName'		}
				,{	text : 'Active'					,dataIndex : 'active'			,renderer : function(v) { return me.renderMdrStaus(v);}}
			]
			,listeners :
			{
				itemdblclick : function(view)
				{
					me.editMDR(view.grid)
				}
				,selectionchange : function(selModel, records)
				{
					if(records.length > 0)
					{
						selModel.view.grid.down('button#resendMdrPwd').setDisabled(false);
						selModel.view.grid.down('button#editMdrBtn').setDisabled(false);
					}
					else
					{
						selModel.view.grid.down('button#resendMdrPwd').setDisabled(true);
						selModel.view.grid.down('button#editMdrBtn').setDisabled(true);	
					}
				}
			}
		};
		return mdrGrid;
	},
	resendMDRPwd	: function(grid)
	{
		var record = grid.getSelectionModel().getSelection()[0];
		U.showProgresText();
		Ext.Ajax.request({
			url		: ATP.Urls.resendMdrPassword
			,params	:
			{
				mdrId : record.get('id')
			}
		 	,success: function(response)
		 	{
		 		var response = Ext.JSON.decode(response.responseText);
		 		U.showAlert(null,response.message);
		 	}
		});
	},
	renderMdrStaus : function(status)
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
	,getCommercialUnits	: function()
	{
		var commercialUnitStore = Ext.create('Ext.data.ComboStore',
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
		return commercialUnitStore;
	}
	,createMDR : function(btn)
	{
		var me = this;
		var mdrGrid = btn.up('grid#mdrGrid')
		var form = me.getMdrForm(mdrGrid);
		if(CONSTANTS.ROLES_ACCES_LEVEL.CU == CURRENTUSER.ACCESS_LEVEL || CONSTANTS.ROLES_ACCES_LEVEL.REGION == CURRENTUSER.ACCESS_LEVEL || 
				CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY == CURRENTUSER.ACCESS_LEVEL)
		{
			form.down('combo#commercialUnit').setValue(CURRENTUSER.CU != null ? CURRENTUSER.CU : null);
		}
		
		if(CONSTANTS.ROLES_ACCES_LEVEL.REGION == CURRENTUSER.ACCESS_LEVEL || CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY == CURRENTUSER.ACCESS_LEVEL)
		{
			form.down('combo#region').setValue(CURRENTUSER.REGION != null ? CURRENTUSER.REGION : null);
		}
		
		if(CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY == CURRENTUSER.ACCESS_LEVEL)
		{
			form.down('combo#reportingTo').setValue(CURRENTUSER.ID);
		}
	}
	,editMDR : function(mdrGrid)
	{
		var me = this;
		var record = mdrGrid.getSelectionModel().getSelection()[0];
		var form = me.getMdrForm(mdrGrid,record.get('id')).down('form#mdrForm');
		form.loadRecord(record);
	}
	,getMdrForm : function(mdrGrid,id)
	{
		var me = this;
		var mdrForm = Ext.create('Ext.custom.form.Panel',
				{
					itemId			: 'mdrForm'
					,defaultType	: 'textfield'
					,fieldDefaults	: {labelWidth: 150}
					,items			: 
					[
						{
							xtype		: 'hidden'
							,name		: 'id'
						}
						,{
							fieldLabel	: 'Name'
							,name		: 'name'
							,allowBlank	: false
						}
						,{
							xtype			: 'customcombo'
							,fieldLabel		: 'Commercial Unit'
							,name			: 'commercialUnit'
							,itemId			: 'commercialUnit'
							,allowBlank		: false
							,store			: me.commercialUnits
							,listeners		: 
							{
								change : function(combo, newVal)
								{
									var regionStore = combo.next('combo#region').getStore();
									if(!!newVal)
									{
										regionStore.getProxy().extraParams.extraParams = newVal;
										regionStore.load();
									}
								}
							}
						}
						,{
							xtype			: 'customcombo'
							,fieldLabel		: 'Region'
							,name			: 'region'
							,itemId			: 'region'
							,allowBlank		: false
							,store			: me.getRegionStore()
							,listeners		: 
							{
								change : function(combo, newVal)
								{
									if(!!newVal)
									{
										var reportingToStore = combo.next('combo#reportingTo').getStore();
										var stateStore = combo.next('combo#state').getStore();
										
										reportingToStore.getProxy().extraParams.extraParams = newVal;
										reportingToStore.load();
										
										stateStore.getProxy().extraParams.extraParams = newVal;
										stateStore.load();
									}
								}
							}
						}
						,{
							xtype			: 'customcombo'
							,fieldLabel		: 'Reporting To'
							,itemId			: 'reportingTo'
							,allowBlank		: false
							,name			: 'reportingTo'
							,store			: me.getReportingTos()
							
						}
						,{
							xtype			: 'customcombo'
							,fieldLabel		: 'State'
							,itemId			: 'state'
							,name			: 'state'
							,allowBlank		: true
							,store			: me.getStates()
							,listeners		: 
							{
								change : function(combo, newVal)
								{
									if(!!newVal)
									{
										var districtStore = combo.next('combo#district').getStore();
										districtStore.getProxy().extraParams.extraParams = newVal;
										districtStore.load();
									}
								}
							}
						}
						,{
							xtype			: 'customcombo'
							,fieldLabel		: 'District'
							,itemId			: 'district'
							,name			: 'district'
							,allowBlank		: true
							,store			: me.getDistrictStore()
						}
						,{
							fieldLabel		: 'Login Id'
							,name			: 'loginId'
							,allowBlank		: false
							,listeners		: 
							{
								change: function(field, value)
								{
									U.validateUniqueness(field, value, id, ATP.Urls.validateLoginId);
								}
							}
						}
						,{
							xtype			: 'numberfield'
							,fieldLabel		: 'Mobile No'
							,hideTrigger	: true
							,name			: 'mobileNo'
							,allowBlank		: false
							,minLength		: 10
							,maxLength		: 10
							,enforceMaxLength	: true
							,listeners		:
							{
								change: function(field, value)
								{
									U.validateUniqueness(field, value, id, ATP.Urls.validateMobileNo);
								}
							}
						}
						,{
							fieldLabel		: 'Email'
							,vtype			: 'email'
							,name			: 'email'
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
							,name			: 'forceChangePassword'
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
								me.saveMdr(mdrForm, mdrGrid)
							}
						}
					]
				});
		
		if(CONSTANTS.ROLES_ACCES_LEVEL.CU == CURRENTUSER.ACCESS_LEVEL || CONSTANTS.ROLES_ACCES_LEVEL.REGION == CURRENTUSER.ACCESS_LEVEL || 
				CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY == CURRENTUSER.ACCESS_LEVEL)
		{
			mdrForm.down('combo#commercialUnit').setReadOnly(true);
		}
		
		if(CONSTANTS.ROLES_ACCES_LEVEL.REGION == CURRENTUSER.ACCESS_LEVEL || CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY == CURRENTUSER.ACCESS_LEVEL)
		{
			mdrForm.down('combo#region').setReadOnly(true);
		}
		
		if(CONSTANTS.ROLES_ACCES_LEVEL.TERRITORY == CURRENTUSER.ACCESS_LEVEL)
		{
			mdrForm.down('combo#reportingTo').setReadOnly(true);
		}
		
		return	Utilities.showWindow({
			title	: 'MDR Info'
			,items	: mdrForm
			,width	: 500
		});
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
			});
		return regionStore;
	}
	,getReportingTos : function()
	{
		var regionStore = Ext.create('Ext.data.ComboStore',
				{
					autoLoad	: false
					,proxy		: 
					{
						type	: 'ajax'
						,url	: './comboData?actionType=userInfoService'
						,reader	: 'combojsonreader'
					}
				});
		return regionStore;
	}
	,getStates : function()
	{
		var stateStore = Ext.create('Ext.data.ComboStore',
				{
					autoLoad	: false
					,proxy		: 
					{
						type	: 'ajax'
						,url	: './comboData?actionType=stateService'
						,reader	: 'combojsonreader'
					}
				});
		return stateStore;
	}
	,getDistrictStore : function()
	{
		var districtStore = Ext.create('Ext.data.ComboStore',
				{
					autoLoad	: false
					,proxy		: 
					{
						type	: 'ajax'
						,url	: './comboData?actionType=districtService'
						,reader	: 'combojsonreader'
					}
				});
		return districtStore;
	}
	,saveMdr : function(mdrForm, mdrGrid)
	{
		var mask = Utilities.showLoadMask(mdrForm.up('window')).show();
		mdrForm.submit({
			url		: './command?actionType=mdrInfoService'
			,jsonSubmit : true
			,method	: 'POST'
			,success : function(form, action)
			{
				mask.destroy();
				mdrForm.up('window').close();
				Utilities.showAlert('Success', action.result.message);
				mdrGrid.getStore().load();
			}
			,failure : function(form, action)
			{
				mask.destroy();
				Utilities.showAlert('Failure',action.result.message);
			}
		});
	}
}

MDR_INFO.init();
