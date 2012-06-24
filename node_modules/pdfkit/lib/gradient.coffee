class PDFGradient
    constructor: (@doc) ->
        @stops = []
        @embedded = no
        
    stop: (pos, color, opacity = 1) ->
        opacity = Math.max(0, Math.min(1, opacity))
        @stops.push [pos, @doc._normalizeColor(color), opacity]
        return this
        
    embed: ->
        return if @embedded
        @embedded = yes
        
        bounds = []
        encode = []
        stops = []
        
        for i in [0...@stops.length - 1]
            encode.push 0, 1
            unless i + 2 is @stops.length
                bounds.push @stops[i + 1][0]
            
            fn = @doc.ref
                FunctionType: 2
                Domain: [0, 1]
                C0: @stops[i + 0][1]
                C1: @stops[i + 1][1]
                N: 1
                
            stops.push fn
        
        # if there are only two stops, we don't need a stitching function
        if stops.length is 1
            fn = stops[0]
        else
            fn = @doc.ref
                FunctionType: 3 # stitching function
                Domain: [0, 1]
                Functions: stops
                Bounds: bounds
                Encode: encode
                
        @id = 'Sh' + (++@doc._gradCount)

        pattern = @doc.ref
            Type: 'Pattern'
            PatternType: 2
            Shading: @shader fn
            Matrix: [1, 0, 0, -1, 0, @doc.page.height] # flip the coordinate system

        @doc.page.patterns[@id] = pattern
        
        if (@stops.some (stop) -> stop[2] < 1)
            grad = @opacityGradient()
            for stop in @stops
                grad.stop stop[0], [stop[2]]
                
            grad = grad.embed()
            grad.data.Shading.data.ColorSpace = 'DeviceGray'
                            
            group = @doc.ref
                Type: 'Group'
                S: 'Transparency'
                CS: 'DeviceGray'
            
            form = @doc.ref
                Type: 'XObject'
                Subtype: 'Form'
                FormType: 1
                BBox: [0, 0, 100, 100]
                Group: group
                Resources: @doc.ref
                    ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI']
                    # ExtGState:
                    #     G1:
                    #         Type: 'ExtGState'
                    #         ca: 0.5
                    Pattern:
                        Sh1: grad
            
            form.add 'q'
            form.add '0.5 g'
            form.add "0 0 100 100 re"
            # form.add "W* n"
            # form.add "/Pattern cs"
            # form.add "/Sh1 scn"
            # form.add "/G1 gs"
            form.add 'f'
            # form.add "/Sh1 sh"
            form.add 'Q'
            
            sMask = @doc.ref
                Type: 'Mask'
                S: 'Alpha'
                BC: [0]
                G: form
                
            gstate = @doc.ref
                Type: 'ExtGState'
                SMask: sMask
            
            id = ++@doc._opacityCount
            name = "Gs#{id}"   
            @doc.page.ext_gstates[name] = gstate
            @doc.addContent "/#{name} gs"
                
        return pattern
        
class PDFLinearGradient extends PDFGradient
    constructor: (@doc, @x1, @y1, @x2, @y2) ->
        super
        
    shader: (fn) ->
        @doc.ref
            ShadingType: 2
            ColorSpace: 'DeviceRGB'
            Coords: [@x1, @y1, @x2, @y2]
            Function: fn
            Extend: [true, true]
            
    opacityGradient: ->
        return new PDFLinearGradient(@doc, @x1, @y1, @x2, @y2)
        
class PDFRadialGradient extends PDFGradient
    constructor: (@doc, @x1, @y1, @r1, @x2, @y2, @r2) ->
        super
        
    shader: (fn) ->
        @doc.ref
            ShadingType: 3
            ColorSpace: 'DeviceRGB'
            Coords: [@x1, @y1, @r1, @x2, @y2, @r2]
            Function: fn
            Extend: [true, true]
            
    opacityGradient: ->
        return new PDFRadialGradient(@doc, @x1, @y1, @r1, @x2, @y2, @r2)
            
module.exports = {PDFGradient, PDFLinearGradient, PDFRadialGradient}