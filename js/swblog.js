function renderPost(target, xml) {
    target.text(xml.find('content').text());
}

$(document).ready(function(){

    var urlQ = window.location.href;
    var postId = (urlQ.indexOf('?') >= 0) ?
                 urlQ.substring(urlQ.indexOf('?') + 1)
                 : "";
                 
    if ((postId.length > 0) && 
        postId.match(/^[\w\d-]+/)) {
    
        $.ajax({
            type: "GET",
	        url: "posts/" + postId + ".xml",
	        dataType: "xml",
	        success: function(xml) {
	            var target = $('<div>');
	            $('body #posts').append(target);
                renderPost(target, $(xml));
	        }
        });
        
    } else {
        
        $.ajax({
            type: "GET",
	        url: "posts.xml",
	        dataType: "xml",
	        success: function(xml) {
                $(xml).find('posts').find('post').each(function() {
                    console.log($(this).text());
                });
	        }
        });        
            
    }
    
});
