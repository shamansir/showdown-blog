var _sdconv = new Showdown.converter();
var _options = null;

$(document).ready(function(){

    var urlQ = window.location.href;
    var code = (urlQ.indexOf('?') >= 0) ?
                 urlQ.substring(urlQ.indexOf('?') + 1)
                 : "";

    checkMobile();                 
    loadOptions();
                 
    if ((code.length > 0) && 
        code.match(/^[\w\d-]+$/)) {            
        loadPost(code);
    } else if ((code.length > 0) && 
               code.match(/^\*[\w\d,-]+/)) {
        loadByTags(code);  
    } else {        
        loadAllPosts();
    }
    
});

function renderPost(postId, target, xml) {
    target.attr('id', 'sw-post-' + postId).addClass('sw-post');
    
    target.append($('<a>').addClass('sw-post-anchor').attr('name', postId));
    
    target.append($('<div>').html(
        _sdconv.makeHtml(xml.find('content').text())
    ).addClass('sw-post-content'));
    
    var dateTime = xml.find('datetime').text();
    target.append($('<div>').html(
        _options 
        ? "Posted at <span class=\"sw-datetime\">" + dateTime + "</span>"
        : "Posted at <span class=\"sw-datetime\">" + dateTime + "</span>"
    ).addClass('sw-post-time'));

    var tagsBlock = $('<ul>');
    var tags = xml.find('tags').text().split(',');
    for (var tagIdx = 0; tagIdx < tags.length; tagIdx++) {
        var tag = tags[tagIdx];
        if ((tag.length > 0) && tag.match(/^[\w\d-]+/)) {
            var taglink = $('<a>').attr('href', '?*' + tag).attr('title', tag).text(tag);
            tagsBlock.append($('<li>').append(
                             $('<span>').append(taglink).addClass('sw-tag')));
        }
    }
    target.append(tagsBlock.addClass('sw-post-tags'));
    
    var anchorlink = $('<a>').attr('href', '#' + postId).attr('title', postId).text('#');
    target.append($('<div>').text(_options ? _options.anchorPrefix : "Anchor: ")
                            .append(anchorlink)
                            .addClass('sw-post-anchorlink'));
    
    var permalink = $('<a>').attr('href', '?' + postId).attr('title', postId).text('&');
    target.append($('<div>').text(_options ? _options.permalinkPrefix : "Permalink: ")
                            .append(permalink)
                            .addClass('sw-post-permalink'));
    
}

function applyOptions() {
    
}

function loadOptions() {
    $.ajax({
        type: "GET",
	    url: "./prefs.xml",
	    dataType: "xml",
	    success: function(xml) {
	        _options = {};
            _options.title = $(xml).find('title').text();
            _options.description = $(xml).find('description').text();
            _options.timeFormat = $(xml).find('date-format').text();            
            _options.dateFormat = $(xml).find('time-format').text();
            _options.postedAt = $(xml).find('posted-at').text();
            _options.permalinkPrefix = $(xml).find('permalink-prefix').text();
            _options.anchorPrefix = $(xml).find('anchor-prefix').text();
	    },
	    complete: function() {
	        if (_options) applyOptions();
	    }
    });
}

function loadPost(postId) {
    if (!postId.match(/^[\w\d-]+/)) {
        alert('post ID \'' + postId + '\' is not ok');
    }

    $.ajax({
        type: "GET",
        url: "./posts/" + postId + ".xml",
        dataType: "xml",
        success: function(xml) {
           var target = $('<div>');
           $('body #posts').append(target);
           renderPost(postId, target, $(xml));
       }
    });
}

function loadByTags(tagsCode) {
    if (!tagsCode.match(/^\*[\w\d,-]+/)) {
        alert('tags code \'' + tagsCode + '\' is not ok');
    }

}

function loadAllPosts() {
    $.ajax({
        type: "GET",
	    url: "./posts.xml",
	    dataType: "xml",
	    success: function(xml) {
            $(xml).find('posts').find('post').each(function() {
                loadPost($(this).text());
            });
	    },
	    error: function(req, text, error) {
	        alert('posts.xml is not found');
	    }
    });
}

function checkMobile() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPod/i)
    ){
        $('body').addClass('sw-mobile');
    }
}

