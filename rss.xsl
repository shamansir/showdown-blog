<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" version="1.0"> 
    <xsl:output method="xml" indent="yes" omit-xml-declaration="no" version="1.0" standalone="yes" />
    <xsl:template match="/">
        <rss version="2.0">
            <channel>
                <xsl:variable name="prefs" select="document('prefs.xml')" />
                <xsl:variable name="link" select="$prefs/options/link" />                
                <title><xsl:value-of select="$prefs/options/title"/></title>
                <link><xsl:value-of select="$link"/></link>
                <description><xsl:value-of select="$prefs/options/description"/></description>               
                <xsl:for-each select="document('posts.xml')/posts/post">
                    <item>
                         
                         <xsl:variable name="postId" select="." />                    
                         <xsl:variable name="post" select="document(concat('posts/', $postId, '.xml'))" />
                         <title><xsl:value-of select="$post/post/title" /></title>
                         <link><xsl:value-of select="concat($link, '?', $postId)" /></link>
                         <description><p style="white-space: pre;"><xsl:value-of select="$post/post/content" /></p></description>
                         <category><xsl:value-of select="$post/post/tags" /></category>
		                 <guid><xsl:value-of select="$postId" /></guid>
		                 <pubDate><xsl:value-of select="$post/post/datetime" /></pubDate>
                    </item>
                </xsl:for-each>
            </channel>
       </rss> 
   </xsl:template>
             
</xsl:stylesheet> 
