var DEMAND_PSA = {
	init: function()
	{
		this.definePSA();
	}
	,definePSA : function()
	{
		Ext.define('PSA', 
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
	,getPSAs: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'demandPSAService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'PSA'
					,proxy	: proxy
				});
	}
	,getPSAGrid : function()
	{
		var me			=	this;
		var psaGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.PSA.GRID.TITLE')
			,itemId		: 'psaGrid'
			,store		: me.getPSAs()
			,columns		: 
			[
				 {	text : 'MDR Name'				,dataIndex : 'name'						}
				,{	text : 'Emp Id'					,dataIndex : 'empId'					}
				,{	text : 'TBL Name'				,dataIndex : 'tblName'					}
				,{	text : 'Season'					,dataIndex : 'season'					}
				,{	text : 'Crop'					,dataIndex : 'crop'						}
				,{	text : 'Hybrid'					,dataIndex : 'hybrid'					}
				,{	text : 'Category'				,dataIndex : 'category'					}
				,{	text : 'Competitor Hybrid'		,dataIndex : 'competitorHybrid'			}
				,{	text : 'Farmers Count'			,dataIndex : 'farmerCount'				}
				,{	text : 'Retailers Count'		,dataIndex : 'retailerCount'			}
				,{	text : 'Villages'				,dataIndex : 'villages'					}
				,{	text : 'Date'					,dataIndex : 'date'					,filter : 'date'	,renderer : U.renderFormattedDate	}
				,{	text : 'Action 1'			,width : 125	,sortable : false		,filter : false		,dataIndex : 'id'	,renderer :  function(v) {return "<button type='button' onclick=DEMAND_PSA.getFarmers(\'"+v+"\',\'PSA-Farmers\') >Show Farmers</button>"; }}
				,{	text : 'Action 2'			,width : 125	,sortable : false		,filter : false		,dataIndex : 'id'	,renderer :  function(v) {return "<button type='button' onclick=DEMAND_PSA.getRetailers(\'"+v+"\',\'PSA-Retailers\') >Show Retailers</button>"; }}
			]
		};
		return psaGrid;
	},
	getFarmers : function(PsAId,title)
	{
		DEMAND_FARMER.getFarmerGrid(PsAId,title,"demandPSAFarmerMappingService");
	}
	,getRetailers : function(PsAId,title)
	{
		DEMAND_RETAILERS.getRetailersGrid(PsAId,title,"demandPSARetailerMappingService")
	}
};

DEMAND_PSA.init();
