# ml-sem-inference

MarkLogic semantic inferencing example

## Requiremens

- MarkLogic
- Node.js

## Setting Up and Running

1. Install dependencies:

   ```npm install```

2. Copy `config_sample.js` to `config.js` and then edit `config.js` for your environment (username, password, etc.).

3. Set up the database, REST interface, transforms, and inference rules. Also load some book-related sample documents and inference triples:

   ```node setup```
   
   The setup step takes the XML documents, puts the original XML content into an `envelope/source` tag, and enriches the documents with triple metadata based on the XML tags. The transformed content is loaded into the MarkLogic database. An example is shown below.

4. Some of the documents classify the book author with a "creator" tag, others with an "author" tag. There's an inference rule that defines "author" as a RDFS subproperty of "creator". 

   Thanks to query-time inferencing, the following script returns all creators (even though the information may have come from an "author" tag):

   ```node predicate creator```

   We're leveraging a built-in RDFS inference property `subPropertyOf.rules` (see `predicate.js`).

5. The books are tagged with genre information. Inference rules associate certain genres as subgenres of broader genres. For example, "science fiction" is a subgenre of "fiction" and "autobiography" is a subgenre of "non-fiction". 
   
   The following script returns all books of the "fiction" or "non-fiction" genres even though the books might not have been explicitly tagged as such:

   ```node genre fiction```
   
   ```node genre non-fiction```
   
   We're leveraging a custom RDFS inference property called `subGenreOf` (in `rules/subGenreOf.rules` and shown below).
   
6. To undo the setup step and start over:

   ```node teardown```
   
## Transformed Document

```
<?xml  version="1.0" encoding="UTF-8"?>
<envelope>
  <metadata>
    <sem:triples xmlns:sem="http://marklogic.com/semantics">
      <sem:triple>
        <sem:subject>Anna_Karenina</sem:subject>
        <sem:predicate>author</sem:predicate>
        <sem:object>Leo_Tolstoy</sem:object>
      </sem:triple>
      <sem:triple>
        <sem:subject>Anna_Karenina</sem:subject>
        <sem:predicate>language</sem:predicate>
        <sem:object>Russian</sem:object>
      </sem:triple>
      <sem:triple>
        <sem:subject>Anna_Karenina</sem:subject>
        <sem:predicate>setting</sem:predicate>
        <sem:object>Saint_Petersburg</sem:object>
      </sem:triple>
      <sem:triple>
        <sem:subject>Anna_Karenina</sem:subject>
        <sem:predicate>genre</sem:predicate>
        <sem:object>realist_novel</sem:object>
      </sem:triple>
      <sem:triple>
        <sem:subject>Anna_Karenina</sem:subject>
        <sem:predicate>date</sem:predicate>
        <sem:object>1877</sem:object>
      </sem:triple>
      <sem:triple>
        <sem:subject>Anna_Karenina</sem:subject>
        <sem:predicate>url</sem:predicate>
        <sem:object>https://en.wikipedia.org/wiki/Anna_Karenina</sem:object>
      </sem:triple>
      <sem:triple>
        <sem:subject>Anna_Karenina</sem:subject>
        <sem:predicate>url</sem:predicate>
        <sem:object>https://www.gutenberg.org/ebooks/1399</sem:object>
      </sem:triple>
    </sem:triples>
  </metadata>
  <source>
    <book>
      <title>Anna Karenina</title>
      <author>Leo Tolstoy</author>
      <language>Russian</language>
      <setting>Saint Petersburg</setting>
      <genre>realist novel</genre>
      <date>1877</date>
      <url>https://en.wikipedia.org/wiki/Anna_Karenina</url>
      <url>https://www.gutenberg.org/ebooks/1399</url>
    </book>
  </source>
</envelope>
```

## Custom Inference Rule

```
tbox {
  ?g1 <subGenreOf> ?g2 .
}

rule "sub genre" construct {
  ?x <genre> ?g2
} {
  ?x <genre> ?g1 .
  ?g1 <subGenreOf> ?g2 .
  filter(?g1!=?g2)
}
```
