var ATP_3I = {
	init	: function()
	{
		this.define3I();
	},
	define3I	: function()
	{
		Ext.define('_3I', 
			{
				extend	: 'Ext.data.Model',
				fields	:
				[
					 {	name: 'id'														}
					,{	name: 'mdrName'					,mapping: 'mdrInfo.name'		}
					,{	name: 'tblName'					,mapping: 'tbl.name'			}
					,{	name: 'retailerMobileNo'										}
					,{	name: 'retailerFirmName'										}
					,{	name: 'phaseNo'													}
					,{	name: 'geolocation'												}
					,{	name: 'date'													}
					,{	name: 'transactedOn'											}
				 ]
			});
	},
	get_3iStore	: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : '_3IService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: '_3I'
					,proxy	: proxy
				});
	},
	get_3iGrid	: function()
	{
		var me			=	this;
		var _3iGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.FARMER.GRID.TITLE')
			,itemId		: '_3iGrid'
			,store		: me.get_3iStore()
			,columns		: 
			[
				 {	text : 'MDR'					,dataIndex : 'mdrName'					}
				,{	text : 'TBL Name'				,dataIndex : 'tblName'					}
				,{	text : 'Retailer Name'			,dataIndex : 'retailerFirmName'			}
				,{	text : 'Retailser Mobile No'	,dataIndex : 'retailerMobileNo'			}
				,{	text : 'Phase No'				,dataIndex : 'phaseNo'					}
				,{	text : 'Geo Location'			,dataIndex : 'geolocation'				}
				,{	text : 'Date'					,dataIndex : 'date'						,filter : 'date'	,renderer : U.renderFormattedDate}
				,{	text : 'Transacted On'			,dataIndex : 'transactedOn'				,filter : 'date'	,renderer : U.renderFormattedDate}
			
			]
		};
		return _3iGrid;
	}
};

ATP_3I.init();
