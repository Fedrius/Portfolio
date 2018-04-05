$(function() {
    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            document.getElementById('submitFormBtn').disabled = true;
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }

            let response = grecaptcha.getResponse();
            if (response === ''){
                $('#success').html("<div class='alert alert-danger'>");
                $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                    .append("</button>");
                $('#success > .alert-danger').append("<strong>Please verify that you are human");
                $('#success > .alert-danger').append('</div>');
                document.getElementById('submitFormBtn').disabled = false;
            } else {
                $.ajax({
                    url: 'https://cors-anywhere.herokuapp.com/https://www.google.com/recaptcha/api/siteverify',
                    type: 'POST',
                    data: {
                        secret: '6Le8PVAUAAAAAIrAXRL7pEH8WmC3cKfWo-L95BN5',
                        response: response
                    },
                    success: function(resp){
                        if(resp.success === true){
                            $.ajax({
                                url: "php_mailer/mail_handler.php",
                                type: "POST",
                                data: {
                                    name: name,
                                    email: email,
                                    message: message
                                },
                                cache: false,
                                success: function(resp) {
                                    // Success message
                                    $('#success').html("<div class='alert alert-success'>");
                                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                        .append("</button>");
                                    $('#success > .alert-success')
                                        .append("<strong>Your message has been sent. </strong>");
                                    $('#success > .alert-success')
                                        .append('</div>');

                                    //clear all fields
                                    $('#contactForm').trigger("reset");
                                    document.getElementById('submitFormBtn').disabled = false;
                                    grecaptcha.reset();
                                },
                                error: function() {
                                    // Fail message
                                    $('#success').html("<div class='alert alert-danger'>");
                                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                        .append("</button>");
                                    $('#success > .alert-danger').append("<strong>Sorry, my mail server is not responding. Please try again later!");
                                    $('#success > .alert-danger').append('</div>');
                                    //clear all fields
                                    $('#contactForm').trigger("reset");
                                    document.getElementById('submitFormBtn').disabled = false;
                                    grecaptcha.reset();
                                },
                            })
                        } else {
                            $('#success').html("<div class='alert alert-danger'>");
                            $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                .append("</button>");
                            $('#success > .alert-danger').append("<strong>Please re-verify that you are human.");
                            $('#success > .alert-danger').append('</div>');
                            document.getElementById('submitFormBtn').disabled = false;
                            grecaptcha.reset();
                        }
                    },
                    error: function(resp){
                        console.log('error', resp);
                        document.getElementById('submitFormBtn').disabled = false;
                        grecaptcha.reset();
                    }
                })
            }


        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});

