Ext.define('ATPAPP.view.main.Viewport',
{
	extend	: 'Ext.Viewport'
	,layout	: 'border'
	,items	: 
	[
		{
			xtype		: 'toolbar'
			,region		: 'north'
			,itemId		: 'toolbarId'
			,enableOverflow: true
			,cls		: 'x-custom-mainmenu'
			,height 	: 62
			,defaults	: 
			{
				scale		: 'medium'
				,iconAlign	: 'left'
				,cls		: 'x-custom-button'
			}
			,items		: HOME.generateToolBar()
		},{
			region		: 'center'
			,border		: false
			,autoScroll	: false
			,layout		: 'fit'
			,xtype		: 'panel'
			,style		: 'background: #fff;'
		},
		{
			 region		: 'south'
			,cls		: 'x-custom-mainmenu'
			,height 	: 30
			,border		: false
			,xtype		: 'toolbar'
		}
	]
	,listeners:
	{
		boxready: function()
		{
			HOME.activateDefaultMenu();
		}
	}
});