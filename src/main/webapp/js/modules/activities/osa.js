var DEMAND_OSA = {
	init: function()
	{
		this.defineOSA();
	}
	,defineOSA : function()
	{
		Ext.define('OSA', 
		{
			extend	: 'Ext.data.Model',
			fields	:
			[
				 {	name: 'id'														}
				,{	name: 'name'					,mapping: 'mdrInfo.name'		}
				,{	name: 'empId'					,mapping: 'mdrInfo.loginId'		}
				,{	name: 'tblName'					,mapping: 'tbl.name'			}
				,{	name: 'season'					,mapping: 'season.name'			}
				,{	name: 'crop'					,mapping: 'crop.name'			}
				,{	name: 'category'												}
				,{	name: 'hybrid'					,mapping: 'hybridInfo.name'		}
				,{	name: 'farmerCount'												}
				,{	name: 'retailerCount'											}
				,{	name: 'competitorHybrid'										}
				,{	name: 'villages'												}
				,{	name: 'geoLocation'												}
				,{	name: 'date'													}
				,{	name: 'transactedOn'											}
				
			 ]
		});
	}
	,getOSAs: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'demandOSAService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'OSA'
					,proxy	: proxy
				});
	}
	,getOSAGrid : function()
	{
		var me			=	this;
		var osaGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.OSA.GRID.TITLE')
			,itemId		: 'osaGrid'
			,store		: me.getOSAs()
			,columns		: 
			[
				 {	text : 'MDR Name'				,dataIndex : 'name'							}
				,{	text : 'Emp Id'					,dataIndex : 'empId'						}
				,{	text : 'TBL Name'				,dataIndex : 'tblName'						}
				,{	text : 'Season'					,dataIndex : 'season'						}
				,{	text : 'Crop'					,dataIndex : 'crop'							}
				,{	text : 'Hybrid'					,dataIndex : 'hybrid'						}
				,{	text : 'Category'				,dataIndex : 'category'						}
				,{	text : 'Competitor Hybrid'		,dataIndex : 'competitorHybrid'				}
				,{	text : 'Farmers Count'			,dataIndex : 'farmerCount'					}
				,{	text : 'Retailers Count'		,dataIndex : 'retailerCount'				}
				,{	text : 'Villages'				,dataIndex : 'villages'						}
				,{	text : 'Date'					,dataIndex : 'date'						,filter : 'date'	,renderer : U.renderFormattedDate	}
				,{	text : 'Action 1'		,width : 125			,sortable : false		,filter : false		,dataIndex : 'id'	,renderer :  function(v) {return "<button type='button' onclick=DEMAND_OSA.getFarmers(\'"+v+"\',\'OSA-Farmers\') >Show Farmers</button>"; }}
				,{	text : 'Action 2'		,width : 125			,sortable : false		,filter : false		,dataIndex : 'id'	,renderer :  function(v) {return "<button type='button' onclick=DEMAND_OSA.getRetailers(\'"+v+"\',\'OSA-Retailers\') >Show Retailers</button>"; }}
			]
		};
		return osaGrid;
	}
	,getFarmers : function(osaId,title)
	{
		DEMAND_FARMER.getFarmerGrid(osaId,title,"demandOSAFarmerMappingService")
	}
	,getRetailers : function(osaId,title)
	{
		DEMAND_RETAILERS.getRetailersGrid(osaId,title,"demandOSARetailerMappingService")
	}
};

DEMAND_OSA.init();