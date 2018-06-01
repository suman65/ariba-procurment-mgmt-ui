/**
 * @author rabindranath.s
 */

var DATE_WISE_LIQUIDATION =	
{
	init: function()
	{
		this.defineTopTenRetailerSale();
	}
	,seasons: null
	,crops	: null
	,retailers: null
	,defineDateWiseLiquidation: function()
	{
		Ext.define('ATP.model.DateWiseLiquidation',
		{
			extend	: 'Ext.data.Model'
			,fields	:
			[
				 {	name: 'id'														}
				,{	name: 'retailerName'			,mapping: 'retailerInfo.name'	}
				,{	name: 'retailerInfo'			,mapping: 'retailerInfo.id'		}
				,{	name: 'competitor1'				,mapping: 'competitor1.name'	}
				,{	name: 'competitor2'				,mapping: 'competitor2.name'	}
				,{	name: 'retailerMobileNo'		,mapping: 'retailerMobileNo'	}
				,{	name: 'pioneerSales'			,mapping: 'pioneerSales'		}
				,{	name: 'competitor1Sales'		,mapping: 'competitor1Sales'	}
				,{	name: 'competitor2Sales'		,mapping: 'competitor2Sales'	}
				,{	name: 'otherSales'				,mapping: 'otherSales'			}
				,{	name: 'totalCounterPotential'	,mapping: 'totalCounterPotential'}
			]
		});
	}
	,getSeasons: function()
	{
		if(!this.seasons)
		{
			this.seasons = Ext.create('Ext.data.ComboStore',
			{
				autoLoad	: true
				,autoDestroy: false
				,proxy		: 
				{
					type	: 'ajax'
					,url	: './comboData?actionType=seasonService'
					,reader	: 'combojsonreader'
				}
			});
		}

		return this.seasons;
	}
	,getCrops: function()
	{
		if(!this.crops)
		{
			this.crops = Ext.create('Ext.data.ComboStore',
			{
				autoLoad	: true
				,autoDestroy: false
				,proxy		: 
				{
					type	: 'ajax'
					,url	: './comboData?actionType=cropService'
					,reader	: 'combojsonreader'
				}
			});
		}

		return this.crops;
	}
	,getYears: function()
	{
		var years = [], startYear = 2012, endYear = Ext.Date.format(new Date(), 'Y');

		for (var i = startYear; i <= endYear; i++)
		{
			years.push(i);
		}

		return years;
	}
	,getRetailers: function()
	{
		if(!this.retailers)
		{
			this.retailers = Ext.create('Ext.data.ComboStore',
			{
				autoLoad	: true
				,autoDestroy: false
				,proxy		: 
				{
					type	: 'ajax'
					,url	: './comboData?actionType=retailerInfoService'
					,reader	: 'combojsonreader'
				}
			});
		}

		return this.retailers;
	}
	,getDateWiseLiquidations: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.getTopTenRetailers
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
		{
			 model		: 'ATP.model.TOP_TEN_RETAILER_SALE'
			,proxy		: proxy
			,remoteSort	: false
			,remoteFilter: false
			,autoLoad	: false
			,pageSize	: 0
		});
	}
	,getTopTenRetailerSalesGrid: function()
	{
		var me			=	this;
		var topTenRetailerSalesGrid	=	{
			xtype		: 'customgrid'
			,itemId		: 'dateWiseLiquidationGrid'
			,title		: 'Date Wise Liquidation'
			,store		: me.getDateWiseLiquidations()
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
	,save: function(mainPanel, teritoryMasterForm, grid, seasonId, cropId, conductedYear, liquidationTracking)
	{
		var loadMask = U.showLoadMask(mainPanel).show();
		Ext.Ajax.request(
		{
			url 		: ATP.Urls.saveLiquidtionTracking
			,method		: 'POST'
			,params   	: {seasonId: seasonId, cropId: cropId, conductedYear: conductedYear}
			,jsonData	: Ext.encode(liquidationTracking)
			,success	: function (response) 
			{
				loadMask.destroy();
				var responseData = Ext.decode(response.responseText);
				if(responseData.success)
				{
					teritoryMasterForm.down('hidden[name=id]').setValue(responseData.teritoryMasterId);
					U.showAlert(getLabel('ATP.GLOBAL.SUCCESS'), responseData.message, false, false, function()
					{
						grid.getStore().load();
					});
				}
				else
				{
					U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), responseData.message, Ext.Msg.ERROR);
				}
			}
			,failure: function (response) 
			{
				loadMask.destroy();
				U.showAlert(getLabel('ATP.GLOBAL.FAILURE'), "Unable To Save.", Ext.Msg.ERROR);
			}
		});
	}
}

DATE_WISE_LIQUIDATION.init();
