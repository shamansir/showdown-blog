rm -Rf ./swblog-js.zip
find ./ -name '*~' -exec rm '{}' \; -print -or -name ".*~" -exec rm {} \; -print
zip -r \
./swblog-js.zip \
./index.html \
./prefs.xml \
./posts.xml \
./js/fdate.min.js \
./js/jquery-1.4.3.min.js \
./js/showdown.min.js \
./js/showdown-gui.js \
./js/swblog.min.js \
./js/sh_main.min.js \
./js/sh_*.min.js \
./css \
./_docs \
./_licenses \
./posts \
./create.html \
./makerss.sh \
./rss.xsl
