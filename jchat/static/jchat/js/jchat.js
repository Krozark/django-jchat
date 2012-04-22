
var img_dir = "/static/jchat/img/";

var JspAPI ='';
var run = false;

function chat_bind() {
    JspAPI = $('#chatLineHolder').jScrollPane({
                verticalDragMinHeight: 12,
                verticalDragMaxHeight: 12
            }).data('jsp');
    $('#chatText').focus();

    $("#submitForm").submit( function () {
        $.ajax({
            data: {'message' : $('#chatText').val()},
            dataType: 'json',
            type: 'post',
            url: '/jchat/send/'
        });
        $('#chatText').val('');
        return false;
	});
};

function renderLine(m){
    msg = '';
    switch (m.type)
    {
        case 's':
            msg = '<div class="system">' + replace_emoticons(m.message) + '</div>';
            break;
        case 'm':
            msg = '<span class="author">'+m.author+':</span>'+
                  '<div class="text">'+ replace_emoticons(m.message) + '</div>'
            break;
        case 'j':
            msg = '<div class="join">'+m.author+' has joined</div>';
            break;
        case 'l':
            msg = '<div class="leave">'+m.author+' has left</div>';
            break;
    }
    if (msg !=''){
    da = new Date()
    d = da.getDate()
    if (d < 10)
    	d="0"+d;
    mo = da.getMonth()+1
    if (mo < 10)
    	mo = "0"+mo
    y = da.getFullYear()
    sp = m.timestamp.split(' ')
    console.log(y+"-"+mo+"-"+d)
    if (y+"-"+mo+"-"+d == sp[0])
    	sp = sp[1]
    else
    	sp = mo+"-"+d+" "+sp[1]
     msg = '<div class="chat chat-'+m.id+' rounded">'+
                msg+
                '<span class="time">'+sp+'</span>'+
            '</div>';
     JspAPI.getContentPane().append(msg);
    }else{
        return '';
    }
};

function get_messages() {
    $.ajax({
        type: 'POST',
        data: '',
        url:  '/jchat/receive/',
		dataType: 'json',
		success: function (json) {
                $.each(json, function(i,m){
                    renderLine(m);

                JspAPI.reinitialise();
                $('#chatLineHolder').css('width','100%'); // a cause d'un bug de taille qui change tout seul
                JspAPI.scrollToBottom(true);
			})
		}        
    });
    if (run == true)
        setTimeout("get_messages()", 2000);
}

/**
 * Tells the chat app that we are joining
 */
function chat_join() {
	$.ajax({
		async: false,
        type: 'POST',
        data: '',
        url:'/jchat/join/',
        success : function(json){
            run = true;
            setTimeout("get_messages()", 2000);
        },
        error : function(){
        	location.reload();
        	/*chat_leave();
        	chat_join();*/
        }
    });
}

/**
 * Tells the chat app that we are leaving
 */
function chat_leave() {
	$.ajax({
		async: false,
        type: 'POST',
        data: '',
        url:'/jchat/leave/',
        success : function(){
            run = false;
            setTimeout("get_messages()", 0);
        }
    });
}

// attach join and leave events
$(window).load(function(){chat_join()});
$(window).unload(function(){chat_leave()});

// emoticons
var emoticons = {                 
    ':PO:' : 'PO.png',
    ':PA:' : 'PA.png',
    ':PC:' : 'PC.png',
	'XD': 'emoticon_evilgrin.png',
	':D': 'emoticon_grin.png',
	'=D': 'emoticon_happy.png',
	':\\)': 'emoticon_smile.png',
	':O': 'emoticon_surprised.png',
	':P': 'emoticon_tongue.png',
	':\\(': 'emoticon_unhappy.png',
	':3': 'emoticon_waii.png',
	";\\)": 'emoticon_wink.png',
	':ball:': 'sport_soccer.png',
    ':faq:': 'faq.gif',
    ':google:': 'google.gif',
    ':bug:' : 'bug.gif',
    ':yaisse:' : 'yaisse.gif',
    ':recherche:' : 'rechercher.png',
    ':sword:' : 'sword.png',
    ':bow:' : 'bow.png',
    ':shield:' : 'shield.png',
    ':potion:' : 'potion.png',
    ':key:' : 'key.png',
    ':gift:' : 'gift.png',
    ':bag:' : 'bag.png',
    ':lettre:' : 'lettre.png',
    ':axe:' : 'axe.png',
    ':rod:' : 'rod.png',
    ':gold:' : 'gold.png',
    ':fish:' : 'fish.png',
    ':lantern:' : 'lantern.png',
    ':mushroom:' :'mushroom.png',
    ':egg:' : 'egg.png',
    ':grappe:' :'grappe.png',
    ':apple:' : 'apple.png',
    ':bread:' : 'bread.png',
    ':cheese:' : 'cheese.png'
}

/**
 * Regular expression maddness!!!
 * Replace the above strings for their img counterpart
 */
function replace_emoticons(text) {
	$.each(emoticons, function(ch, img) {
		re = new RegExp(ch,'g');
		// replace the following at will
		text = text.replace(re, '<img src="'+img_dir+img+'" />');
	});
	return text;
}
