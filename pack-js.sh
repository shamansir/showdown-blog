rm -Rf ./swblog-js.zip
find ./ -name '*~' -exec rm '{}' \; -print -or -name ".*~" -exec rm {} \; -print
zip -r \
./swblog-js.zip \
./index.html \
./prefs.xml \
./posts.xml \
./posts \
./_sb/js/fdate.min.js \
./_sb/js/jquery-1.4.3.min.js \
./_sb/js/showdown.min.js \
./_sb/js/showdown-gui.js \
./_sb/js/swblog.min.js \
./_sb/js/sh_main.min.js \
./_sb/js/sh_lang/sh_*.min.js \
./_sb/css \
./_sb/_docs \
./_sb/_licenses \
./_sb/bonus \
./_sb/create.html \
./_sb/makerss.sh \
./_sb/rss.xsl
