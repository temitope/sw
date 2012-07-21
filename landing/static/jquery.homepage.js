$(document).ready(function() {
	$url = "";
	if (document.location.hostname == "localhost")
		$url = "/fam.ly";
	
	//INPUT HINT
	$('#signup_form').inputHintOverlay(6,0);
	$('#oops_form').inputHintOverlay(6,0);
	$('#reset_form').inputHintOverlay(6,0);

	/*
	*	LOGIN FORM RELATED FUNCTIONALITY
	*/
	//LOGIN BUTTON
	var $login_link = $('.login_link');
	$login_link.click(function (e) {
		e.preventDefault();
		$('.login_dialog').show();
		$('input#username').focus();
	});
	
	//SETS MOUSE_INSIDE VARIABLE TO INSIDE/OUTSIDE OF THE LOGIN FORM
	var $mouse_inside = false;
	$('.login_dialog').hover(function() {
		$mouse_inside = true;
	}, function() {
		$mouse_inside = false;
	});
	
	//CLOSES THE LOGIN FORM WHEN SOMEONE CLICKS OUTSIDE OF THE LOGIN FORM
	$('body').mouseup(function() {
		if (!$mouse_inside) $('.login_dialog').hide();
	});
	
	//ERROR CONTAINER FOR LOGIN ERRORS
	var $error_container = $('#login_form .error_container');
	$('#login_form').validate({
		errorContainer: $error_container
	});
	
	//LOGIN FORM AJAX
	$('#login_form').submit(function (e) {
		e.preventDefault();
		$('.bad_login_credentials').hide();
		
		var $form = $(this);
		var $username = $form.find('#username').val();
		var $password = $form.find('#password').val();
		
		$.ajax({
			url			: $url + '/login/submit',
			type		: 'POST',
			data		: {
				ajax		: 1,
				username 	: $username,
				password 	: $password
			},
			dataType	: 'json',
			success		: function() {},
			error		: function() {},
			complete	: function(data) {
				var $obj = jQuery.parseJSON(data.responseText);
				if ($obj.login == 1) //user successfully logged in
					window.location = $url + '/home';
				else
				{
					$('.bad_login_credentials').show();
				}
			}
		});
	});
	
	/*
	*	REGISTRATION FORM
	*/
	$('#registration_form').validate({
		rules: {
			username: 'required',
			email: {
				required: true,
				email: true
			},
			password: 'required'
		},
		messages: {
			username: 'Username is required',
			password: 'Password is required',
			email: 'Please enter a valid email'
		}
	});
	
	/*
	*	PRE-LAUNCH SIGNUP FORM
	*/
	$('#signup_form').submit(function (e) {
		e.preventDefault();
		
		var $form = $(this);
		var $signup_og = $('.signup', $form);
		var $action = $form.attr('action');
		var $email_address = $form.find('#email_address').val();
		
		//loading image
		$prelaunch_loader_html = 	'<div class="prelaunch-loader">' +
										'<img src="' + $url + '/images/ajax-loader.gif"/>' +
									'</div>';
		$signup_og.empty().prepend($prelaunch_loader_html);
		
		//submit the form
		$.ajax({
			url: $action,
			type	: 'POST',
			data : { 
				EMAIL : $email_address
			},
			success		: function(data) {
				//console.log(data);
				//show success message
				var $returned = $('<div>' + data + '</div>');
				//console.log($returned);
				var $signup_replace = $('.signup', $returned[0]);
				//console.log($signup_replace);
				$signup_og.replaceWith($signup_replace);
			}
		});
	});
});