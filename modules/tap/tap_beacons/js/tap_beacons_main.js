jQuery(function(){

    jQuery('#tap-beacons-add-beacon-form').submit(function(e){
        e.preventDefault();

        var formData = jQuery(this).serializeArray();
        var action = jQuery(this).attr("action");

        jQuery.ajax({
            url: action,
            type: "POST",
            data: formData,
            success: function(data){
                location.reload();
            }
        });
    });

    jQuery('.tap-beacons-delete-btn').click(function(e){
        e.preventDefault();

        var action = jQuery(this).attr("href");

        var choice = confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (choice) {

            jQuery.ajax({
                url: action,
                type: "GET",
                success: function(data){
                    location.reload();
                }
            });
        }
    });

    jQuery('.tap-beacons-update-btn').click(function(e){
        e.preventDefault();

        jQuery('.tap-beacons-cancel-btn').click();

        var id = jQuery(this).data("id");

        var par = jQuery(this).parent().parent().parent(); //tr
        var uuid = par.children("td:nth-child(1)");
        var major = par.children("td:nth-child(2)");
        var minor = par.children("td:nth-child(3)");
        var save = par.children("td:nth-child(4)");

        var currentUuid = uuid.html();
        var currentMajor = major.html();
        var currentMinor = minor.html();


        uuid.html('<input type="text" id="uuid" value="' + currentUuid + '" class="form-text table-input"/>');
        major.html('<input type="text" id="major" value="' + currentMajor + '" class="form-text table-input"/>');
        minor.html('<input type="text" id="minor" value="' + currentMinor + '" class="form-text table-input"/>');
        save.append('<div class="tap-beacon-operations-2"><input type="submit" value="Save" data-id="' + id + '" class="form-submit tap-beacons-update-submit" /> | <a href="#cancel" data-id="' + id + '" class="tap-beacons-cancel-btn">cancel</a></div>');
        par.find('.tap-beacon-operations').hide();

        save.find('.tap-beacons-update-submit').bind('click', function(){
            var id = jQuery(this).data("id");

            var uuid = jQuery('#uuid').val();
            var major = jQuery('#major').val();
            var minor = jQuery('#minor').val();

            var action = "/?q=admin/tap/beacons/update&id=" + id +
                "&uuid=" + uuid +
                "&major_num=" + major +
                "&minor_num=" + minor;

            jQuery.ajax({
                url: action,
                type: "GET",
                success: function(data){
                    location.reload();
                }
            });
        });

        save.find('.tap-beacons-cancel-btn').bind('click', function(e){
            e.preventDefault();

            uuid.html(currentUuid);
            major.html(currentMajor);
            minor.html(currentMinor);
            jQuery('.tap-beacon-operations').show();
            jQuery('.tap-beacon-operations-2').remove();
        });
    });

});
