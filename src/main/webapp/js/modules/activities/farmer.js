var DEMAND_FARMER = {
	init	: function()
	{
		this.defineFarmer();
	},
	defineFarmer	: function()
	{
		Ext.define('Farmer', 
			{
				extend	: 'Ext.data.Model',
				fields	:
				[
					 {	name: 'id'														}
					,{	name: 'mdrName'					,mapping: 'mdrInfo.name'		}
					,{	name: 'name'													}
					,{	name: 'mobileNo'												}
					,{	name: 'area'													}
					,{	name: 'transactedOn'											}
					,{	name: 'majorCrop1'												}
					,{	name: 'majorCrop1Area'											}
					,{	name: 'majorCrop2'												}
					,{	name: 'majorCrop2Area'											}
				 ]
			});
	},
	getFarmerStore	: function(extraParams,action)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : (action ? action : 'farmerService')}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'Farmer'
					,proxy	: proxy
					,remoteSort : false
				});
	},
	getFarmerGrid	: function(psaId,title,actionType,specificColumns)
	{
		var me			=	this;
		var store = me.getFarmerStore(psaId,actionType);
		store.load();
		var columns = [
			{	text : 'MDR'					,dataIndex : 'mdrName'					}
			,{	text : 'Farmer'					,dataIndex : 'name'						}
			,{	text : 'Mobile No'				,dataIndex : 'mobileNo'					}
			,{	text : 'Area'					,dataIndex : 'area'						}
			//,{	text : 'Transacted On'		,dataIndex : 'transactedOn'			,filter : 'date'	,renderer : U.renderFormattedDate	}
		];

		if(specificColumns)
		{
			columns.push(
					{	text : 'Major Crop 1'						,dataIndex : 'majorCrop1'					}
					,{	text : 'Major Crop 1 Area'					,dataIndex : 'majorCrop1Area'				}
					,{	text : 'Major Crop 2'						,dataIndex : 'majorCrop2'					}
					,{	text : 'Major Crop 2 Area'					,dataIndex : 'majorCrop2Area'				}
			)
		}
		
		var farmerGrid	=	{
			xtype		: 'customgrid'
			,itemId		: 'farmerGrid'
			,pagination : false
			,applyFilter : false
			,store		: store
			,columns		: columns
		};
		
		return	Utilities.showWindow({
			title		: title
			,items	: farmerGrid
			,width	: 840
			,minHeight : 300
		});
		
	}
};

DEMAND_FARMER.init();