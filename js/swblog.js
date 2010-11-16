var _sdconv = new Showdown.converter();
var _sw = {};
_sw.options = null;
_sw.xmlCache = {};
_sw.tagsLevels = {1:'rare',2:'repeated',3:'recent',5:'frequent',7:'common',10:'popular',14:'massive'};

$(document).ready(function(){

    var urlQ = window.location.href;
    var code = (urlQ.indexOf('?') >= 0) ?
                urlQ.substring(urlQ.indexOf('?') + 1)
                : "";
    if (code.indexOf('#') > 0) code = code.substring(0, code.indexOf('#'));
                
    var tagsMode = (code.length > 0) && code.match(/^\*[\w\d,-]+/);
    var singleMode = (code.length > 0) && code.match(/^[\w\d-]+$/);    

    _sw.checkMobile();                 
    _sw.loadOptions();
    _sw.showPostsList(tagsMode || singleMode);
    _sw.showTagsCloud();
                 
    if (singleMode) {            
        _sw.loadPost(code, true);
    } else if (tagsMode) {
        _sw.loadByTags(code);  
    } else {        
        _sw.loadAllPosts();
    }
    
});

_sw.notify = function(text) {
    if (window.console && console) console.log(text);
}

_sw.log = function(text) {
    if (window.console && console) console.log(text);
}

