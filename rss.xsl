<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" version="1.0"> 
    <xsl:output method="xml" indent="yes" omit-xml-declaration="no" version="2.0" standalone="yes" />
    <xsl:template match="/">
        <rss version="2.0">
            <channel>
                <title>My RSS title</title>
                <link>hoohoo</link>
                <description>
                    My funny blog
                </description>               
                <item>
                    <title>Test</title>
                    <link>http://my.link</link>
                    <description>Item description</description>
		            <guid>unique-test</guid>
		            <pubDate>Mon, 06 Sep 2009 16:45:00 +0000</pubDate>
                </item>                
            </channel>
       </rss> 
   </xsl:template>
             
</xsl:stylesheet> 
