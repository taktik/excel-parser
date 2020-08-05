import { PolymerElement } from "@polymer/polymer";
import "../js-xlsx/dist/xlsx.core.min.js";

class ExcelParser extends PolymerElement {
  static get is() {
    return "excel-parser";
  }

  static get properties() {
    return {
      file: Object,
      lastParsed: {
        type: Array,
        notify: true,
        observer: "_lastParsedChanged",
      },
      camelCase: {
        type: Boolean,
        value: true,
      },
      keepKeys: {
        type: Array,
        value: function () {
          return [];
        },
        observer: "keepKeysChanged",
      },
      headers: Object,
    };
  }

  static get observers() {
    return [
      // Observer method name, followed by a list of dependencies, in parenthesis
      "_selectedItemsChanged(selectedItems.*)",
    ];
  }

  keepKeysChanged(keys) {
    this.set("columns", keys);
  }

  _selectedItemsChanged() {
    if (this.selectedItems.length > 0) {
      this.set("confirmButtonDisabled", false);
    } else {
      this.set("confirmButtonDisabled", true);
    }
  }

  _inputChanged(e) {
    this.set("file", e.target.files[0]);
    this.parseFile();
  }

  _lastParsedChanged(list) {
    console.log("Parsed the following items :");
    console.log(list);
  }

  _resetFile() {
    this.$.inputForm.reset();
  }

  parseFile() {
    return new Promise(
      function (resolve, reject) {
        var reader = new FileReader();
        this.set("lastParsedFile", this.file.name);
        reader.onload = function (e) {
          var data = reader.result;
          var workBook = XLSX.read(data, { type: "binary" });
          var list = this._toJson(workBook);
          if (this.keepKeys.length === 0) {
            this.set("columns", this._getColumns(list));
          } else {
            list = this._filterKeys(list);
          }
          this.set("lastParsed", list);
          resolve(list);
        }.bind(this);
        reader.readAsBinaryString(this.file);
      }.bind(this)
    ).then(function (lastParsed) {
      return lastParsed;
    });
  }

  _toJson(workBook) {
    if (workBook.SheetNames.length > 0) {
      var list = XLSX.utils.sheet_to_json(
        workBook.Sheets[workBook.SheetNames[0]]
      );
      return list.map(this._mapColumns.bind(this));
    } else {
      return [];
    }
  }

  _mapColumns(obj) {
    var res = {};
    Object.keys(obj).forEach(
      function (key) {
        var parts = key.split("_");
        if (parts.length > 1) {
          var newKey = this._toCamelCase(
            parts.slice(0, parts.length - 1).join(" ")
          );
          res[newKey] = res[newKey] || {};
          res[newKey][parts[parts.length - 1]] = obj[key];
        } else {
          var newKey = this._toCamelCase(key);
          res[newKey] = obj[key];
        }
      }.bind(this)
    );
    return res;
  }

  _toCamelCase(s) {
    if (!this.camelCase) {
      return s;
    }

    var parts = s.replace(/\s+/g, " ").split(" ");
    if (parts.length > 1) {
      parts[0] = this._uncapitalize(parts[0]);
      for (var i = 1; i < parts.length; i++) {
        parts[i] = this._capitalize(parts[i]);
      }
      return parts.join("");
    } else {
      return this._uncapitalize(s);
    }
  }

  _capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  _uncapitalize(s) {
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  _getColumns(list) {
    var res = {};
    list.forEach(function (obj) {
      Object.keys(obj).forEach(function (key) {
        res[key] = 0;
      });
    });
    return Object.keys(res);
  }

  _filterKeys(list) {
    var keys = this.keepKeys;
    return list.map(function (obj) {
      var res = {};
      keys.forEach(function (key) {
        if (key in obj) {
          res[key] = obj[key];
        }
      });
      return res;
    });
  }

  _getString(column, item) {
    var cellContent = this.get(column, item);
    if (typeof cellContent === "object") {
      return JSON.stringify(cellContent);
    } else {
      return cellContent;
    }
  }

  openFileInput() {
    this.$.fileInput.click();
  }
}

customElements.define("excel-parser", ExcelParser);
