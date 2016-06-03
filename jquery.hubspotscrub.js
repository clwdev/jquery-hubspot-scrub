(function ($) {
    $.fn.extend({
        hubspotScrubCall: function (callback, portal_id, form_id) {
            hbspt.forms.create({
                css: '',
                portalId: portal_id,
                formId: form_id,
                target: false,
                onFormReady: function (form, ctx) {
                    var vals = [];
                    if (typeof ctx.form != 'undefined') {
                        // Legacy method
                        for (i = 0; i < ctx.form.formFieldGroups.length; i++) {
                            if (typeof ctx.form.formFieldGroups[i].fields != 'undefined') {
                                for (j = 0; j < ctx.form.formFieldGroups[i].fields.length; j++) {
                                    if (typeof ctx.form.formFieldGroups[i].fields[j].name != 'undefined' && ctx.form.formFieldGroups[i].fields[j].name.length && ctx.form.formFieldGroups[i].fields[j].defaultValue.length) {
                                        vals[ctx.form.formFieldGroups[i].fields[j].name] = ctx.form.formFieldGroups[i].fields[j].defaultValue;
                                    }
                                }
                            }
                        }
                    } else {
                        // V2 method
                        vals = form.find('input').hubspotScrubInput(form_id);
                    }
                    // Return to the callback if available
                    if ($.isFunction(callback)) {
                        callback(vals);
                    }
                    form.remove();
                }
            });
        },
        hubspotScrubCallMulti: function (callback, portal_id, form_id) {
            if (typeof form_id == 'object') {
                var t = this;
                t.vals = [];
                t.count = 0;
                t.total = form_id.length;
                $.each(form_id, function (index, value) {
                    $(this).hubspotScrubCall(function (subvals) {
                        t.vals = $.merge(subvals, t.vals);
                        t.count++;
                        if (t.count == t.total) {
                            // We are done with all sub-callbacks
                            if ($.isFunction(callback)) {
                                callback(t.vals);
                            }
                        }
                    }, portal_id, value);
                });
            } else {
                $(this).hubspotScrubCall(callback, portal_id, form_id);
            }
        },
        hubspotScrubInput: function (form_id) {
            var vals = [];
            $(this).each(function () {
                var id = $(this).attr('id');
                if (id && id.length) {
                    var name = id.substring(0, id.indexOf('-' + form_id));
                    if (name && name.length) {
                        var val = $(this).val();
                        if (val && val.length) {
                            vals[name] = val;
                        }
                    }
                }
            });
            return vals;
        },
        hubspotScrub: function (callback, portal_id, form_id) {
            if (typeof portal_id != 'undefined' && typeof form_id != 'undefined') {
                // Retrieve values for a specific form, preloading the library if needed
                if (typeof hbspt == 'undefined') {
                    $.getScript('//js.hsforms.net/forms/' + (window.attachEvent && !window.addEventListener ? 'v2-legacy.js' : 'v2.js'), function () {
                        $(this).hubspotScrubCallMulti(callback, portal_id, form_id);
                    });
                } else {
                    $(this).hubspotScrubCallMulti(callback, portal_id, form_id);
                }
            } else {
                // Retrieve values for all hubspot forms in scope
                var vals = $(this).find("[id^='hbspt-form-'] input").hubspotScrubInput(form_id);
                if ($.isFunction(callback)) {
                    callback(vals);
                }
            }
        }
    });
})(jQuery);
