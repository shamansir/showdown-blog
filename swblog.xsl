<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" version="1.0"> 
    <xsl:output method="html" indent="yes" omit-xml-declaration="yes" version="1.0" standalone="yes" />    
    
    <xsl:param name="c" />
    <xsl:param name="p" />
    <xsl:param name="t" />    
    
    <xsl:template match="/">
    
        <xsl:variable name="context-id" select="$c" />
        <xsl:variable name="post-id" select="$p" />
        <xsl:variable name="tags" select="$t" />
        
        <xsl:variable name="root-link" select="./options/link" />
    
        <html>
          <head>
            <title><xsl:value-of select="./options/title" /></title>  
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <script type="text/javascript" src="js/fdate.min.js"></script>    
            <script type="text/javascript" src="js/showdown.min.js"></script>    
            <script type="text/javascript" src="js/swblog.xsl.js"></script>
            <link rel="stylesheet" href="css/swblog.css" type="text/css" />
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <h1><a title="/" href="./b.xml"><xsl:value-of select="./options/title" /></a></h1>    
                <p id="description"><xsl:value-of select="./options/description" /></p>
              </div>
              <div id="posts-list">
                <xsl:call-template name="posts-list">
                    <xsl:with-param name="external-links" select="$post-id" />
                </xsl:call-template>
              </div>      
              <div id="posts">
                 <xsl:call-template name="posts">
                    <xsl:with-param name="post-id" select="$post-id" />
                 </xsl:call-template>
              </div>
              <div id="tagcloud">
                 <xsl:call-template name="tags-cloud" />                
              </div>
              <div id="copyright">
                &#169; 2010 Showdown blog (sandwich) script powered by <a href="http://shamansir.madfire.net">shaman.sir</a>, based on <a href="http://attacklab.net/showdown/" text="Showdown" title="Showdown">Showdown</a>/<a href="http://daringfireball.net/projects/markdown/" text="Markdown" title="Markdown">Markdown</a> and uses <a href="http://jquery.com" title="JQuery" text="JQuery" >JQuery</a>.
              </div>
            </div>
          </body>  
        </html>    
    
    </xsl:template>
    
    <xsl:template name="posts">
        
    </xsl:template>    
    
    <xsl:template name="posts-list">
        
    </xsl:template>
    
    <xsl:template name="tags-cloud">
        
    </xsl:template>    
    
</xsl:stylesheet> 
