/**
 * @author rabindranath.s
 */
var HOME = {
	activeMenuId: null
	,activeScreenId: null
	,generateToolBar: function()
	{
		var me = this, toolbarItems = [{xtype: 'image', /*src: './images/home/sap_ariba.jpg',*/ width: 145, height: '100%'}];

		var menus = me.getMenus();
		for (var index = 0; index < menus.length; index++) 
		{
			var menuId		= menus[index].id;
			var menuText	= menus[index].menuText;
			var module		= menus[index].module;
			var refMethod	= menus[index].refMethod;
			var hasSubMenu	= menus[index].hasSubMenu;
			var btnConfig	= { };

			btnConfig.xtype		= 'menubutton';
			btnConfig.menuId	= menuId;
			btnConfig.text		= menuText;
			btnConfig.iconCls	= menus[index].iconCls;

			//btnConfig.screens	= menus[index].screens;

			btnConfig.toggleGroup= 'mainMenu';
			btnConfig.handler	= me.replaceCenterRegion.bind(me, hasSubMenu, module, refMethod);
			btnConfig.listeners = {
				click: function(btn)
				{
					me.activeMenuId = btn.menuId;
					var toolbar = btn.up('toolbar');
					if (toolbar.activeBtn)
					{
						toolbar.activeBtn.removeCls('menubutton-active');
					}
					btn.addCls('menubutton-active');
					toolbar.activeBtn = btn;
				}
			};
			btnConfig.scale = 'large';
			toolbarItems.push(btnConfig);
		}

		toolbarItems.push(	
			{xtype: 'tbfill'},
			{text:'', overflowText: 'Signout', iconCls: 'x-atp-home-signout-icon', handler: signOut ,scale:'large' ,cls:'x-custom-button'}
		);
		return toolbarItems;
	}
	,getMenus: function()
	{
		var menus = [
					{id: 1	,module	: "PR_DASHBOARD"	,menuText: "Dashboard"	   ,iconCls: "x-atp-dashboard"		,hasSubMenu : false		,refMethod : 'getDashBoardView' },
					{id: 2	,module: "PRUPLOAD"			,menuText: "PR Upload"					/*,"iconCls":'x-atp-dashboard'*/		,hasSubMenu: false		,refMethod: 'getView'},
					{id: 3	,module	: "PR"				,menuText: "Purchase Requisition Data"	/*,"iconCls": "x-atp-reports"*/			,hasSubMenu : false		,refMethod : 'getPRData' },
					
			];
		return menus;
	}
	/**
	 * Preferred Method to update viewport centre region
	 */
	,replaceCenterRegion: function(hasSubMenu, module, refMethod, btn)
	{
		var me = this, viewport, centerRegion, content;
		try
		{
			viewport = Ext.ComponentQuery.query('viewport')[0];
			centerRegion = viewport.down('[region=center]');
			viewport.remove(centerRegion);

			viewport.setLoading(true);
			content = me.getCenterRegionContent(hasSubMenu, module, refMethod, btn);
			content.region = 'center';
			viewport.add(content);
			//viewport.updateLayout();
			viewport.setLoading(false);
		}
		catch(err)
		{
			//viewport.add({xtype: 'panel', region: 'center'});
			me.print(err);
		}
	}
	,addItems2CenterRegion: function(hasSubMenu, module, refMethod, btn)
	{
		var me = this, viewport, centerRegion, content;
		viewport = Ext.ComponentQuery.query('viewport')[0];
		centerRegion = viewport.down('[region=center]');
		content = me.getCenterRegionContent(hasSubMenu, module, refMethod, btn);
		centerRegion.removeAll();
		centerRegion.add(content);
		//centerRegion.updateLayout();
	}
	,getCenterRegionContent: function(hasSubMenu, module, refMethod, btn)
	{
		var me = this, screen;
		try 
		{
			if (!hasSubMenu)
			{
				
				screen = eval(module + '.' + refMethod + '()');
			}
			else
			{
				screen = me.getContentAsTabPanel(btn.menuId);
			}
		}
		catch(err)
		{
			throw err;
		}
		return screen;
	}
	,getContentAsTabPanel: function(menuId, screenId2Activate)
	{
		var me = this,
			screenItems,
			screenItem,
			screen,
			module,
			refMethod,
			screenName,
			iconCls,
			screenId,
			tabPanelItems = [],
			len,
			tabPanel,
			err = {message: ''},
			count,
			activeTabIndex = 0,
			activeScreenId;
		try
		{

			var menus = me.getMenus();
			for (var m = 0; m < menus.length; m++)
			{
				if (menus[m].id == menuId)
				{
					screenItems = menus[m].screens;
					break;
				}
			}

			for (var i = 0, len = screenItems.length; i < len; i++) 
			{
				screenItem = screenItems[i];
				module = screenItem.module.trim().toUpperCase();
				refMethod = screenItem.refMethod;
				screenName = screenItem.menuText;
				iconCls = screenItem.iconCls;
				screenId = screenItem.id;
				//count	= screenItem.count;

				if (!window[module] || !window[module][refMethod])
				{
					err.message = window[module] ? (module + '.' + refMethod + '() is ' + window[module][refMethod]) : (module + ' is ' + window[module]);
					me.print(err);
					continue;
				}

				screen = eval(module + '.' + refMethod + '(' + screenId +')');

				if (screen)
				{
					screen.tabConfig = {width : 153, title: screenName, iconAlign: 'left', iconCls: iconCls, tooltip: screenName};
					/*if (count != null || count != undefined)
					{
						screen.tabConfig.iconTpl = me.getIconTpl(count);
					}*/

					Ext.applyIf(screen, {
						autoScroll: true
						,screenId: screenId
						,title	: screenName
					});

					if (screen instanceof Ext.panel.Panel)
					{
						
					}
					else
					{
						/**
						 * Here screen should be an object with configs and items property
						 */
						if (screen.height)	delete screen.height;
						if (screen.width)	delete screen.width;
						if (screen.maxHeight)	delete screen.maxHeight;
						if (screen.maxWidth)	delete screen.maxWidth;
						// if (!screen.layout)	screen.layout = 'fit';
					}
				}

				tabPanelItems.push(screen);

				if (screenId2Activate && screenId2Activate == screenId)
				{
					activeTabIndex = i;
					activeScreenId = screenId2Activate;
				}
			}

			if (tabPanelItems.length > 0 && !activeScreenId)
			{
				activeScreenId = tabPanelItems[0].screenId;
			}

			me.activeScreenId = activeScreenId;
			tabPanel = Ext.create('Ext.tab.Panel', 
			{
				tabPosition	: 'left'
				,height		: '100%'
				,renderTo 	: document.body
				,cls		: 'x-atp-tabPanel'
				//,cls		: 'x-odch-hometab'
				//,bodyCls	: 'x-odch-hometab-body'
				,items		: tabPanelItems
				,removePanelHeader: false
				,bodyBorder	: true
				,autoScroll	: false
				,itemId		: 'menuItemsTabPanel'
				,activeTab	: activeTabIndex
				,tabBar		:
				{
					plain		: true
					,tabRotation: 0
					,tabStretchMax: true
					,defaults	: {height: 60}
					,margin		: '0 2 0 0'
				}
				,listeners:
				{
					tabchange: function(tp, newCard, oldCard)
					{
						/*if (newCard.getStore())
						{
							newCard.getStore().clearFilter();
							newCard.getStore().loadPage(1);
						}*/
						me.activeScreenId = newCard.screenId;
					}
				}
			});

			return tabPanel;
		}
		catch(err) 
		{
			//me.print(err);
			throw err;
		}
	}
	,print: function(err)
	{
		var error = [err.message];
		if (err.fileName) error.push('File Name: ' + err.fileName);
		if (err.lineNumber) error.push('Line No: ' + err.lineNumber);
		if (console && ATP.APPLICATION_MODE == 'DEVELOPMENT')
			console.log(error.join('\n'));
	}
	,activateDefaultMenu: function()
	{
		var me =  this, menuId, screenId, viewport, toolbar, menu, screen;

		menuId = me.getActiveMenuId();

		viewport = Ext.ComponentQuery.query('viewport')[0];
		toolbar = viewport.down('toolbar[region=north]', 1);
		menu = toolbar.down('button[menuId=' + menuId + ']');
		if (menu && !menu.disabled)
		{
			menu.doToggle();
			if (menu.fireEvent('click', menu) !== false && !menu.isDestroyed)
			{
				menu.handler(menu);
			}
		}
	}
	,getActiveMenuId : function()
	{
		var me = this;
		return me.getMenus()[0].id;
	}
	,launch: function ()
	{
		Ext.create('ATPAPP.view.main.Viewport', { });
	}
}



