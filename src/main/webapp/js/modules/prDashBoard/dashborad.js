var token = token;
var PR_DASHBOARD =	
{
	init: function()
	{
	}
	,getTodayStore: function()
	{
		return Ext.create('Ext.data.ArrayStore',
		{
			storeId	: 'myStore'
			,fields	: ['id', 'count']
			,data	:
			[
				  [1, '1.4K']
			]
		});
	}
	,getMonthlyStore: function()
	{
		return Ext.create('Ext.data.ArrayStore',
		{
			storeId	: 'myStore'
			,fields	: ['id', 'count']
			,data	:
			[
				  [1, '12.2K']
			]
		});
	}
	,getPercStore: function()
	{
		return Ext.create('Ext.data.ArrayStore',
		{
			storeId	: 'myStore'
			,fields	: ['id', 'count']
			,data	:
			[
				  [1, '6.11%']
			]
		});
	}
	,getTodayTpl: function()
	{
		return new Ext.XTemplate(
			'<div class="dashborad-heading1">',
				'<tpl for=".">',
				'<span>Todays <br> Score Card<br></span>',
				'<span class="text">{count}</span>',
				'</tpl>',
			'</div>'
		);
	}
	,getMonthlyTpl: function()
	{
		return new Ext.XTemplate(
			'<div class="dashborad-heading2">',
				'<tpl for=".">',
				'<span>Monthly <br> Score Card<br></span>',
				'<span class="text">{count}</span>',
				'</tpl>',
			'</div>'
		);
	}
	,getPercentageTpl: function()
	{
		return new Ext.XTemplate(
			'<div class="dashborad-heading3">',
				'<tpl for=".">',
				'<span>Percentage Growth <br> Since Last Month<br></span>',
				'<span class="text">{count}</span>',
				'</tpl>',
			'</div>'
		);
	}
	,getTodayView : function()
	{
		var me = this;
		var view = Ext.create('Ext.view.View',
				{
					 tpl		: me.getTodayTpl()
					,store     	: me.getTodayStore()
					,itemSelector: 'div.datasync-section'
					//,width: '13%'
					,height : '100%'
				});
		return view;
	}
	,getMonthlyView : function()
	{
		var me = this;
		var view = Ext.create('Ext.view.View',
				{
					 tpl		: me.getMonthlyTpl()
					 ,store     : me.getMonthlyStore()
					,itemSelector: 'div.datasync-section'
					//,width: '13%'
					,height : '100%'
				});
		return view;
	}
	,getPercentageView : function()
	{
		var me = this;
		var view = Ext.create('Ext.view.View',
				{
					 tpl		: me.getPercentageTpl()
					 ,store     : me.getPercStore()
					,itemSelector: 'div.datasync-section'
					//,width: '13%'
					,height : '100%'
				});
		return view;
	}
	,getDashBoardView: function()
	{
		var me = this;
		var todayView = me.getTodayView();
		var monthlyView = me.getMonthlyView();
		var percentageView = me.getPercentageView();
		
		/*var cont = Ext.create('Ext.container.Container', 
		{
		     layout: 'hbox'
		    ,html : '<p><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Overview</b></p>'
		    ,cls : 'dataview-container'
		    ,items: 
		    	[	
		    		todayView,monthlyView,percentageView
		    	]
		});
		var cont = Ext.create('Ext.container.Container', 
				{
				     layout: 'hbox'
				    ,html : '<p><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Overview</b></p>'
				    ,cls : 'dataview-container'
				    ,items: 
				    	[	
				    		todayView,monthlyView,percentageView
				    	]
				});*/
		var cont = Ext.create('Ext.panel.Panel', 
		{
			width : '100%'
			,height : '100%'
			,layout: 'hbox'
			,border : 1
		    ,items : [
		    			{
		    				xtype : 'container',
		    				layout: 'hbox'
		    				,width : '50%'
		    				,height : 200
		    				//,margin : 20
	    				    ,html : '<p><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Overview</b></p>'
	    				    ,cls : 'dataview-container'
	    				    ,items: 
	    				    	[	
	    				    		todayView,monthlyView,percentageView
	    				    	]
		    			},
		    			{
		    				xtype : 'container',
		    				layout: 'hbox'
		    				,width : '50%'
		    				,height : 200
		    				//,margin : 20
	    				    ,html : '<p><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Overview</b></p>'
	    				    ,cls : 'dataview-container'
	    				    ,items: 
	    				    	[	
	    				    		//todayView,monthlyView,percentageView
	    				    	]
		    			}
		    		]
		});
		return cont;
	}
};
PR_DASHBOARD.init();
