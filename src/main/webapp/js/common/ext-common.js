/**
 * Common Store For Yes or No Values
 */
var COMMON = {
	init: function()
	{
		this.defineSeasonCalendar();
	}
	,statuses		: null
	,getStatusStore : function()
	{
		if(!this.statuses)
		{
			this.statuses = Ext.create('Ext.data.Store', 
			{
				fields: ['id', 'name'],
				idProperty: 'xyz',
				data : 
				[
				 {'id'	: true				,'name':CONSTANTS.STATUS.ACTIVE		},
				 {'id'	: 'false'			,'name':CONSTANTS.STATUS.INACTIVE	}
				]
			});
		}
		return this.statuses;
	}
	,defineSeasonCalendar : function()
	{
		Ext.define('ATP.data.SeasonCalendar',
		{
			extend	: 'Ext.data.Model'
			,fields	: ['id', 'name', 'seasonId', 'seasonName', 'cropId', 'cropName', 'activityId',' activityName', 'locked']
		});
	}
	,getYears: function()
	{
		var years = [], startYear = 2015, endYear = Ext.Date.format(new Date(), 'Y');

		for (var i = startYear; i <= endYear; i++)
		{
			years.push(i);
		}

		return years;
	}
};

COMMON.init();