function signOut()
{
	var curURL = ((location.href).split('?'))[0];
	curURL = curURL.replace("#", "");
	curURL = curURL.replace("home", "login");
	location.href = Ext.urlAppend(curURL, "");
}

function passwordToChange()
{
	var changePwdForm = Ext.create('Ext.custom.form.Panel',
	{
		itemId			: 'changePasswordForm'
		,fieldDefaults	: {labelWidth: 130}
		,items			: 
		[
			{
				fieldLabel	: 'Existing Password'
				,name		: 'existingPassword'
				,allowBlank	: false
				,inputType	: 'password'
				,xtype		: 'textfield'
			}
			,{
				fieldLabel	: 'New Password'
				,name		: 'newPassword'
				,inputType	: 'password'
				,allowBlank	: false
				,xtype		: 'textfield'
				,vtype		: 'password'
			}
			,{
				fieldLabel	: 'Confirm Password'
				,name		: 'confirmPassword'
				,xtype		: 'textfield'
				,inputType	: 'password'
				,vtype		: 'password'
				,initialPassField: 'newPassword'
				,allowBlank	: false
				,listeners	:
				{
					specialkey: function (field, e)
					{
						if (e.getKey() == e.ENTER)
						{
							var form = field.up('form').getForm();
							form.submit();
							changePwd();
						}
					}
				}
			}
		]
		,buttons		: 
		[
			{	xtype	: 'customformsubmitbutton'	,text : 'Submit' ,handler	: changePwd	}
			//,{	xtype	: 'custom-form-submit-btn'	,handler	: function ()	{	changePwdForm.getForm().reset();	}}
		]
	});

	return	Utilities.showWindow({
		itemId		: 'changePassword'
		,title		: 'Change Password'
		,items		: changePwdForm
		,width		: 400
	});
}

