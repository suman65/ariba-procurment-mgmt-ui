/**
 * @author rabindranath.s
 */

var TERRITORY_SALES =	
{
	init: function()
	{
		this.defineTerritorySale();
	}
	,defineTerritorySale : function()
	{
		Ext.define('ATP.data.TERRITORY_SALE',
		{
			extend	: 'Ext.data.Model'
			,fields	:
			[
				 {	name: 'id'														}
				,{	name: 'tblName'					,mapping: 'tbl.name'			}
				,{	name: 'tbl'						,mapping: 'tbl.id'				}
				,{	name: 'conductedYear'											}
				,{	name: 'competitor1'				,mapping: 'competitor1.name'	}
				,{	name: 'competitor2'				,mapping: 'competitor2.name'	}
				,{	name: 'pioneerSales'			,mapping: 'pioneerSales'		}
				,{	name: 'competitor1Sales'		,mapping: 'competitor1Sales'	}
				,{	name: 'competitor2Sales'		,mapping: 'competitor2Sales'	}
				,{	name: 'otherSales'				,mapping: 'otherSales'			}
				,{	name: 'totalTerritorySales'		,mapping: 'totalTerritorySales'	}
			 ]
		});
	}
	,getTerritorySales: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'liquidationTeritorySalesDataService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
		{
			 model	: 'ATP.data.TERRITORY_SALE'
			,proxy	: proxy
		});
	}
	,getTerritorySalesGrid: function()
	{
		var me			=	this;
		var territorySalesGrid	=	{
			xtype		: 'customgrid'
			,itemId		: 'territorySalesGrid'
			,store		: me.getTerritorySales()
			/*,tbar		: 
			[
			 	{xtype	: 'customtbarbutton'		,text : 'Add MDR'		,iconCls : 'x-atp-add'							,handler : function(btn) { me.createMDR(btn)}	}
			 	,{xtype	: 'customtbarbutton'		,text : 'Edit MdR'		,iconCls : 'x-atp-edit'	,itemId : 'editMdrBtn'	,handler : function(btn) { me.editMDR(btn.up('grid#mdrGrid'))}	,disabled : true}
			 ]*/
			,columns		: 
			[
				 {	text : 'TBL Name'				,dataIndex : 'tblName'			}
				,{	text : 'Conducted Year'			,dataIndex : 'conductedYear'	}
				,{	text : 'Competitor1'			,dataIndex : 'competitor1'		}
				,{	text : 'Competitor2'			,dataIndex : 'competitor2'		}
				,{	text : 'Pioneer Sales'			,dataIndex : 'pioneerSales'		}
				,{	text : 'Competitor1 Sales'		,dataIndex : 'competitor1Sales'	}
				,{	text : 'Competitor2 Sales'		,dataIndex : 'competitor2Sales'	}
				,{	text : 'Other Sales'			,dataIndex : 'otherSales'		}
				,{	text : 'Total Territory Sales'	,dataIndex : 'totalTerritorySales'}
			]
			/*,listeners :
			{
				itemdblclick : function(view)
				{
					me.editMDR(view.grid)
				}
				,selectionchange : function(selModel, records)
				{
					if(records.length > 0)
					{
						selModel.view.grid.down('button#editMdrBtn').setDisabled(false);
					}
					else
					{
						selModel.view.grid.down('button#editMdrBtn').setDisabled(true);	
					}
				}
			}*/
		};

		return territorySalesGrid;
	}
}

TERRITORY_SALES.init();
