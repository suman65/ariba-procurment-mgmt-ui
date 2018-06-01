var MDR_PROFILE = {
	init	: function()
	{
		this.defineMDRProfile();
	}
	,defineMDRProfile : function()
	{
		Ext.define('MDRProfile', 
			{
				extend	: 'Ext.data.Model',
				fields	:
				[
					 {	name: 'id'														}
					,{	name: 'mdrName'					,mapping: 'mdrInfo.name'		}
					,{	name: 'tblName'					,mapping: 'tbl.name'			}
					,{	name: 'crop'					,mapping: 'crop.name'			}
					,{	name: 'village'					,mapping: 'villageName'			}
					,{	name: 'totalCropArea'											}
					,{	name: 'pioneerShare'											}
					,{	name: 'majorCompetitor1'										}
					,{	name: 'majorCompetitor2'										}
					,{	name: 'competitor1Share'										}
					,{	name: 'competitor2Share'										}
					,{	name: 'geolocation'												}
					,{	name: 'date'													}
					,{	name: 'transactedOn'											}
				]
			});
	}
	,getMDRProfiles: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'mdrProf'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
				{
					 model	: 'MDRProfile'
					,proxy	: proxy
				});
	}
	,getMDRProfileGrid : function()
	{
		var me			=	this;
		var mdrProfileGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.MDRProfile.GRID.TITLE')
			,itemId		: 'mdrProfileGrid'
			,store		: me.getMDRProfiles()
			,columns		: 
			[
				 {	text : 'MDR'					,dataIndex : 'mdrName'				}
				,{	text : 'TBL Name'				,dataIndex : 'tblName'				}
				,{	text : 'Crop'					,dataIndex : 'crop'					}
				,{	text : 'Village'				,dataIndex : 'village'				}
				,{	text : 'Mobile No'				,dataIndex : 'mobileNo'				}
				,{	text : 'Total Crop Area'		,dataIndex : 'totalCropArea'		,filter: 'number'}
				,{	text : 'Pioneer Share'			,dataIndex : 'pioneerShare'			,filter: 'number'}
				,{	text : 'Major Competitor1'		,dataIndex : 'majorCompetitor1'		}
				,{	text : 'Major Competitor2'		,dataIndex : 'majorCompetitor2'		}
				,{	text : 'Competitor1 Share'		,dataIndex : 'competitor1Share'		,filter: 'number'}
				,{	text : 'Competitor2 Share'		,dataIndex : 'competitor2Share'		,filter: 'number'}
				,{	text : 'Date'					,dataIndex : 'date'					,filter : 'date'	,renderer : U.renderFormattedDate	}
				//,{	text: 'Transacted On'		,dataIndex : 'transactedOn'			,filter : 'date'	,renderer : U.renderFormattedDate	}
				,{	text : 'Action 1'		,width : 135	,sortable : false			,filter : false		,dataIndex : 'id'	,renderer :  function(v) {return "<button type='button' onclick=MDR_PROFILE.getFarmers(\'"+v+"\') >Show Farmers</button>"; }}
			]
		};
		return mdrProfileGrid;
	}
	,getFarmers :function(mdrProfileId)
	{
		DEMAND_FARMER.getFarmerGrid(mdrProfileId,"MDR Profiling - Farmers","mdrProfilingFarmerMapService",true)
	}
};

MDR_PROFILE.init();
