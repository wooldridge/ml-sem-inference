<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">

    <books>

        <xsl:for-each select="books/li[@class='booklink']">
          <book>
            <title><xsl:value-of select="a/span/span[@class='title']"/></title>
            <author><xsl:value-of select="a/span/span[@class='subtitle']"/></author>
            <downloads><xsl:value-of select="a/span/span[@class='extra']"/></downloads>
            <url><xsl:value-of select="a[@class='link']/@href"/></url>
          </book>
        </xsl:for-each>

    </books>

  </xsl:template>

</xsl:stylesheet>
