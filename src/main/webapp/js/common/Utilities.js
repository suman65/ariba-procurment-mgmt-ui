ATP.Date = ATP.Date || { };
ATP.Date.Patterns = {
		DefaultFormat: 'd-m-Y',
		DateFieldRendering : 'd-m-Y',
		DateFieldSubmit : 'Y-m-d'
	};

/**
 * The date format string that the Ext.util.Format.dateRenderer and Ext.util.Format.date functions use.
 */
Ext.Date.defaultFormat = ATP.Date.Patterns.DefaultFormat;
Ext.Date.useStrict = true;
/**
 * Default Date Field Format.
 */
Ext.form.field.Date.prototype.format = ATP.Date.Patterns.DateFieldRendering;
Ext.form.field.Date.prototype.submitFormat = ATP.Date.Patterns.DateFieldSubmit;

/**
 * Default End Date
 */
//ATP.Date.DefaultEndDate = new Date('2099-12-31');

ATP.mandatoryIndicator = '<font style = "color:red; font-weight : bold; font-size:18px;"> *</font>';
//var ATP.editableFiedIndication = '<span style="font-size:9px;color:red;font-style:bold;bottom:3px;left:0px;position:relative;">#</span>';
ATP.msgConfig = {
		message			: 'Saving your data, please wait...'
		,progress 		: true
		,progressText 	: 'Processing...'
		,width			: 300		
		,closable 		: false
		,wait			: true
		,waitConfig		: {
							interval	: 200
							,text		: 'Processing...'
						}
	};

Ext.define('ATP.Utilities',
{
	alternateClassName: ['Utilities', 'U']
	,statics:
	{
		getWidth: function()
		{
			return Ext.Element.getViewportWidth();
		}
		,getHeight: function()
		{
			return Ext.Element.getViewportHeight();
		}
		,renderFormattedDate: function(value)
		{
			if (value != '' && value != null)
			{
				var format = value.length == 10 ? 'd-m-Y' : 'd-m-Y H:i:s'
				var date = Ext.Date.format(new Date(value), format);
			}
			return date;
		}
		,renderFormattedTime: function(value)
		{
			if (value != '' && value != null)
			{
				var date = Ext.Date.format(new Date(value), 'g:i A');
			}
			
			return date;
		}
		,formatMsg: function(operation)
		{
			var verb = Ext.String.capitalize(operation.action);
			if(operation.success)
			{
				if(verb == 'Destroy')
					verb += 'ed';
				else
					verb += 'd';
				var response = Ext.JSON.decode(operation.response.responseText);
				var message = response.message ? response.message : "Record "+verb+" Successfully.";
			}
			else
			{
				message = operation.error ? operation.error : "Unable To "+verb+" The Record.";
			}
			return message;
		}
		,showAlert: function(title, msg, icon, button, fn, animateTarget)
		{
			Ext.MessageBox.show(
			{
				title		: title ? title : "Info"
				,cls		: 'x-custom-window'
				,msg		: msg? msg: ""
				,modal		: true
				,closable	: false
				,icon		: icon ? icon : Ext.MessageBox.INFO
				,buttons	: button? button : Ext.MessageBox.YESNO
				,fn			: fn ? fn : Ext.emptyFn
				,animateTarget: animateTarget ? animateTarget : null
			});
		}
		,loadExternalFile: function(filePath, fileType)
		{
			if ("js" == fileType)
			{
			     document.write('<script type="text/javascript" charset="UTF-8" src="' + filePath  +'.js"></script>');
			}
			else if ("css" == fileType)
			{
				document.write('<link type="text/css" rel="stylesheet" href="' + filePath  +'.css"></link>');
			}
		}
		,YesNoRenderer: function(v)
		{
			return v ? 'Yes' : 'No';
		}
		/**
		 * Common loader for all the data requests
		 * @param target
		 * @returns {Ext.LoadMask}
		 */
		,showLoadMask: function(target)
		{
			/**
			 * User Responsibility To Destroy The Mask
			 */
			return new Ext.LoadMask({msg: 'Please wait...'	,target: target})
		}
		,floatRenderer: function(value)
		{
			return Ext.util.Format.number(value, '0.00');
		}
		,showProgresText: function()
		{
			Ext.MessageBox.show(ATP.msgConfig);
		}
		,showWindow: function(winConfig)
		{
			var window;
			var config = {
					layout		: 'fit'
					,maxHeight	: Ext.Element.getViewportHeight()
					,maxWidth	: Ext.Element.getViewportWidth()
					,modal		: true
					,draggable	: true
				};

			if (Ext.isObject(winConfig))
			{
				Ext.apply(config, winConfig || { });
				window = Ext.create('Ext.custom.window.Window', config);
			}
			else
			{
				
			}

			return window;
		}
		,toFixedDecimal: function(value, precision)
		{
			var precision = precision || 2;
			return value.toFixed(precision);
		}
		,validateUniqueness: function(field, value, id, url, options)
		{
			var params = {value: value, id: id ? id : null};
			Ext.apply(params, options || { });
			Ext.Ajax.request(
			{
				url 	: url
				,method	: 'POST'
				,params : params
				,success: function (response) 
				{
					var response = Ext.JSON.decode(response.responseText);
					field.setValidation(response.message);
				}
				,failure	: function (response)
				{
					field.setValidation("Unable to validate.");
				}
			});
		}
		,selectDivContent : function(containerid)
		{
			if (document.selection) 
			{
				var range = document.body.createTextRange();
				range.moveToElementText(document.getElementById(containerid));
				range.select();
			}
			else if (window.getSelection) 
			{
				var range = document.createRange();
				range.selectNode(document.getElementById(containerid));
				window.getSelection().addRange(range);
			}
		}
	}
});

/**
 * @author rabindranath.s
 * Convert Camel Case to Regular String
 */
String.prototype.camelCaseToRegular = function()
{
	return this.replace( /(^[a-z]+)|[0-9]+|[A-Z][a-z]+|[A-Z]+(?=[A-Z][a-z]|[0-9])/g,
		function(match, first)
		{
			if (first)
			{
				match = match[0].toUpperCase() + match.substr(1);
				return match;
			}

			return ' ' + match;
		}
	)
}
