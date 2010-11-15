var _sdconv = new Showdown.converter();
var _sw = {};
_sw.options = null;

$(document).ready(function(){

    var urlQ = window.location.href;
    var code = (urlQ.indexOf('?') >= 0) ?
                 urlQ.substring(urlQ.indexOf('?') + 1)
                 : "";

    _sw.checkMobile();                 
    _sw.loadOptions();
    _sw.loadPostsList();
    _sw.loadTagsCloud();
                 
    if ((code.length > 0) && 
        code.match(/^[\w\d-]+$/)) {            
        _sw.loadPost(code);
    } else if ((code.length > 0) && 
               code.match(/^\*[\w\d,-]+/)) {
        _sw.loadByTags(code);  
    } else {        
        _sw.loadAllPosts();
    }
    
});

_sw.renderPost = function(postId, target, xml) {
    target.attr('id', 'sw-post-' + postId).addClass('sw-post');
    
    target.append($('<a>').addClass('sw-post-anchor').attr('name', postId));
    
    target.append($('<div>').html(
        _sdconv.makeHtml(xml.find('content').text())
    ).addClass('sw-post-content'));
    
    var dateTime = xml.find('datetime').text();
    target.append($('<div>').html(
        _sw.options 
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
    target.append($('<div>').text(_sw.options ? _sw.options.anchorPrefix : "Anchor: ")
                            .append(anchorlink)
                            .addClass('sw-post-anchorlink'));
    
    var permalink = $('<a>').attr('href', '?' + postId).attr('title', postId).text('&');
    target.append($('<div>').text(_sw.options ? _sw.options.permalinkPrefix : "Permalink: ")
                            .append(permalink)
                            .addClass('sw-post-permalink'));
    
}

_sw.applyOptions = function() {
    
}

_sw.loadOptions = function() {
    $.ajax({
        type: "GET",
	    url: "./prefs.xml",
	    dataType: "xml",
	    success: function(xml) {
	        _sw.options = {};
            _sw.options.title = $(xml).find('title').text();
            _sw.options.description = $(xml).find('description').text();
            _sw.options.timeFormat = $(xml).find('date-format').text();            
            _sw.options.dateFormat = $(xml).find('time-format').text();
            _sw.options.postedAt = $(xml).find('posted-at').text();
            _sw.options.permalinkPrefix = $(xml).find('permalink-prefix').text();
            _sw.options.anchorPrefix = $(xml).find('anchor-prefix').text();
            _sw.options.showPostsList = $(xml).find('show-post-lists').text().match(/^true$/);
            _sw.options.showTagsCloud = $(xml).find('show-tags-cloud').text().match(/^true$/);
	    },
	    complete: function() {
	        if (_sw.options) _sw.applyOptions();
	    }
    });
}

_sw.loadPost = function(postId) {
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
           _sw.renderPost(postId, target, $(xml));
       }
    });
}

_sw.loadByTags = function(tagsCode) {
    if (!tagsCode.match(/^\*[\w\d,-]+/)) {
        alert('tags code \'' + tagsCode + '\' is not ok');
    }

}

_sw.loadAllPosts = function() {
    $.ajax({
        type: "GET",
	    url: "./posts.xml",
	    dataType: "xml",
	    success: function(xml) {
            $(xml).find('posts').find('post').each(function() {
                _sw.loadPost($(this).text());
            });
	    },
	    error: function(req, text, error) {
	        alert('posts.xml is not found');
	    }
    }); 
}

_sw.checkMobile = function() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPod/i)
    ){
        $('body').addClass('sw-mobile');
    }
}

_sw.loadPostsList = function() {
    if (!_sw.options || (_sw.options && _sw.options.showPostsList)) {
        $.ajax({
            type: "GET",
	        url: "./posts.xml",
	        dataType: "xml",
	        success: function(xml) {
	            var i = 0;
                $(xml).find('posts').find('post').each(function() {
                    // TODO:
                });
	        },
	        error: function(req, text, error) {
	            alert('posts.xml is not found');
	        }
        });     
    }
}

_sw.loadTagsCloud = function() {
    if (!_sw.options || (_sw.options && _sw.options.showTagsCloud)) {
        
    }
}

