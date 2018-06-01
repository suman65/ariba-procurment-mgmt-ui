/**
 * @author rabindranath.s
 */

var TOP_TEN_RETAILER_SALES =	
{
	init: function()
	{
		this.defineTopTenRetailerSale();
	}
	,defineTopTenRetailerSale : function()
	{
		Ext.define('ATP.data.TOP_TEN_RETAILER_SALE',
		{
			extend	: 'Ext.data.Model'
			,fields	:
			[
				 {	name: 'id'														}
				 ,{	name: 'tblName'					,mapping: 'tbl.name'			}
				,{	name: 'tbl'						,mapping: 'tbl.id'				}
				,{	name: 'retailerName'			,mapping: 'retailerInfo.name'	}
				,{	name: 'retailerInfo'			,mapping: 'retailerInfo.id'		}
				,{	name: 'competitor1Name'			,mapping: 'competitor1.name'	}
				,{	name: 'competitor1'				,mapping: 'competitor1.id'		}
				,{	name: 'competitor2Name'			,mapping: 'competitor2.name'	}
				,{	name: 'competitor2'				,mapping: 'competitor2.id'		}
				,{	name: 'retailerMobileNo'		,mapping: 'retailerMobileNo'	}
				,{	name: 'pioneerSales'			,mapping: 'pioneerSales'		}
				,{	name: 'competitor1Sales'		,mapping: 'competitor1Sales'	}
				,{	name: 'competitor2Sales'		,mapping: 'competitor2Sales'	}
				,{	name: 'otherSales'				,mapping: 'otherSales'			}
				,{	name: 'totalCounterPotential'	,mapping: 'totalCounterPotential'	}
			 ]
		});
	}
	,getTopTenRetailerSales: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'liquidationTopTenRetailerSalesDataService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
		{
			 model	: 'ATP.data.TOP_TEN_RETAILER_SALE'
			,proxy	: proxy
		});
	}
	,getTopTenRetailerSalesGrid: function()
	{
		var me			=	this;
		var topTenRetailerSalesGrid	=	{
			xtype		: 'customgrid'
			,itemId		: 'topTenRetailerSalesGrid'
			,store		: me.getTopTenRetailerSales()
			,columns		: 
			[
				 {	text : 'TBL Name'					,dataIndex : 'tblName'			}
				,{	text : 'Retailer'					,dataIndex : 'retailerName'		}
				,{	text : 'Competitor1'				,dataIndex : 'competitor1Name'	}
				,{	text : 'Competitor2'				,dataIndex : 'competitor2Name'	}
				,{	text : 'Pioneer Sales'				,dataIndex : 'pioneerSales'		}
				,{	text : 'Competitor1 Sales'			,dataIndex : 'competitor1Sales'	}
				,{	text : 'Competitor2 Sales'			,dataIndex : 'competitor2Sales'	}
				,{	text : 'Other Sales'				,dataIndex : 'otherSales'		}
				,{	text : 'Total Counter Potential'	,dataIndex : 'totalCounterPotential'}
			]
		};

		return topTenRetailerSalesGrid;
	}
}

TOP_TEN_RETAILER_SALES.init();
