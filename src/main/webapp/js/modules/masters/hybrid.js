/**
 * @author rabindranath.s
 */

var HYBRID =	
{
	init: function()
	{
		this.defineHybrid();
	}
	,crops	: null
	,defineHybrid : function()
	{
		Ext.define('Hybrid', 
		{
			extend	: 'Ext.data.Model',
			fields	:
			[
				 {	name: 'id'											}
				,{	name: 'name'										}
				,{	name: 'cropName'			,mapping: 'crop.name'	}
				,{	name: 'crop'				,mapping: 'crop.id'		}
				,{	name: 'createdByName'		,mapping: 'createdBy.name'}
				,{	name: 'createdBy'			,mapping: 'createdBy.id'}
			]
		});
	}
	,getHybrids: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'hybridInfoService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'Hybrid'
					,proxy	: proxy
				});
	}
	,getHybridGrid : function()
	{
		var me			=	this;
		me.crops = me.getCropStore();
		var hybridGrid	=	Ext.create('Ext.custom.grid.Panel', 
		{
			title			: 'Hybrid Details'
			,itemId			: 'hybridGrid'
			,store			: me.getHybrids()
			,tbar			:
			[
				 {xtype : 'customtbarbutton'	,text: 'Add Hybrid'		,iconCls:'x-atp-add'	,handler:function(){me.addHybrid(hybridGrid)}	}
				,{xtype : 'customtbarbutton'	,text: 'Edit Hybrid'	,iconCls:'x-atp-edit'	,handler:function(){me.editHybrid(hybridGrid)}	,itemId: 'editHybrid'	,disabled : true	}
			]
			,columns		: 
			[
				 {	text : 'Name'			,dataIndex : 'name'			}
				,{	text : 'Crop Name'		,dataIndex : 'cropName'		}
			]
			,listeners	: 
			{
				itemdblclick	: function(grid,record)
				{
					me.editHybrid(hybridGrid);
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
	,addHybrid : function(hybridGrid)
	{
		var me = this;
		var form = me.getHybridForm(hybridGrid).down('form#hybridForm');
		var cropStore = form.down('combo#cropCombo').getStore();
		if(cropStore.getCount() > 0)
		{
			form.down('combo#cropCombo').setValue(cropStore.getAt(0));
		}
	},
	editHybrid : function(hybridGrid)
	{
		var me = this;
		var record = hybridGrid.getSelectionModel().getSelection()[0];
		var form = me.getHybridForm(hybridGrid, record.get('id')).down('form#hybridForm');
		form.loadRecord(record);
	}
	,getHybridForm : function(grid, id)
	{
		var me = this;
		var hybridForm = Ext.create('Ext.custom.form.Panel',
		{
			itemId			: 'hybridForm'
			,items			: 
			[
				{
					xtype		: 'hidden'
					,name		: 'id'	
				}
				,{
					xtype		: 'customcombo'
					,fieldLabel	: 'Crop'
					,itemId		: 'cropCombo'
					,name		: 'crop'
					,store		: me.crops
					,listeners	:
					{
						select : function(combo,record)
						{
							var hybridfield = combo.next('textfield#hybrid');
							hybridfield.clearInvalid();
							var value = hybridfield.getValue();
							var crop = { crop : record.get('id')};
							if(value)
							U.validateUniqueness(combo, value, id, ATP.Urls.validateHybridName, crop);
						}
					}
				}
				,{
					xtype		: 'textfield'
					,name		: 'name'
					,itemId		: 'hybrid'
					,fieldLabel	: 'Hybrid'
					,allowBlank : false
					,listeners	: 
					{
						change	: function(field)
						{
							var cropcombo = field.previousSibling('combo#cropCombo');
							cropcombo.clearInvalid();
							var cropId = cropcombo.getValue();
							if(cropId)
							{
								var crop = { crop : cropId};
								U.validateUniqueness(field, field.getValue(), id, ATP.Urls.validateHybridName, crop);
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
					,handler : function()
					{
						me.saveHybrid(grid,hybridForm)
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
	,saveHybrid	: function(grid,hybridForm)
	{
		var me = this;
		var mask = Utilities.showLoadMask(hybridForm.up('window')).show();
		hybridForm.submit({
			url		: './command?actionType=hybridInfoService'
			,jsonSubmit : true
			,method	: 'POST'
			,success : function(form, action)
			{
				mask.destroy();
				hybridForm.up('window').close();
				Utilities.showAlert('Success', action.result.message);
				grid.getStore().load();
			}
			,failure : function(form, action)
			{
				mask.destroy();
				Utilities.showAlert('Failure',"Unable to save HybridInfo");
			}
		});
	}
}

HYBRID.init();
