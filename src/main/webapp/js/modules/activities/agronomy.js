var AGRONOMY = {
	init: function()
	{
		this.defineAgronomy();
	}
	,defineAgronomy : function()
	{
		Ext.define('Agronomy', 
		{
			extend	: 'Ext.data.Model',
			fields	:
			[
				 {	name: 'id'														}
				,{	name: 'MDR'						,mapping: 'mdrInfo.name'		}
				,{	name: 'tblName'					,mapping: 'tbl.name'			}
				,{	name: 'season'					,mapping: 'season.name'			}
				,{	name: 'crop'					,mapping: 'crop.name'			}
				,{	name: 'category'												}
				,{	name: 'hybrid'					,mapping: 'hybridInfo.name'		}
				,{	name: 'objective'				,mapping: 'samplingObjective'	}
				,{	name: 'farmerName'												}
				,{	name: 'competitorHybrid'										}
				,{	name: 'farmerMobileNo'											}
				,{	name: 'plotType'												}
				,{	name: 'copmetitorHybrid1'										}
				,{	name: 'copmetitorHybrid2'										}
				,{	name: 'geolocation'												}
				,{	name: 'date'													}
				,{	name: 'transactedOn'											}
				
			 ]
		});
	}
	,getAgronomys: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'agronomyService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'Agronomy'
					,proxy	: proxy
				});
	}
	,getAgronomyGrid : function()
	{
		var me			=	this;
		var agronomyGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.Agronomy.GRID.TITLE')
			,itemId		: 'agronomyGrid'
			,store		: me.getAgronomys()
			,columns	: 
			[
				 {	text : 'MDR Name'				,dataIndex : 'MDR'							}
				,{	text : 'TBL Name'				,dataIndex : 'tblName'						}
				,{	text : 'Season'					,dataIndex : 'season'						}
				,{	text : 'Crop'					,dataIndex : 'crop'							}
				,{	text : 'Hybrid'					,dataIndex : 'hybrid'						}
				,{	text : 'Category'				,dataIndex : 'category'						}
				,{	text : 'Objective'				,dataIndex : 'objective'					}
				,{	text : 'Farmer'					,dataIndex : 'farmerName'					}
				,{	text : 'Farmer Mobile No'		,dataIndex : 'farmerMobileNo'				}
				,{	text : 'Plot Type'				,dataIndex : 'plotType'						}
				,{	text : 'Competitor Hybrid 1'	,dataIndex : 'copmetitorHybrid1'			}
				,{	text : 'Competitor Hybrid 2'	,dataIndex : 'copmetitorHybrid2'			}
				,{	text : 'Date'					,dataIndex : 'date'					,filter : 'date'	,renderer : U.renderFormattedDate	}
				//,{	text : 'Transacted On'		,dataIndex : 'transactedOn'			,filter : 'date'	,renderer : U.renderFormattedDate	}
			]
		};
		return agronomyGrid;
	}
};

AGRONOMY.init();
