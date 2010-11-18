<?xml version="1.0" encoding="utf-8"?>
<!-- ***** BEGIN LICENSE BLOCK *****
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    The Initial Developer of the Original Code is
    Michal Dvorak (mikee2185@gmail.com).
     ***** END LICENSE BLOCK ***** -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes"/>

  <!-- 
  Note: The target stylesheet is read from the processing instruction:
  <?transform-stylesheet href="XSLT URL" ?>
  -->

  <xsl:template match="/">
    <xsl:variable name="stylesheet" select="processing-instruction('transform-stylesheet')" />

    <html>
      <head>
        <script type="text/javascript">
          <xsl:text>window.stylesheetUrl = '</xsl:text>
          <xsl:call-template name="parseAttribute">
            <xsl:with-param name="text" select="$stylesheet" />
            <xsl:with-param name="name">href</xsl:with-param>
          </xsl:call-template>
          <xsl:text>';</xsl:text>
        </script>
        <script type="text/javascript">
          <![CDATA[
          function transform() {
            try {
              var baseUrl = document.location.href.replace(document.location.search, "");
              
              // Validate
              if (baseUrl.length == 0)
                throw new Error("Unable to extract baseUrl.");
              if (window.stylesheetUrl == null || window.stylesheetUrl.length == 0)
                throw new Error("Stylesheet hasn't been specified.");

              // Extract url parameters
              var args = parseParameters(document.location.search);
              
              args["href"] = document.location.href;
              args["baseUrl"] = baseUrl;
              
              // Process
              var html = transformToHtml(baseUrl, window.stylesheetUrl, args);
              
              // Generate new document contents
              // IMPORTANT: Some of the events, like body.onload, aren't executed on Mozilla!!!
              // Don't use them!
              document.open();
              document.writeln(html);    
              document.close();
            }
            catch (ex) {
              document.body.style.color = 'red';
              document.body.appendChild(document.createTextNode("Error occured during dynamic xsl processing:"));
              document.body.appendChild(document.createElement("br"));
              document.body.appendChild(document.createTextNode(ex.message || ex));
            }
          }
          
          function transformToHtml(xmlUrl, xslUrl, args) {
            // Mozilla-like
            if (window.XSLTProcessor != null) {
              var loadDoc = function(url) {
                var req = new XMLHttpRequest();
                req.open("GET", url, false);
                
                req.send(null);
                return req.responseXML;
              };
              
              // Load XSL and XML
              var xsl = loadDoc(xslUrl);
              var xml = loadDoc(xmlUrl);
              
              // Prepare processor
              var processor = new XSLTProcessor();
              processor.importStylesheet(xsl);
              
              for (var name in args) {
                processor.setParameter(null, name, args[name]);
              }
              
              // Process
              var output = processor.transformToDocument(xml);
              
              // Special handling - Hide body
              // Note: Reason for this is that FF showed page content before css was loaded,
              // and therefore some ugly screen flickering occured
              var body = output.documentElement.getElementsByTagName("body")[0];
              body.style.visibility = 'hidden';
              
              // Show body again, after document is loaded
              var show = "document.body.style.visibility = 'visible';";
              body.appendChild(createElement("script", show, {type: "text/javascript"}, output));
              
              // Convert to html
              return "<html>" + output.documentElement.innerHTML + "</html>";
            }
            // IE
            else if (window.ActiveXObject != null) {
              // Helper method
              var loadDoc = function(url, docType) {
                var doc = new ActiveXObject(docType);
                doc.async = false;
                doc.resolveExternals = false;
                doc.load(url);
                return doc;
              };
              
              // Load xml and xsl
              var xsl = loadDoc(xslUrl, "Msxml2.FreeThreadedDOMDocument.3.0");
              var xml = loadDoc(xmlUrl, "Msxml2.DOMDocument.3.0");
            
              // Prepare processor
              var xslt = new ActiveXObject("Msxml2.XSLTemplate.3.0");
              xslt.stylesheet = xsl;
              
              var processor = xslt.createProcessor();
              processor.input = xml;
              
              for (var name in args) {
                processor.addParameter(name, args[name]);
              }
              
              // Process
              processor.transform();

              return processor.output;
            }
            // Error
            else {
              throw new Error("No XSLT processor is available on your system.");
            }
          }
          
          function createElement(tagName, innerHtml, attributes, doc) {
              if (tagName == null)
                  throw new Error("tagName");
          
              if (doc == null) doc = document;
              var e = doc.createElement(tagName);
              
              if (attributes != null) {
                  for (var i in attributes) {
                      e.setAttribute(i, (attributes[i] != null) ? attributes[i] : "");
                  }
              }
              
              if (innerHtml != null) {
                  e.innerHTML = innerHtml;
              }
              
              return e;
          }
          
          function parseParameters(search) {
            // Split them - this is needed beacuse of javascript regexp api limitations
            var pairs = search.match(/[/?&][^=&]+=[^=&]*/g) || [];
            
            var args = {};
            
            // Parse single parameter pairs
            for (var i = 0; i < pairs.length; i++) {
              var m = pairs[i].match(/^[/?&]([^=&]+)=([^=&]*)$/) || [];
              
              args[decodeURI(m[1])] = decodeURI(m[2]);
            }
            
            return args;
          }
          ]]>
        </script>
      </head>
      <body onload="transform();"></body>
    </html>
  </xsl:template>

  <xsl:template name="parseAttribute">
    <xsl:param name="name" />
    <xsl:param name="text" />

    <xsl:variable name="tmp" select="normalize-space($text)" />

    <!-- Starts with href=" -->
    <xsl:if test="starts-with($tmp, concat($name, '=&quot;'))">
      <!-- Ends with quote -->
      <xsl:if test="substring($tmp, string-length($tmp), 1) = '&quot;'">
        <xsl:value-of select="substring($tmp, 7, string-length($tmp) - 7)" />
      </xsl:if>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
