var COMPETITOR = {
		init	: function()
		{
			this.defineCompetitor();
		},
		defineCompetitor	: function()
		{
			Ext.define('Competitor', 
				{
					extend	: 'Ext.data.Model',
					fields	:
					[
						 {	name: 'name'				}
						 ,{name :'id'				}
						 ,{name : 'checked'			}		
					 ]
				});
			
			Ext.define('CompetitorCropMapModel', 
					{
						extend: 'Ext.data.Model',
						fields: 
							[
								{	name: 'id'									}
								,{	name: 'name'								}
							]
					});
		},
		getCompetitorStore	: function(extraParams)
		{
			var proxy = {
					type		: 'ajax'
					,url		: ATP.Urls.gridData
					,extraParams: {actionType : 'competitorService'}
					,reader		: 'jsonreader'
				}

			if (extraParams) proxy.extraParams.extraParams = extraParams;

			return Ext.create('Ext.data.GridStore',
					{
						 model	: 'Competitor'
						,proxy	: proxy
					});
		},
		getCompetitorGrid	: function()
		{
			var me			=	this;
			var competitorGrid	=	{
				xtype		: 'customgrid'
				,title		: getLabel('COMPETITOR.FARMER.GRID.TITLE')
				,itemId		: 'competitorGrid'
				,store		: me.getCompetitorStore()
				,tbar		: 
				[
				 	{xtype	: 'customtbarbutton'		,text : 'Add Competitor'		,iconCls : 'x-atp-add'							,handler : function(btn) { me.createCompetitor(btn)}	}
				 	,{xtype	: 'customtbarbutton'		,text : 'Edit Competitor'		,iconCls : 'x-atp-edit'		,itemId : 'editCmpBtn'	,handler : function(btn) { me.editCompetitor(btn.up('grid#competitorGrid'))}	,disabled : true}
				 ]
				,columns		: 
				[
					 {	text : 'Competitor'					,dataIndex : 'name'					}
				]
				,listeners :
				{
					itemdblclick : function(view)
					{
						me.editCompetitor(view.grid)
					}
					,selectionchange : function(selModel, records)
					{
						if(records.length > 0)
						{
							selModel.view.grid.down('button#editCmpBtn').setDisabled(false);
						}
						else
						{
							selModel.view.grid.down('button#editCmpBtn').setDisabled(true);	
						}
					}
					
				}
			};
			return competitorGrid;
		}
		,createCompetitor : function(btn)
		{
			var me = this;
			var mdrGrid = btn.up('grid#competitorGrid')
			var form = me.getCompetitorForm(mdrGrid,0);
		}
		,editCompetitor : function(mdrGrid)
		{
			var me = this;
			var record = mdrGrid.getSelectionModel().getSelection()[0];
			var form = me.getCompetitorForm(mdrGrid,record.get('id')).down('form#competitorForm');
			form.loadRecord(record);
		}
		,getCompetitorForm : function(mdrGrid,competitorId)
		{
			var me = this;
			var cropStore = me.getCropStore(competitorId);
			var cropGrid = {
								xtype			: 'customgrid'
								,title			: 'Crop Details'
								,itemId			: 'competitorCropMapGrid'
								,style			: 'border : 1px solid #D9D9D9;'
								,margin			: '10 10 10 10'
								,width			: 350
								,pagination		: false
								,allowDeselect	: true
								,autoScroll		: true
								,store 			: cropStore
								,columns		:
								[
									{
										xtype			: 'checkcolumn'
										,dataIndex		: 'checked'
										,stopSelection	: false
										,sortable		: false
										,width			: 30
										,menuDisabled	: true
									}
								 	,{
								 		text			: 'Crop'
								 		,dataIndex		: 'name'
								 		,filter			: false
								 		,sortable		: false
								 	}
									
								]
							}
			
			var competitorForm = Ext.create('Ext.custom.form.Panel',
			{
				itemId			: 'competitorForm'
				,layout			: {	type : 'hbox'}
				,defaults		:
				{
					margin	: '10 10 10 10'
				}
				,items			: 
				[
				 	{
				 		xtype	: 'container'
				 		,width	: 300
				 		,items	: 
				 		[
							{
								xtype 			: 'textfield'
								,fieldLabel		: 'Competitor'
								,name			: 'name'
								,allowBlank		: false
								,listeners		: 
								{
									change: function(field, value)
									{
										U.validateUniqueness(field, value, competitorId, ATP.Urls.validateCompetitor);
									}
								}
							}
							,{
								xtype	: 'hidden'
								,name	: 'id'
							}
				 		 ]
				 	}
				 	,cropGrid
				 ]
				,buttons	: 
				 [
				  	'->' ,
				  	{
						xtype	: 'customformcancelbutton'
					}
					,{
						xtype		: 'customformsubmitbutton' 
						,text		: 'Save'
						, handler 	: function(btn) 
						{
							this.up('form').saveCompetitorCropMap(btn,mdrGrid);
						}
					}
				]
				,saveCompetitorCropMap : function(btn,mdrGrid)
				{
					var competitorForm 	= btn.up('form');
					var competitorCropMapGrid =	competitorForm.up('window').down('#competitorCropMapGrid');
					var selectedRecords = competitorCropMapGrid.getStore().query("checked", true, false, true, true ).items;
					
					if(selectedRecords.length == 0)
					{
						U.showAlert(getLabel('ATP.GLOBAL.WARNING') , getLabel('ATP.UI.CROP.SELECT'));
						return false;
					}
					var crops = [];
					for ( var index = 0; index < selectedRecords.length; index++) 
					{
						crops [index]= selectedRecords[index].get('id');
						
					}
					var formValues = competitorForm.getValues();
					formValues.crops = crops;
					var loadMask = U.showLoadMask(competitorForm.up('window')).show();
					Ext.Ajax.request(
				    {
				    	url 		: ATP.Urls.command
				    	,method		: 'POST'
			    		,headers	: { 'Content-Type': 'application/json' }  
				      	,params   	: {"actionType":'competitorService'}
				      	,jsonData	: Ext.encode(formValues)
				      	,success	: function (response) 
				      	{
				      		loadMask.destroy();
				      		var res = Ext.decode(response.responseText);
				      		if(res.success)
				      		{
				      			btn.up('window').close();
				      			U.showAlert(getLabel('ATP.GLOBAL.SUCCESS'), res.message, false, false, function()
		        				{
				        			mdrGrid.getStore().load();
	        					});
				      		}
				      		else
				      		{
					      		U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), res.message, Ext.Msg.ERROR);
				      		}
				      	}
				      	,failure: function (response) 
				      	{
				      		loadMask.destroy();
				      		U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), "Unable to Create/Update Competitor", Ext.Msg.ERROR);
				      	}
				 	});
				}
			});
			
			return	Utilities.showWindow({
				title	: getLabel('ATP.COMMPETITOR.FORM.TITLE')
				,items	: competitorForm
				,width : 720
			});
			
		},
		getCropStore : function(competitorId)
		{
			return Ext.create('Ext.data.Store',
					{
								 model		: 'CompetitorCropMapModel'
								,autoLoad 	: true
								,remoteSort	: true
								,proxy 	: 
								{
									type 		: 'ajax'
									,url 		:  "./admin/crops/" + competitorId
									,reader 	: 
									{
										type 	: 'json'
									}
								}
					});
		}
};

COMPETITOR.init();