function changePwd()
{
	var changePasswordForm 	= Ext.ComponentQuery.query('#changePasswordForm')[0];
	var oldPwd = changePasswordForm.down('[name=existingPassword]').getValue();
	var newPwd = changePasswordForm.down('[name=newPassword]').getValue();
	if (oldPwd != newPwd)
	{
		Ext.Ajax.request(
		{
			url			: ATP.Urls.changePassword
			,method		: 'POST'
			,waitMsg	: 'Saving...'
			,params		: {"newPassword": newPwd, "existingPassword": oldPwd}
			,success	: function (response)
			{
				var responseData = Ext.decode(response.responseText);
				if (!responseData.success)
				{
					changePasswordForm.down('[name=existingPassword]').setValue("");
					changePasswordForm.down('[name=existingPassword]').markInvalid("The password does not match with existing password");
					changePasswordForm.down('[name=existingPassword]').focus();
				}
				else
				{
					Ext.ComponentQuery.query('#changePassword')[0].close();
					Ext.Msg.minWidth = 430;
					Utilities.showAlert(getLabel('ATP.GLOBAL.RELOGIN'), getLabel('ATP.GLOBAL.PWDCHNG') ,null,null,
						function (btn, text)
						{
							if (btn == 'ok')
								window.location = location.href + "?actionName=signout";//'loginController.htm';
						});
				}
			}
			,failure: function (response)
			{
				Utilities.showAlert("Failure", "Unable to change the password.", Ext.MessageBox.ERROR)
				changePasswordForm.down('[name=existingPassword]').setValue("");
			}
		});
	}
	else
	{
		changePasswordForm.down('[name=newPassword]').setValue("");
		changePasswordForm.down('[name=confirmPassword]').setValue("");
		changePasswordForm.down('[name=newPassword]').markInvalid('New password should not match with old password.');
	}
}
