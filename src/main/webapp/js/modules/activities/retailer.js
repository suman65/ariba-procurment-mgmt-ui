var DEMAND_RETAILERS = {
	init	: function()
	{
		this.defineRetailer();
	},
	defineRetailer	: function()
	{
		Ext.define('Retailer', 
			{
				extend	: 'Ext.data.Model',
				fields	:
				[
					 {	name: 'id'														}
					,{	name: 'mdrName'					,mapping: 'mdrInfo.name'		}
					,{	name: 'name'													}
					,{	name: 'mobileNo'												}
					,{	name: 'altMobileNo'												}
					,{	name: 'transactedOn'											}
				 ]
			});
	},
	getRetailerStore	: function(extraParams,action)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType :(action? action :  'demandRetailerService')}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'Retailer'
					,proxy	: proxy
					,remoteSort : false
				});
	},
	getRetailersGrid	: function(psaId,title,actionType)
	{
		var me			=	this;
		var store = me.getRetailerStore(psaId,actionType);
		store.load();
		var retailerGrid	=	{
			xtype		: 'customgrid'
			,itemId		: 'retailerGrid'
			,pagination : false
			,applyFilter : false
			,store		: store
			,columns		: 
			[
				 {	text : 'MDR'					,dataIndex : 'mdrName'				}
				,{	text : 'Farmer'					,dataIndex : 'name'					}
				,{	text : 'Mobile No'				,dataIndex : 'mobileNo'				}
				,{	text : 'Transacted On'			,dataIndex : 'transactedOn'		,filter : 'date'	,renderer : U.renderFormattedDate}
			
			]
		};
		
		return	Utilities.showWindow({
			title		: title
			,items	: retailerGrid
			,width	: 840
			,minHeight : 300
		});
	}
};

DEMAND_RETAILERS.init();
