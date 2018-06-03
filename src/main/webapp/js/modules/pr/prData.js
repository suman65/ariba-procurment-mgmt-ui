var totalCount=0;
var PR = 
	{
		init: function()
		{
			this.defineLog();
		}
		,defineLog : function()
		{
			Ext.define('PRMODEL', 
					{
						extend	: 'Ext.data.Model',
						fields	:
						[
							 {	name: 'id'								,mapping :'prId'	   	}
							,{	name: 'purchaseRequisitionNumber'								}
							,{	name: 'vendor'													}
							,{	name: 'accountType'												}
							,{	name: 'commodity'												}
							,{	name: 'title'													}
							,{	name: 'onBehalfOf'												}
							,{	name: 'companyCode'												}
							,{	name: 'reason'													}
							,{	name: 'status'													}
						 ]
					});
		},
		getStore : function()
		{
			return	 Ext.create('Ext.data.GridStore',
						{
							 model 		: 'PRMODEL'
							,autoLoad 	: false
							,autoDestroy: false
							,proxy 		: {
									type 	: 'ajax'
									,url 	: ATP.Urls.main + 'prData'
									,method : 'GET'
									,reader	: 'jsonreader'
									,startParam:'page'
								    ,limitParam:'size'
							}
						});
		}
		,getPRData : function()
		{
			var me = this;
			var prDataGrid	=	Ext.create('Ext.custom.grid.Panel', 
					{
						 title			: 'Purchase Requisition Data'
						,itemId			: 'transactionGrid'
						,store			: this.getStore()
						,header			: {xtype :'header'	,titleAlign : 'center'	,cls:'x-atp-grid-title' }
						,forceFit 		: true
						,cls			: 'pr-data-grid'
						,columns		: 
						[
							 {	text : 'PR Number'				,dataIndex : 'purchaseRequisitionNumber'	}
							,{	text : 'Vendor'					,dataIndex : 'vendor'						}
							,{	text : 'Account Type'			,dataIndex : 'accountType'					}
							,{	text : 'Commodity'				,dataIndex : 'commodity'					}
							,{	text : 'Title'					,dataIndex : 'title'						}
							,{	text : 'On Behalf Of'			,dataIndex : 'onBehalfOf'					}
							,{	text : 'Company Code'			,dataIndex : 'companyCode'					}
							,{	text : 'Status'					,dataIndex : 'status'						}
							,{	text : 'Ariba Response'			,dataIndex : 'reason'						}
							,{
					            xtype:'actioncolumn',
					            text : 'Action',
					            align : 'center',
					            width :100,
					            items: [
					            	{
					            		iconCls: 'x-tab-upload',
					            		tooltip: 'Upload',
					            		handler: function(grid, rowIndex, colIndex) 
					            		{
					            			var rec = grid.getStore().getAt(rowIndex);
					            			U.showAlert('Upload Confirmation','Do you want to upload to Ariba?');
					                    
					            		}
					                },{xtype : 'tbspacer' , width :30},
					            	{
					            		iconCls: 'x-tab-activate',
					            		tooltip: 'Confirm',
					            		handler: function(grid, rowIndex, colIndex) 
					            		{
					            			var rec = grid.getStore().getAt(rowIndex);
					            			U.showAlert('Upload Confirmation','Do you want to Confirm?');
					            		}
					            }]
					        }
						]
						,listeners :
						{
							itemdblclick : function(view)
							{
								 me.getItemsWindow(view.grid);
							}
						}
					});
			
			return prDataGrid;
		}
		,getItemsWindow  : function (grid)
		{
			var me = this;
			var record = grid.getSelectionModel().getSelection()[0];
			
			var win = Utilities.showWindow(
			{
			     layout: 'fit'
			    ,items	: me.getItemsGrid(record.data.id)
			    ,header : {xtype :'header'	,titleAlign : 'center'	,cls:'x-atp-grid-title' }
				,width  : '90%'
				,listeners :
				{
					afterrender : function(this_)
					{
						var grid = this.down('grid');
						grid.store.on('load',function(store)
						{
							this_.setTitle('Total No of Line Items are  : ' + store.totalCount)
						})
					}
				}
			})
			win.center()
			win.show();
		}
		,getItemStore : function(prId)
		{
			Ext.define('ITEMMODEL', 
					{
						extend	: 'Ext.data.Model',
						fields	:
						[
							 {	name: 'id'						,mapping :'itemId'	    }
							,{	name: 'prNumber'										}
							,{	name: 'itemDescription'									}
							,{	name: 'quantity'										}
							,{	name: 'price'											}
							,{	name: 'uom'												}
							,{	name: 'needByDate'										}
							,{	name: 'shippingAddress'									}
							,{	name: 'comments'										}
							,{	name: 'supplierPartNumber'								}
							,{	name: 'eccPlant'										}
							,{	name: 'glAccount'										}
							,{	name: 'costCenter'										}
						 ]
					});
			return	 Ext.create('Ext.data.GridStore',
					{
						 model 		: 'ITEMMODEL'
						,autoLoad 	: false
						,autoDestroy: false
						,pageSize   : 10
						,proxy 		: {
								type 	: 'ajax'
								,url 	: ATP.Urls.main + 'prLineItems?prId=' + prId
								,method : 'GET'
								,reader	: 'jsonreader'
								,startParam:'page'
							    ,limitParam:'size'
						}
					});
		}
		,getItemsGrid : function(prNumber)
		{
			var me = this;
			var prLineItemsGrid	=	Ext.create('Ext.custom.grid.Panel', 
					{
						
						 itemId			: 'prLineGrid'
						,store			: me.getItemStore(prNumber)
						,header			: false
						,forceFit 		: true
						,height : 500
						,columns		: 
						[
							 {	text : 'PR Number'				,dataIndex : 'prNumber'						}
							,{	text : 'Item Description'		,dataIndex : 'itemDescription'				}
							,{	text : 'Quantity'				,dataIndex : 'quantity'						}
							,{	text : 'Price'					,dataIndex : 'price'						}
							,{	text : 'Unit of Measurement'	,dataIndex : 'uom'							}
							,{	text : 'Need By Date'			,dataIndex : 'needByDate'					}
							,{	text : 'Shipping Address'		,dataIndex : 'shippingAddress'				}
							,{	text : 'Comments'				,dataIndex : 'comments'						}
							,{	text : 'ECC Plant'				,dataIndex : 'eccPlant'						}
							,{	text : 'Cost Center'			,dataIndex : 'costCenter'					}
							,{	text : 'GL Account'				,dataIndex : 'glAccount'					}
							,{	text : 'Supplier Part Number'   ,dataIndex : 'supplierPartNumber'			}
						]
					});
			return prLineItemsGrid;
		}
}
PR.init();
