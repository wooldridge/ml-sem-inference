<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">

    <books>

        <xsl:for-each select="books/li[@class='booklink']">
          <div>
            <div><xsl:value-of select="a/span/span[@class='title']"/></div>
            <div><xsl:value-of select="a/span/span[@class='subtitle']"/></div>
            <div><xsl:value-of select="a/span/span[@class='extra']"/></div>
            <div>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="a[@class='link']/@href"/>
                </xsl:attribute>
                <xsl:value-of select="a/span/span[@class='title']"/>
              </a>
            </div>
          </div>
        </xsl:for-each>

    </books>

  </xsl:template>

</xsl:stylesheet>
