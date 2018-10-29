$(function() {
	var chnList = ["ESL_SC2", "OgamingSC2", "luminosity", "giantwaffle", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
	var chnData = [];
	var on = 0, off = 0, id = 0;
	
	//Update list and badges;
	$('#all-bdg').html(chnList.length);
	chnList.map(twitchListCall);
	
	//Filter buttons behavoir;
	filterList();

	return 0;
	
	//Completed;
	function twitchListCall(userName) {
		$('#online, #offline, #dead').html('');
		
		$.ajax({
			type: 'GET',
			url: 'https://api.twitch.tv/kraken/streams/' + userName,
			headers: {
			  'Client-ID': 'ovsm04q883nqngzux4x7tj2yvripcb0'
			},
			crossDomain: true,
		}).done(toList).fail(function() {
			$('#off-bdg').html(++off);
			chnData.push({"status": "The account is closed or never existed.", "game": "No account."});
			$('#dead').append('<li id="'+ (id) + '">' + userName + '<span class="label label-default">&times;</span></li>');
			$('#'+ id).click(showcaseEvent);
			id++;
		});

		function toList(data) {
			console.log(userName);
			switch(data["stream"]) {
				case null:
					$('#off-bdg').html(++off);
					
					$.ajax({
						type: 'GET',
						url: 'https://api.twitch.tv/kraken/users/' + userName,
						headers: {
						  'Client-ID': 'ovsm04q883nqngzux4x7tj2yvripcb0'
						},
						crossDomain: true,
					}).done(offlineList);
					
					break;	
				default:
					var user = data["stream"]["channel"];
					chnData.push(user);
					$('#on-bdg').html(++on);
					$('#online').append('<li id="'+ (id) + '"><img src="' + user.logo + '">&nbsp;' + user.display_name + '&nbsp;|&nbsp;' + user.game + '<span class="label label-success">on</span></li>');
					$('#'+ id).click(showcaseEvent);
					id++;
			}
			
			return 0;
		}
		
		function offlineList(user) {
			chnData.push(user);
			$('#offline').append('<li id="'+ (id) + '"><img src="' + user.logo + '">&nbsp;' + user.display_name + '<span class="label label-danger">off</span></li>');
			$('#'+ id).click(showcaseEvent);
			id++;
			
			return 0;
		}
		
		return 0;
	}

	//Completed;
	function showcaseEvent() {
		var data = chnData[$(this).attr('id')];
		if(screen.width < 768) {
			switch($(this).offsetParent().attr('id')) {
				case 'online':
					window.open(data['url']);
					break;
				case 'offline':
					window.open('http://www.twitch.tv/' + data['name']);
					break;
			}
			return 0;
		}
		else {
			animShowcase();
			$('.stream-list li').css({'background': '#FFF', 'color': '#6441A4'});
			$(this).css({'background': '#6441A4', 'color': '#FFF'});
			switch($(this).offsetParent().attr('id')) {
				case 'online':
					$('#chn-titl').text(data['game']);
					$('.showcase').css('background-image', "url(" + data['video_banner'] + ")");
					$('#to-chn').removeClass('disabled');
					$('#description').text(data['status']);
					$('#to-chn').attr('href', data['url']);
					$('#status').text('streaming now.');
					$('#info').text(data['updated_at'].replace(/[A-Z]/g, ' ').slice(0,-4));
					break;
				case 'offline':
					$('.showcase').css('background-image', 'url("https://alf3run.github.io/ON.twitch/img/twitch_logo_animation.gif")');
					$('#chn-titl').text(data['display_name']);
					$('#to-chn').removeClass('disabled');
					$('#description').text(data['bio']);
					$('#to-chn').attr('href', 'http://www.twitch.tv/' + data['name']);
					$('#status').text('offline.');
					$('#info').text(data['updated_at'].replace(/[A-Z]/g, ' ').slice(0,-4));
					break;
				case 'dead':
					$('.showcase').css('background-image', 'initial');
					$('#chn-titl').text(data['game']);
					$('#description').text(data['status']);
					$('#to-chn').addClass('disabled');
					$('#status').text('');
					$('#info').text('');
					break;
			}
			
			return 0;
		}
	}
});

//Completed;
function filterList() {
	$('#btn-all').click(function() {
		$('.btn-twitch').removeClass('active');
		$(this).addClass('active');
		$('#online, #offline, #dead').show();
	});
	$('#btn-on').click(function() {
		$('.btn-twitch').removeClass('active');
		$(this).addClass('active');
		$('#online').show();
		$('#offline, #dead').hide();
	});
	$('#btn-off').click(function() {
		$('.btn-twitch').removeClass('active');
		$(this).addClass('active');
		$('#offline, #dead').show();
		$('#online').hide();
	});
}

//Completed;
function animShowcase() {
	var show = $('.showcase-txt');
	if(show.css('visibility') === 'hidden') {
		show.css('visibility', 'visible');
		show.addClass('animated slideInUp');
	}
	else {
		
		//For some reasones jquery add the class before removing it so the animation doesn't happen. setTimeout prevent this behavoir.
		show.removeClass('animated slideInUp');
		setTimeout(function() {
			show.addClass('animated slideInUp');
			return 0;
		}, 0);
	}
	
	return 0;
}
