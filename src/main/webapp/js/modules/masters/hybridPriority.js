var HYBRID_PRIORITY = 
{
	init : function()
	{
		this.defineHybridPriority();
	}
	,crops	: null
	,hybrid1Store : null
	,hybrid2Store : null
	,hybrid3Store : null
	,defineHybridPriority : function()
	{
		Ext.define('HybridPriority', 
		{
			extend	: 'Ext.data.Model',
			fields	:
			[
				 {	name: 'hybrid1Name'					}
				,{	name: 'hybrid2Name'					}
				,{	name: 'hybrid3Name'					}
				,{	name: 'crop'						}
				,{	name: 'cropName'					}
				,{	name: 'hybrid1'						}
				,{	name: 'hybrid2'						}
				,{	name: 'hybrid3'						}
			]
			,idProperty: 'auto'
		});
	}
	,getHybridPriorityStore : function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'hybridPriorityService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;
		return Ext.create('Ext.data.GridStore',
		{
			 model		: 'HybridPriority'
			,autoLoad	: true
			,groupField	: 'cropName'
			,proxy		: proxy
		});
	}
	,getHybridPriority : function()
	{
		var me			=	this;
		var hybridGrid	=	Ext.create('Ext.custom.grid.Panel', 
		{
			title			: 'Hybrid Priority'
			,itemId			: 'hybridPriorityGrid'
			,applyFilter	: false
			,sortableColumns: false
			//,pagination		: false
			//,features		: [{ftype:'grouping', enableGroupingMenu: false, enableNoGroups : false, groupHeaderTpl: 'Crop: {name}'}]
			,store			: me.getHybridPriorityStore(CURRENTUSER.ID)
			,tbar			:
			[
				 {xtype : 'customtbarbutton'	,text: 'Add Hybrid Priority'	,iconCls:'x-atp-add'	,handler:function(){me.addHybridPriority(hybridGrid)}	}
				,{xtype : 'customtbarbutton'	,text: 'Edit Hybrid Priority'	,iconCls:'x-atp-edit'	,handler:function(){me.editHybridPriority(hybridGrid)}	,itemId: 'editHybrid'	,disabled : true	}
			]
			,columns		: 
			[
			 	  {	text : 'Crop'				,dataIndex : 'cropName'				}
				 ,{	text : 'Hybrid1'			,dataIndex : 'hybrid1Name'			}
				 ,{	text : 'Hybrid2'			,dataIndex : 'hybrid2Name'			}
				 ,{	text : 'Hybrid3'			,dataIndex : 'hybrid3Name'			}
				
			]
			,listeners	: 
			{
				itemdblclick	: function(grid,record)
				{
					me.editHybridPriority(hybridGrid);
				}
				,selectionchange	: function(selectionModel, records)
				{
					if(records.length > 0)
					{
						hybridGrid.down('button#editHybrid').setDisabled(false);
					}
					else
					{
						hybridGrid.down('button#editHybrid').setDisabled(true);	
					}
				}
			}
		});
		return hybridGrid;
	}
	,addHybridPriority : function(hybridGrid)
	{
		var me = this;
		me.getHybridPriorityForm(hybridGrid);
	}
	,editHybridPriority : function(hybridGrid)
	{
		var me = this;
		var win = me.getHybridPriorityForm(hybridGrid,true);
		var form  = win.down('form#hybridForm');
		var record = hybridGrid.getSelectionModel().getSelection()[0];
		form.down('combo#cropCombo').setValue(record.get('crop'));
		form.down('combo#hybrid1').setValue(record.get('hybrid1'));
		form.down('combo#hybrid2').setValue(record.get('hybrid2'));
		form.down('combo#hybrid3').setValue(record.get('hybrid3'));
	}
	,getHybridPriorityForm : function(hybridGrid,editMode)
	{
		var me = this;
		var hybridForm = Ext.create('Ext.custom.form.Panel',
		{
			itemId			: 'hybridForm'
			,items			: 
			[
				{
					xtype		: 'customcombo'
					,fieldLabel	: 'Crop'
					,itemId		: 'cropCombo'
					,name		: 'crop'
					,readOnly	: editMode ? true : false
					,store		: me.getCropStore()
					,listeners	:
					{
						change : function(combo,record)
						{
							me.hybrid1Store = me.getHybrid1Store();
							me.hybrid1Store.getProxy().setExtraParam('cropId', combo.getValue());
							me.hybrid1Store.load();
							
							me.hybrid2Store = me.getHybrid2Store();
							me.hybrid2Store.getProxy().setExtraParam('cropId', combo.getValue());
							me.hybrid2Store.load();
							
							me.hybrid3Store = me.getHybrid3Store();
							me.hybrid3Store.getProxy().setExtraParam('cropId', combo.getValue());
							me.hybrid3Store.load();
						}
						,beforeselect	: function(combo,record)
						{
							var index = hybridGrid.getStore().find('crop',record.get('id'));
							if(index != -1)
							{
								Utilities.showAlert('Alert',"Hybrid Priority for Crop \""+ record.get('name') +"\" is already defined and will be deleted.");
								//return false;
							}
						}
					}
				}
				,{
					xtype		: 'customcombo'
					,name		: 'hybrid1'
					,itemId		: 'hybrid1'
					,fieldLabel	: 'Hybrid 1'
					,store		: me.getHybrid1Store()
					,allowBlank : false
					,listeners	: 
					{
						beforeselect : function(combo,record)
						{
							if(!me.validateHybridSelection(hybridForm,record.get('id')))
							{
								Utilities.showAlert('Alert',"Hybrid "+ record.get('name') +" is already selected select another.");
								return false;
							}
						}
						
					}
				}
				,{
					xtype		: 'customcombo'
					,name		: 'hybrid2'
					,itemId		: 'hybrid2'
					,fieldLabel	: 'Hybrid 2'
					,store		: me.getHybrid2Store()
					,listeners	: 
					{
						beforeselect : function(combo,record)
						{
							if(!me.validateHybridSelection(hybridForm,record.get('id')))
							{
								Utilities.showAlert('Alert',"Hybrid "+ record.get('name') +" is already selected select another.");
								return false;
							}
						}
					}
				}
				,{
					xtype		: 'customcombo'
					,name		: 'hybrid3'
					,itemId		: 'hybrid3'
					,fieldLabel	: 'Hybrid 3'
					,store		: me.getHybrid3Store()
					,listeners	: 
					{
						beforeselect : function(combo,record)
						{
							if(!me.validateHybridSelection(hybridForm,record.get('id')))
							{
								Utilities.showAlert('Alert',"Hybrid "+ record.get('name') +" is already selected select another.");
								return false;
							}
						}
					}
				}
			]
			,buttons			:
			[
				{
					xtype	: 'customformcancelbutton'
				},{
					xtype	: 'customformsubmitbutton'
					,itemId	: 'submitBtnId'
					,handler : function()
					{
						me.saveHybridPriority(hybridGrid,hybridForm)
					}
				}
			]
		});

		return	Utilities.showWindow({
			title	: "Hybrid Info"
			,items	: hybridForm
			,width	: 400
		});
	}
	,saveHybridPriority : function(hybridGrid,hybridForm)
	{
		var me = this;
		var mask = Utilities.showLoadMask(hybridForm.up('window')).show();
		hybridForm.submit({
			url		: ATP.Urls.saveHybridPriority
			,jsonSubmit : true
			,method	: 'POST'
			,success : function(form, action)
			{
				mask.destroy();
				hybridForm.up('window').close();
				Utilities.showAlert('Success', action.result.message);
				hybridGrid.getStore().load();
			}
			,failure : function(form, action)
			{
				mask.destroy();
				Utilities.showAlert('Failure',"Unable to save HybridPriority.");
			}
		});
	}
	,getCropStore : function()
	{
		var me = this;
		if(me.crops)
			return me.crops;
		else
		return	me.crops =   Ext.create('Ext.data.ComboStore',
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
	,getHybrid1Store : function()
	{
		var me = this;
		if(me.hybrid1Store)
			return me.hybrid1Store;
		else
		return	me.hybrid1Store =   Ext.create('Ext.data.ComboStore',
		{
			autoDestroy: false
			,proxy		: 
			{
				type	: 'ajax'
				,url	: ATP.Urls.getHybridsByCropId
				,extraParams: {actionType : 'hybridInfoService'}
				,reader	: 'combojsonreader'
			}
		});
	}
	,getHybrid2Store : function()
	{
		var me = this;
		if(me.hybrid2Store)
			return me.hybrid2Store;
		else
		return	me.hybrid2Store =   Ext.create('Ext.data.ComboStore',
		{
			autoDestroy: false
			,proxy		: 
			{
				type	: 'ajax'
				,url	: ATP.Urls.getHybridsByCropId
				,extraParams: {actionType : 'hybridInfoService'}
				,reader	: 'combojsonreader'
			}
		});
	}
	,getHybrid3Store : function()
	{
		var me = this;
		if(me.hybrid3Store)
			return me.hybrid3Store;
		else
		return	me.hybrid3Store =   Ext.create('Ext.data.ComboStore',
		{
			autoDestroy: false
			,proxy		: 
			{
				type	: 'ajax'
				,url	: ATP.Urls.getHybridsByCropId
				,extraParams: {actionType : 'hybridInfoService'}
				,reader	: 'combojsonreader'
			}
		});
	}
	,validateHybridSelection : function(hybridForm,hybrid)
	{
		var hybrid1 = hybridForm.down('combo#hybrid1').getValue();
		var hybrid2 = hybridForm.down('combo#hybrid2').getValue();
		var hybrid3 = hybridForm.down('combo#hybrid3').getValue();
		if(hybrid == hybrid1 ||  hybrid == hybrid2 || hybrid == hybrid3)
		{
			return false;
		}
		return true;
	}
}

HYBRID_PRIORITY.init();
