(function() {
  var PDFGradient, PDFLinearGradient, PDFRadialGradient;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PDFGradient = (function() {

    function PDFGradient(doc) {
      this.doc = doc;
      this.stops = [];
      this.embedded = false;
    }

    PDFGradient.prototype.stop = function(pos, color, opacity) {
      if (opacity == null) opacity = 1;
      opacity = Math.max(0, Math.min(1, opacity));
      this.stops.push([pos, this.doc._normalizeColor(color), opacity]);
      return this;
    };

    PDFGradient.prototype.embed = function() {
      var bounds, encode, fn, form, grad, group, gstate, i, id, name, pattern, sMask, stop, stops, _i, _len, _ref, _ref2;
      if (this.embedded) return;
      this.embedded = true;
      bounds = [];
      encode = [];
      stops = [];
      for (i = 0, _ref = this.stops.length - 1; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        encode.push(0, 1);
        if (i + 2 !== this.stops.length) bounds.push(this.stops[i + 1][0]);
        fn = this.doc.ref({
          FunctionType: 2,
          Domain: [0, 1],
          C0: this.stops[i + 0][1],
          C1: this.stops[i + 1][1],
          N: 1
        });
        stops.push(fn);
      }
      if (stops.length === 1) {
        fn = stops[0];
      } else {
        fn = this.doc.ref({
          FunctionType: 3,
          Domain: [0, 1],
          Functions: stops,
          Bounds: bounds,
          Encode: encode
        });
      }
      this.id = 'Sh' + (++this.doc._gradCount);
      pattern = this.doc.ref({
        Type: 'Pattern',
        PatternType: 2,
        Shading: this.shader(fn),
        Matrix: [1, 0, 0, -1, 0, this.doc.page.height]
      });
      this.doc.page.patterns[this.id] = pattern;
      if (this.stops.some(function(stop) {
        return stop[2] < 1;
      })) {
        grad = this.opacityGradient();
        _ref2 = this.stops;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          stop = _ref2[_i];
          grad.stop(stop[0], [stop[2]]);
        }
        grad = grad.embed();
        grad.data.Shading.data.ColorSpace = 'DeviceGray';
        group = this.doc.ref({
          Type: 'Group',
          S: 'Transparency',
          CS: 'DeviceGray'
        });
        form = this.doc.ref({
          Type: 'XObject',
          Subtype: 'Form',
          FormType: 1,
          BBox: [0, 0, 100, 100],
          Group: group,
          Resources: this.doc.ref({
            ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
            Pattern: {
              Sh1: grad
            }
          })
        });
        form.add('q');
        form.add('0.5 g');
        form.add("0 0 100 100 re");
        form.add('f');
        form.add('Q');
        sMask = this.doc.ref({
          Type: 'Mask',
          S: 'Alpha',
          BC: [0],
          G: form
        });
        gstate = this.doc.ref({
          Type: 'ExtGState',
          SMask: sMask
        });
        id = ++this.doc._opacityCount;
        name = "Gs" + id;
        this.doc.page.ext_gstates[name] = gstate;
        this.doc.addContent("/" + name + " gs");
      }
      return pattern;
    };

    return PDFGradient;

  })();

  PDFLinearGradient = (function() {

    __extends(PDFLinearGradient, PDFGradient);

    function PDFLinearGradient(doc, x1, y1, x2, y2) {
      this.doc = doc;
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      PDFLinearGradient.__super__.constructor.apply(this, arguments);
    }

    PDFLinearGradient.prototype.shader = function(fn) {
      return this.doc.ref({
        ShadingType: 2,
        ColorSpace: 'DeviceRGB',
        Coords: [this.x1, this.y1, this.x2, this.y2],
        Function: fn,
        Extend: [true, true]
      });
    };

    PDFLinearGradient.prototype.opacityGradient = function() {
      return new PDFLinearGradient(this.doc, this.x1, this.y1, this.x2, this.y2);
    };

    return PDFLinearGradient;

  })();

  PDFRadialGradient = (function() {

    __extends(PDFRadialGradient, PDFGradient);

    function PDFRadialGradient(doc, x1, y1, r1, x2, y2, r2) {
      this.doc = doc;
      this.x1 = x1;
      this.y1 = y1;
      this.r1 = r1;
      this.x2 = x2;
      this.y2 = y2;
      this.r2 = r2;
      PDFRadialGradient.__super__.constructor.apply(this, arguments);
    }

    PDFRadialGradient.prototype.shader = function(fn) {
      return this.doc.ref({
        ShadingType: 3,
        ColorSpace: 'DeviceRGB',
        Coords: [this.x1, this.y1, this.r1, this.x2, this.y2, this.r2],
        Function: fn,
        Extend: [true, true]
      });
    };

    PDFRadialGradient.prototype.opacityGradient = function() {
      return new PDFRadialGradient(this.doc, this.x1, this.y1, this.r1, this.x2, this.y2, this.r2);
    };

    return PDFRadialGradient;

  })();

  module.exports = {
    PDFGradient: PDFGradient,
    PDFLinearGradient: PDFLinearGradient,
    PDFRadialGradient: PDFRadialGradient
  };

}).call(this);
