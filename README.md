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
        url="http://127.0.0.1:8080" <!-- Use this or a callback a shown below -->
        last-parsed="{{lastParsed}}"
        keep-keys='["name","type","index"]'></excel-parser>

<script>
this.$.parser.callback = function(selectedItems, successHandle, errorHandle) {
    var processingSucceeded = process(selectedItems);
    if (processingSucceeded) {
        successHandle();
    } else {
        errorHandle();
    }
}
</script>
```