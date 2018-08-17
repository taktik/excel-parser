# \<excel-parser\>
## How to install the dependency
Add the dependency to your bower.json
```
"dependencies": {
  "excel-parser": "ssh://git@git.taktik.be/poly/excel-parser.git#^1.0.0"
}
```
## How to use this element
```
<excel-parser
        id="parser"
        last-parsed="{{lastParsed}}"
        keep-keys='["name","channelType","index","multicastUrl"]'></excel-parser>

<script>

</script>
```