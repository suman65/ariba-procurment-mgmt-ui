

var DASHBOARD = {
	init: function()
	{
		
	}
	,locations	: null
	,createFilterStores: function()
	{
		
	}
	,getDashboard: function()
	{
		return {xtype: 'homedashboard'};
	}
	,getCommercialUnits : function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: false
			,proxy		: 
			{
				type	: 'ajax'
				,url	: ATP.Urls.comboData
				,reader	: 'combojsonreader'
				,extraParams: {actionType : 'commercialUnitService'}
			}
		});
	}
	,getRegions: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: false
			,proxy 		: 
			{
				type 		: 'ajax'
				,url 		: ATP.Urls.comboData
				,extraParams: {actionType : 'regionService'}
				,reader 	: 'combojsonreader'
			}
		});
	}
	,getYears: function(allNotReq)
	{
		var years = [], startYear = 2015, endYear = Ext.Date.format(new Date(), 'Y');

		if (!allNotReq)
		{
			years.push({id: 0, name: "ALL"});
		}
		for (var i = startYear; i <= endYear; i++)
		{
			years.push({id: i, name: "" + i});
		}

		return Ext.create('Ext.data.Store',
		{
			fields	: [{name: 'id'}, {name: 'name'}]
			,data	: years
			,autoDestroy: true
		});
		//return COMMON.getYears();
	}
	,getSeasons: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: true
			,proxy		: 
			{
				type	: 'ajax'
				,url 		: ATP.Urls.comboData
				,extraParams: {actionType : 'seasonService'}
				,reader	: 'combojsonreader'
			}
		});
	}
	,getCrops: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: true
			,proxy		: 
			{
				type	: 'ajax'
				,url 		: ATP.Urls.comboData
				,extraParams: {actionType : 'cropService'}
				,reader	: 'combojsonreader'
			}
		});
	}
	,getDemandActivities: function()
	{
		return Ext.create('Ext.data.ComboStore',
		{
			autoLoad	: true
			,proxy		: 
			{
				type	: 'ajax'
				,url 		: ATP.Urls.getDemandActivities
				,reader	: 'combojsonreader'
			}
		});
	}
	,getTargetParams: function()
	{
		return Ext.create('Ext.data.Store',
		{
			fields	: [{name: 'id'}, {name: 'name'}]
			,data	: [{id: 0, name: "No. Of Farmers"}, {id: 1, name: "No. Of Activities"}]
			,autoDestroy: true
		});
	}
}

DASHBOARD.init();
