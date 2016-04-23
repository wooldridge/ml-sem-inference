<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">

    <xsl:param name="title" select="translate(book/title, ' ', '_')"/>

    <envelope>

      <metadata>

        <sem:triples xmlns:sem="http://marklogic.com/semantics">

          <xsl:for-each select="book/* [local-name() != 'title']">
            <sem:triple>
              <sem:subject><xsl:value-of select="$title"/></sem:subject>
              <sem:predicate><xsl:value-of select="local-name()"/></sem:predicate>
              <sem:object><xsl:value-of select="translate(./text(), ' ', '_')"/></sem:object>
            </sem:triple>
          </xsl:for-each>

        </sem:triples>

      </metadata>

      <source>

        <xsl:copy-of select="node()"/>

      </source>

    </envelope>

  </xsl:template>

</xsl:stylesheet>
