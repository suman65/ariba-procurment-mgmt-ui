Ext.define('ATPAPP.Application',
{
	extend		: 'Ext.app.Application'
	,name		: 'ATPAPP'
	,views		: ['ATPAPP.view.main.Viewport']
	,enableQuickTips: true
	,appFolder	: 'js/app'
	,paths		: {'Ext.ux': './js/lib/ExtJs-5.1.1/ux'}
	,onBeforeLaunch: function()
	{
		var me = this,
			History = Ext.util.History,
			defaultToken = me.getDefaultToken(),
			currentProfile = me.getCurrentProfile(),
			controllers, c, cLen, controller, token;

		me.initMainView();

		if (currentProfile) {
			currentProfile.launch();
		}

		me.launch.call(me.scope || me, (currentProfile && currentProfile._name));
		me.launched = true;
		me.fireEvent('launch', me);

		controllers	= me.controllers.items;
		cLen		= controllers.length;

		for (c = 0; c < cLen; c++) {
			controller = controllers[c];
			controller.onLaunch(me);
		}

		if (!History.ready) {
			History.init();
		}
		token = History.getToken();
		if (token) {
			Ext.app.route.Router.onStateChange(token);
		} else if (defaultToken) {
			History.add(defaultToken);
		}
	}
	,launch		: function(profile)
	{
		Ext.tip.QuickTipManager.init();
		HOME.launch();
	}
});
