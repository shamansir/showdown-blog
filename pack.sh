find ./ -name '*~' -exec rm '{}' \; -print -or -name ".*~" -exec rm {} \; -print
zip -r ./swblog.zip ./index.html ./prefs.xml ./posts.xml ./js ./css ./_docs ./_licenses ./posts ./create.html ./makerss.sh ./rss.xsl
