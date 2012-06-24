(function() {
  var WORD_RE;

  WORD_RE = /([^ ,\/!.?:;\-\n]+[ ,\/!.?:;\-]*)|\n/g;

  module.exports = {
    initText: function() {
      this.x = 0;
      this.y = 0;
      this._lineGap = 0;
      this._textState = {
        mode: 0,
        wordSpacing: 0,
        characterSpacing: 0
      };
      return this._wrapState = {};
    },
    lineGap: function(_lineGap) {
      this._lineGap = _lineGap;
      return this;
    },
    _initOptions: function(x, y, options) {
      var margins, _ref, _ref2, _ref3;
      if (x == null) x = {};
      if (options == null) options = {};
      if (typeof x === 'object') {
        options = x;
        x = null;
      }
      options = (function() {
        var k, opts, v;
        opts = {};
        for (k in options) {
          v = options[k];
          opts[k] = v;
        }
        return opts;
      })();
      if ((x != null) || (y != null)) {
        this.x = x || this.x;
        this.y = y || this.y;
      } else {
        margins = this.page.margins;
        if ((_ref = options.width) == null) {
          options.width = this.page.width - this.x - margins.right;
        }
        if ((_ref2 = options.height) == null) {
          options.height = this.page.height - this.y - margins.bottom;
        }
      }
      options.columns || (options.columns = 1);
      if ((_ref3 = options.columnGap) == null) options.columnGap = 18;
      return options;
    },
    text: function(text, x, y, options) {
      var line, match, matches, paragraphs, _i, _j, _len, _len2;
      if (x == null) x = {};
      if (options == null) options = {};
      options = this._initOptions(x, y, options);
      text = '' + text;
      if (options.wordSpacing) text = text.replace(/\s+/g, ' ');
      paragraphs = text.split('\n');
      if (options.width) {
        this._wrap(paragraphs, options);
      } else {
        for (_i = 0, _len = paragraphs.length; _i < _len; _i++) {
          line = paragraphs[_i];
          this._line(line, options);
        }
      }
      return this;
      if (options.width) {
        this._wrap(text, options);
      } else if ((matches = text.split('\n')).length > 1) {
        for (_j = 0, _len2 = matches.length; _j < _len2; _j++) {
          match = matches[_j];
          this._line(match, options);
        }
      } else {
        this._line(text, options);
      }
      return this;
    },
    moveDown: function(lines) {
      if (lines == null) lines = 1;
      this.y += this.currentLineHeight(true) * lines + this._lineGap;
      return this;
    },
    moveUp: function(lines) {
      if (lines == null) lines = 1;
      this.y -= this.currentLineHeight(true) * lines + this._lineGap;
      return this;
    },
    list: function(array, x, y, options) {
      var i, item, r, _len;
      if (x == null) x = {};
      if (options == null) options = {};
      options = this._initOptions(x, y, options);
      r = ((this._font.ascender / 1000 * this._fontSize) / 3) | 0;
      this.x += r * 6;
      options.listType = 'bullet';
      this._wrap(array, options);
      return;
      for (i = 0, _len = array.length; i < _len; i++) {
        item = array[i];
        this.circle(this.x - r * 5, this.y + r * 2 + 1, r);
        this.text(item, options);
        this.y += options.paragraphGap || 0;
      }
      this.x = x;
      return this.fill();
      /*
              gap = Math.round (@_font.ascender / 1000 * @_fontSize) / 2
              @x = x = ox or @x
              @y = y = oy or @y
      
              for item in array
                  @circle x + 3, @y + gap + 3, 3
                  @text item, x + 15
                  @y += 3
                  
              @x = x
              @fill()
      */
    },
    _line: function(text, options) {
      var lineGap, paragraphGap, wrap;
      wrap = this._wrapState;
      paragraphGap = (wrap.firstLine && this.y !== wrap.startY && options.paragraphGap) || 0;
      lineGap = options.lineGap || this._lineGap || 0;
      this._fragment(text, this.x, this.y + paragraphGap, options);
      return this.y += this.currentLineHeight(true) + lineGap + paragraphGap;
    },
    _fragment: function(text, x, y, options) {
      var align, characterSpacing, i, indent, lineWidth, mode, state, textWidth, wordSpacing, words, wrap, _base, _name, _ref;
      if (options == null) options = {};
      text = '' + text;
      if (text.length === 0) return;
      state = this._textState;
      wrap = this._wrapState;
      align = options.align || 'left';
      indent = (wrap.firstLine && options.indent) || 0;
      wordSpacing = options.wordSpacing || 0;
      characterSpacing = options.characterSpacing || 0;
      if (options.width) {
        lineWidth = wrap.lineWidth - indent - wrap.extraSpace;
        switch (align) {
          case 'right':
            x += lineWidth - this.widthOfString(text);
            break;
          case 'center':
            x += lineWidth / 2 - this.widthOfString(text) / 2;
            break;
          case 'justify':
            if (wrap.lastLine) break;
            words = text.match(WORD_RE);
            if (!words) break;
            textWidth = this.widthOfString(text.replace(/\s+/g, ''));
            wordSpacing = (lineWidth - textWidth) / (words.length - 1) - this.widthOfString(' ');
        }
      }
      x += indent;
      y = this.page.height - y - (this._font.ascender / 1000 * this._fontSize);
      if ((_ref = (_base = this.page.fonts)[_name = this._font.id]) == null) {
        _base[_name] = this._font.ref;
      }
      this._font.use(text);
      text = this._font.encode(text);
      text = ((function() {
        var _ref2, _results;
        _results = [];
        for (i = 0, _ref2 = text.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
          _results.push(text.charCodeAt(i).toString(16));
        }
        return _results;
      })()).join('');
      this.addContent("BT");
      this.addContent("" + x + " " + y + " Td");
      this.addContent("/" + this._font.id + " " + this._fontSize + " Tf");
      mode = options.fill && options.stroke ? 2 : options.stroke ? 1 : 0;
      if (mode !== state.mode) this.addContent("" + mode + " Tr");
      if (wordSpacing !== state.wordSpacing) this.addContent(wordSpacing + ' Tw');
      if (characterSpacing !== state.characterSpacing) {
        this.addContent(characterSpacing + ' Tc');
      }
      this.addContent("<" + text + "> Tj");
      this.addContent("ET");
      state.mode = mode;
      return state.wordSpacing = wordSpacing;
    },
    _wrap: function(paragraphs, options) {
      var buffer, i, indent, len, lineWidth, nextY, spaceLeft, text, w, width, word, wordWidths, words, wrap, _i, _len, _len2, _ref;
      wrap = this._wrapState;
      width = this.widthOfString.bind(this);
      indent = options.indent || 0;
      lineWidth = (options.width - (options.columnGap * (options.columns - 1))) / options.columns;
      wrap.column = 1;
      wrap.startY = this.y;
      wrap.lineWidth = lineWidth;
      wrap.firstLine = true;
      wrap.lastLine = false;
      wrap.maxY = this.y + options.height - this.currentLineHeight();
      for (_i = 0, _len = paragraphs.length; _i < _len; _i++) {
        text = paragraphs[_i];
        wrap.firstLine = true;
        words = text.match(WORD_RE);
        wrap.extraSpace = (options.wordSpacing || 0) * (words.length - 1) + (options.characterSpacing || 0) * (text.length - 1);
        spaceLeft = lineWidth - indent - wrap.extraSpace;
        wordWidths = {};
        len = words.length;
        buffer = '';
        for (i = 0, _len2 = words.length; i < _len2; i++) {
          word = words[i];
          w = (_ref = wordWidths[word]) != null ? _ref : wordWidths[word] = width(word);
          if (w > spaceLeft) {
            this._line(buffer.trim(), options);
            wrap.firstLine = false;
            nextY = this.y + this.currentLineHeight(true);
            if (this.y > wrap.maxY || (wrap.lastLine && nextY > wrap.maxY)) {
              this._nextSection(options);
            }
            spaceLeft = lineWidth - w - wrap.extraSpace;
            buffer = word === '\n' ? '' : word;
          } else {
            spaceLeft -= w;
            buffer += word;
          }
        }
        wrap.lastLine = true;
        this._line(buffer.trim(), options);
      }
      return this._wrapState = {};
    },
    _nextSection: function(options) {
      var wrap;
      wrap = this._wrapState;
      if (++wrap.column > options.columns) {
        this.addPage();
        wrap.column = 1;
        wrap.startY = this.page.margins.top;
        return wrap.maxY = this.page.maxY();
      } else {
        this.x += wrap.lineWidth + options.columnGap;
        return this.y = wrap.startY;
      }
    }
  };

}).call(this);
