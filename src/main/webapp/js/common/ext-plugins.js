Ext.define('Ext.grid.plugin.GridColumnToolTip',
{
    extend	: 'Ext.plugin.Abstract',
    alias	: 'plugin.gridcolumntooltip',
    init	: function(grid)
    {
    	var me = this;
        grid.on('columnresize', function(ct, c, width)
		{
            me.setTooltip(c);
            if (c.applyCellTooltip)	grid.getView().refresh();
        });

        /*grid.on('beforerender', function()
		{
            Ext.Array.each(grid.columns, function(c)
    		{
            	c.initRenderData = me.createSequence(c.initRenderData, c);
    		});
        });*/

        grid.on('render', function()
		{
            Ext.Array.each(grid.columns, function(c)
    		{
            	c.on('render', function(col)
    			{
            		me.setTooltip(col);
				});

            	if (c.applyCellTooltip)
                {
            		/**
            		 * This config hampers the performance since the entire grid data is rerendered, so apply this any the specific column where it is essntial 
            		 */
                	if (c.renderer)
                    {
                        c.renderer = me.createRendererSequence(c.renderer);
                    }
                    else
                    {
                        c.renderer = me.renderer;
                    }
                }
    		});
        });
    }
	,setTooltip: function(c)
	{
		if ((!c.titleEl.getAttribute('data-qtip') || c.titleEl.getAttribute('manual-qtip')) && this.checkWidth(c))
        {
        	c.titleEl.dom.setAttribute('manual-qtip', true);
        	c.titleEl.dom.setAttribute('data-qtip', c.text);
        }
        else
        {
        	c.titleEl.dom.removeAttribute('data-qtip');
        }
	}
	,checkWidth: function(c)
	{
		var tm = new Ext.util.TextMetrics(c.textEl);
		if ((c.getEl().getWidth() || 10) <= ((tm.getSize(c.text).width + 20) || 0))
		{
			tm.destroy();
			return true;
		}

		tm.destroy();
		return false;
	}
	,createSequence: function(fn, c)
	{
		var me = this;
		return function()
        {
            var result = fn.apply(this, arguments);
            if (!result.tipMarkup && me.checkWidth(c))
            {
            	result.tipMarkup = 'data-qtip="' + (result.text) + '"';
            }
            return result;
        };
	}
	,renderer: function(a, b, c, d, e, f, g)
	{
		if(a)
        {
			var tm = new Ext.util.TextMetrics();
            if ((g.ownerCt.columns[e].getEl().getWidth() || 10) <= (((tm.getSize(a).width + 20) || 0)))
            {
                b.tdAttr += 'data-qtip="' + (a) + '"';
            }
            tm.destroy();
        }
		return a;
	}
	,createRendererSequence: function(fn)
	{
		var me = this;
        return function()
        {
            var value = fn.apply(this, arguments);
            //arguments[0] = value;
            me.renderer.apply(this, arguments);
            return value;
        };
    }
	,destroy: function()
	{
		
	}
});


