function* algorithm() {
    
    width = 110;
    height = 50;
    rows = 6
    columns = 6
    gridColor = new algo.Color({ red: 0x78/255.0, green: 0x92/255.0, blue: 0xB2/255.0, alpha: 1})
    clearColor = new algo.Color({ red: 0.5, green: 0.5, blue: 1, alpha: 0})
    fontSize = 12
    
    // var box = new algo.layout.Box(width/4, height/4, (columns+2)*width-width/4, (rows+2)*height-height/4);
    // new algo.render.Arrow({
    //     shape: algo.layout.Line.topEdge(box),
    //     startArrow: false,
    //     endArrow: true,
    //     inset: width
    // });
    // new algo.render.Arrow({
    //     shape: algo.layout.Line.leftEdge(box),
    //     startArrow: false,
    //     endArrow: true,
    //     inset: height
    // });
    // var columnTitleBox = new algo.render.Rectangle({
    //     x:width*2,
    //     y:0,
    //     w:width*2,
    //     h:height/4,
    //     stroke:clearColor,
    //     fontSize: fontSize,
    //     text:"column name"
    // })
    
    var columnGrid = new algo.render.ElementGroup();
    var rowGrid = new algo.render.ElementGroup();
    var grid = new algo.render.ElementGroup();

    tableTitleHeight = height/3
    tableX = width
    tableY = tableTitleHeight
    for(i = 0; i < rows; i++ ) {
        rowGrid.add(new algo.render.Rectangle({
            x: 0,
            y: tableY + i * height,
            w: width,
            h: height,
            stroke: clearColor,
            fill: clearColor,
            text: "row "+i,
            fontSize: fontSize
        }));
    }
    for(j = 0; j < columns; j++ ) {
        columnGrid.add(new algo.render.Rectangle({
            x: tableX + (j * width),
            y: 0,
            w: width,
            h: tableTitleHeight,
            stroke: clearColor,
            fill: clearColor,
            text: "column "+j,
            fontSize: fontSize
        }));
    }
    for(i = 0; i < rows; i++ ) {
        for(j = 0; j < columns; j++ ) {
        grid.add(new algo.render.Rectangle({
            x: tableX + j * width,
            y: tableY + i * height,
            w: width,
            h: height,
            stroke: gridColor,
            fill: clearColor,
            text: "row: "+i+" col: "+j+"very long text for line warp",//"multiline\n/line2\n/line3",
            fontSize: fontSize
        }));
        }
    }
    for(i = 0; i < rows*columns; i += 1) {
        grid.elements[i].set({
            text: "new"
        });
        yield({step:"change text"});
    }
}
