var appLbls = new Ext.util.HashMap();

appLbls.add('ATP.GLOBAL.CONFIRM','Confirm');

function getLabel(labelKey)
{
	return appLbls.get(labelKey);
}