_sw.getXml = function(_url, _success, _complete, _error) {

    var useCache = (!_sw.options || (_sw.options && _sw.options.useXmlCache)); 

    if (useCache && _sw.xmlCache[_url]) {
        _success(_sw.xmlCache[_url]);
        return;
    }

    $.ajax({
        type: "GET",
	    url: _url,
	    dataType: "xml",
	    success: function(xml) { _sw.xmlCache[_url] = xml; _success(xml); },
	    complete: _complete,
	    error: _error
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

_sw.renderPost = function(postId, target, xml, isSingle) {
    if (isSingle) {
        document.title = _sw.options 
                         ? _sw.options.title + " / " + xml.find('title').text()
                         : "Blog / " + xml.find('title').text();
    }

    target.attr('id', 'sw-post-' + postId).addClass('sw-post');
    
    target.append($('<a>').addClass('sw-post-anchor').attr('name', postId));
    
    target.append($('<div>').html(
        _sdconv.makeHtml(xml.find('content').text())
    ).addClass('sw-post-content'));
    
    var dateTime = xml.find('datetime').text();
    if (dateTime.length > 0) {
        target.append($('<div>').html(
            _sw.options 
            ? _sw.formatDatetime(xml.find('datetime').text(),
                                 _sw.options.postedAt,
                                 _sw.options.dateFormat)
            : "Posted at <span class=\"sw-datetime\">" + dateTime + "</span>"
        ).addClass('sw-post-time'));
    }

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

_sw.loadOptions = function() {
    _sw.getXml("./prefs.xml", 
               function(xml) { // success
	                _sw.options = {};
	                var root = $(xml).find('options');
                    _sw.options.title = root.find('title').text();
                    _sw.options.description = root.find('description').text();
                    _sw.options.dateFormat = root.find('date-format').text();
                    _sw.options.postedAt = root.find('posted-at').text();
                    _sw.options.permalinkPrefix = root.find('permalink-prefix').text();
                    _sw.options.anchorPrefix = root.find('anchor-prefix').text();
                    _sw.options.showPostsList = root.find('show-post-lists').text().match(/^true$/);
                    _sw.options.showTagsCloud = root.find('show-tags-cloud').text().match(/^true$/);
                    _sw.options.useXmlCache = root.find('use-xml-cache').text().match(/^true$/);
                    var tLevels = $(xml).find('tags-levels').text();
                    if ((tLevels.length > 0) && tLevels.match(/^[\w\d\s\{\}\:\-\']+$/)) _sw.tagsLevels = eval(tLevels);
	           },
	           function() { // complete
        	        if (_sw.options) _sw.applyOptions();
	           });
}

_sw.applyOptions = function() {
    document.title = _sw.options.title;
    $('header h1 a').text(_sw.options.title);
    $('header p#description').text(_sw.options.description);    
}

_sw.loadAllPosts = function() {
    _sw.getXml("./posts.xml",
               function(xml) { // success
                   $(xml).find('posts').find('post').each(function() {
                       _sw.loadPost($(this).text());
                   });
               }, 
               null, // complete
               function(req, text, error) { // error
	               _sw.notify('posts.xml is not found');
	           });
}

_sw.loadPost = function(postId, isSingle) {
    if (!postId.match(/^[\w\d-]+/)) {
        _sw.notify('post ID \'' + postId + '\' is not ok');
    }

    _sw.getXml("./posts/" + postId + ".xml",
               function(xml) { // success
                   var target = $('<div>');
                   $('body #posts').append(target);
                   _sw.renderPost(postId, target, $(xml), isSingle);
               },
               null, // complete
               function() { // error
                  _sw.notify('failed to load post \'' + postId + '\'');
               });
}

_sw.loadByTags = function(tagsCode) {
    if (!tagsCode.match(/^\*[\w\d,-]+/)) {
        _sw.notify('tags code \'' + tagsCode + '\' is not ok');
    }
    
    document.title = _sw.options 
                     ? _sw.options.title + " / " + tagsCode
                     : "Blog / " + tagsCode;    
    
    _sw.getXml("./posts.xml",
               function(xml) { // success
                    var tagsToLoad = tagsCode.substring(1).split(',');
                    $(xml).find('posts').find('post').each(function() {
                        _sw.loadPostIfHasTags($(this).text(), tagsToLoad);
                    });
               }, 
               null, // complete
               function(req, text, error) { // error
	               _sw.notify('posts.xml is not found');
	           });    
    
}

_sw.addPostLink = function(target, postId, isExternal) {
    if (!postId.match(/^[\w\d-]+/)) {
        _sw.notify('post ID \'' + postId + '\' is not ok');
    }

    _sw.getXml("./posts/" + postId + ".xml",
               function(xml) { // success
                   var postTitle = $(xml).find('post').find('title').text();
                   var postlink = $('<a>').attr('href', isExternal ? ('?' + postId) : ('#' + postId))
                                          .attr('title', (postTitle.length > 0) ? postTitle : postId)
                                          .text((postTitle.length > 0) ? postTitle : postId)
                                          .addClass('sw-posts-list-link');
                   target.append($('<li>').append(postlink));
               });
}

_sw.showPostsList = function(isExternal) {
    if (!_sw.options || (_sw.options && _sw.options.showPostsList)) {
        _sw.getXml("./posts.xml",
                   function(xml) { // success
                       var target = $('<ul>');
                       $('#posts-list').append(target).addClass('sw-posts-list');                   
                       $(xml).find('posts').find('post').each(function() {
                           _sw.addPostLink(target, $(this).text(), isExternal);
                       });
                   }, 
                   null, // complete
                   function(req, text, error) { // error
	                   _sw.notify('posts.xml is not found');
	               });
	} else $('#posts-list').hide();
}

_sw.loadPostIfHasTags = function(postId, tags) {
    if (!postId.match(/^[\w\d-]+/)) {
        _sw.notify('post ID \'' + postId + '\' is not ok');
    }

    _sw.getXml("./posts/" + postId + ".xml",
               function(xml) { // success
                   var postTags = $(xml).find('tags').text().split(',');
                   for (var i = 0; i < tags.length; i++) {
                      for (var j = 0; j < postTags.length; j++) {
                        if ((tags[i] == postTags[j]) && (tags[i].length > 0)) {
                           var target = $('<div>');
                           $('body #posts').append(target);
                           _sw.renderPost(postId, target, $(xml));
                           return;
                        };
                      }
                   }
               },
               null, // complete
               function() { // error
                  _sw.notify('failed to load post \'' + postId + '\'');
               });
}

_sw.pushTagsStats = function(allTags, postId, callback) {
    if (!postId.match(/^[\w\d-]+/)) {
        _sw.notify('post ID \'' + postId + '\' is not ok');
    }

    _sw.getXml("./posts/" + postId + ".xml",
               function(xml) { // success
                   var postTags = $(xml).find('post').find('tags').text().split(',');
                   for (var i = 0; i < postTags.length; i++) {
                       var tag = postTags[i];
                       if (tag.length > 0) {
                           if (allTags[tag]) allTags[tag]++;
                           else allTags[tag] = 1;
                       }
                   }
                   callback();
               },
               null, // complete
               function() { // error
                  _sw.notify('failed to load post \'' + postId + '\'');
               });
}

_sw.showTagsCloud = function() {
    if (!_sw.options || (_sw.options && _sw.options.showTagsCloud)) {
        _sw.getXml("./posts.xml",
                   function(xml) { // success
                       var tags = {}; // { 'a': 5, 'b': 6 }
                       var target = $('<ul>');                       
                       $('#tagcloud').append(target).addClass('sw-tagcloud');
                       var posts = $(xml).find('posts').find('post');
                       var gotPosts = 0;
                       var callback = function() {
                           gotPosts++;
                           if (gotPosts == posts.length) { // got all posts                          
                               for (var tagname in tags) { // add tags links
                                   var taglink = $('<a>').attr('href', '?*' + tagname)
                                                         .attr('title', tagname)
                                                         .text(tagname)
                                                         .addClass('sw-tagcloud-tag')
                                                         .addClass('sw-tagcloud-tag-count-' + tags[tagname])
                                                         .addClass('sw-tagcloud-tag-level-' + _sw.tagLevelByCount(tags[tagname]));
                                   target.append($('<li>').append(taglink));
                               }
                           }
                       }
                       posts.each(function() {
                            _sw.pushTagsStats(tags, $(this).text(), callback);
                       });
                   }, 
                   null, // complete
                   function(req, text, error) { // error
	                   _sw.notify('posts.xml is not found');
	               });
	} else $('#tagcloud').hide();
}

_sw.tagLevelByCount = function(count) {
    if (!_sw.tagsLevels) return 'undefined'; 
    var levelResult = 'default';
    for (var level in _sw.tagsLevels) {
        if (count >= level) levelResult = _sw.tagsLevels[level]; 
    }
    return levelResult;
}

_sw.formatDatetime = function(datetime, descr, dateFormat) {
    if (datetime.length <= 0) return '-';
    var formattedDate = '<span class=\'sw-datetime\'>' + formatDate(new Date(datetime), dateFormat) + '</span>';
    return descr.replace(/%%/g, formattedDate);
}

