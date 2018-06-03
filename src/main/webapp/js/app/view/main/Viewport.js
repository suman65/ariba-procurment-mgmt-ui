Ext.define('ATPAPP.view.main.Viewport',
{
	extend	: 'Ext.Viewport'
	,layout	: 'border'
	,items	: 
	[
		{
			region		: 'north'
			,border		: false
			,autoScroll	: false
			,layout		: 'vbox'
			,xtype		: 'panel'
			,style		: 'background: #fff;'
			,enableOverflow: true
			,height 	: 107
			,items : [
						{
							 border		: false
							,autoScroll	: false
							,xtype		: 'container'
							,height 	: 62
							,cls 		: 'x-header-panle-top'
							,width		: '100%'
							,style		: 'background-color:#085282'
							,html		: '<div style="color:#fff;font-size:26px;font-weight:bold;text-align:center;margin-top:20px;verticle-align:left;font-family:verdana,sans-serif;">Ariba Procurement Requisition</div>'
						},
						{
						     xtype		: 'toolbar'
							,itemId		: 'toolbarId'
							,enableOverflow: true
							,cls		: 'x-custom-mainmenu'
							,height 	: 42
							,width		: '100%'
							,defaults	: 
							{
								scale		: 'medium'
								,iconAlign	: 'left'
								,cls		: 'x-custom-button'
							}
							,items		: HOME.generateToolBar()
						}
			]
		}
		,{
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