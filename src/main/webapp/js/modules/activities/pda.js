var DEMAND_PDA = {
	init: function()
	{
		this.definePDA();
	}
	,definePDA : function()
	{
		Ext.define('PDA', 
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
				,{	name: 'hybridYield'												}
				,{	name: 'competitorYield'											}
				,{	name: 'villages'												}
				,{	name: 'geoLocation'												}
				,{	name: 'date'													}
				,{	name: 'transactedOn'											}
			]
		});
	}
	,getPDAs: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'demandPDAService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'PDA'
					,proxy	: proxy
				});
	}
	,getPDAGrid : function()
	{
		var me			=	this;
		var pdaGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.PDA.GRID.TITLE')
			,itemId		: 'pdaGrid'
			,store		: me.getPDAs()
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
				,{	text : 'Hybrid Yield'			,dataIndex : 'hybridYield'				}
				,{	text : 'Competitor Yield'		,dataIndex : 'competitorYield'			}
				,{	text : 'Farmers Count'			,dataIndex : 'farmerCount'				}
				,{	text : 'Retailers Count'		,dataIndex : 'retailerCount'			}
				,{	text : 'Villages'				,dataIndex : 'villages'					}
				,{	text : 'Date'					,dataIndex : 'date'				,filter : 'date'	,renderer : U.renderFormattedDate	}
				,{	text : 'Action 1'		,width : 125	,sortable : false		,filter : false		,dataIndex : 'id'	,renderer : function(v) {return "<button type='button' onclick=DEMAND_PDA.getFarmers(\'"+v+"\',\'PDA-Farmers\') >Show Farmers</button>"; }}
				,{	text : 'Action 2'		,width : 125	,sortable : false		,filter : false		,dataIndex : 'id'	,renderer : function(v) {return "<button type='button'  onclick=DEMAND_PDA.getRetailers(\'"+v+"\',\'PDA-Retailers\') >Show Retailers</button>"; }}
			]
		};
		return pdaGrid;
	}
	,getFarmers : function(pdaId,title)
	{
		DEMAND_FARMER.getFarmerGrid(pdaId, title, "demandPDAFarmerMappingService")
	}
	,getRetailers : function(pdaId,title)
	{
		DEMAND_RETAILERS.getRetailersGrid(pdaId, title, "demandPDARetailerMappingService")
	}
};

DEMAND_PDA.init();
