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
							,{	name: 'glAccount'												}
							,{	name: 'commodity'												}
							,{	name: 'title'													}
							,{	name: 'onBehalfOf'												}
							,{	name: 'companyCode'												}
							,{	name: 'costCenter'												}
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
							,{	text : 'Cost Center'			,dataIndex : 'costCenter'					}
							,{
					            xtype:'actioncolumn',
					            text : 'Action',
					            align : 'center',
					            width:100,
					            items: [
					            	{
					            		iconCls: 'x-atp-add',
					            		tooltip: 'Upload',
					            		handler: function(grid, rowIndex, colIndex) {
					                    var rec = grid.getStore().getAt(rowIndex);
					            		}
					                },{xtype : 'tbspacer' , width :20},
					            	{
					            		iconCls: 'x-atp-edit',
					            		tooltip: 'Confirm',
					            		handler: function(grid, rowIndex, colIndex) {
					                    var rec = grid.getStore().getAt(rowIndex);
					                }
					            }]
					        }
							/*,{
						        xtype: 'actioncolumn',
						        text : 'Action',
						        width: 100,
						        items: [{
						            xtype: 'button',
						            iconCls : 'x-atp-add',
						            tooltip : 'Upload',
						            text    : 'Upload',
						            width   : 50
						        }]
							}*/
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
				 //title	: 'Total No of Line Items for  PR # : ' + record.data.purchaseRequisitionNumber + " is  : "
			     layout: 'fit'
			    ,items	: me.getItemsGrid(record.data.id)
			    ,header : {xtype :'header'	,titleAlign : 'center'	,cls:'x-atp-grid-title' }
				,width  : '90%'
				,id : 'lineWindow'
				,listeners :
				{
					afterrender : function(this_)
					{
						var grid = this.down('grid');
						grid.store.on('load',function(store)
						{
							this_.setTitle('Total No of Line Items for  PR # : ' + record.data.purchaseRequisitionNumber + " is  : " + store.totalCount)
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
							,{	text : 'Supplier Part Number'   ,dataIndex : 'supplierPartNumber'			}
							,{	text : 'ECC Plant'				,dataIndex : 'eccPlant'						}
						]
					});
			/*prLineItemsGrid.store.on('load',function(store,records)
			{
				totalCount = store.getTotalCount();
				console.log(totalCount);
			})*/
			return prLineItemsGrid;
		}
}
PR.init();
