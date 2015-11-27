function makeDynamicTable(rowNames,columnNames,cellWidth,cellHeight,tableX,tableY) {
    gridColor = new algo.Color({ red: 0x78/255.0, green: 0x92/255.0, blue: 0xB2/255.0, alpha: 1})
    clearColor = new algo.Color({ red: 0.5, green: 0.5, blue: 1, alpha: 0})
    fontSize = 12
    
    var columnGrid = new algo.render.ElementGroup();
    var rowGrid = new algo.render.ElementGroup();
    var grid = new algo.render.ElementGroup();
    var rows = rowNames.length
    var columns = columnNames.length
    
    tableColumnTitleHeight = cellHeight/3
    tableRowTitleWidth = cellWidth*0.7
    for(i = 0; i < rows; i++ ) {
        rowGrid.add(new algo.render.Rectangle({
            x: tableX,
            y: tableY + tableColumnTitleHeight + i * cellHeight,
            w: cellWidth,
            h: cellHeight,
            stroke: clearColor,
            fill: clearColor,
            text: rowNames[i],
            textAlign:"left",
            fontSize: fontSize
        }));
    }
    for(j = 0; j < columns; j++ ) {
        columnGrid.add(new algo.render.Rectangle({
            x: tableX + tableRowTitleWidth + j * cellWidth,
            y: tableY,
            w: cellWidth,
            h: tableColumnTitleHeight,
            stroke: clearColor,
            fill: clearColor,
            text: columnNames[j],
            fontSize: fontSize
        }));
    }
    for(i = 0; i < rows; i++ ) {
        for(j = 0; j < columns; j++ ) {
        grid.add(new algo.render.Rectangle({
            x: tableX + tableRowTitleWidth + j * cellWidth,
            y: tableY + tableColumnTitleHeight + i * cellHeight,
            w: cellWidth,
            h: cellHeight,
            stroke: gridColor,
            fill: clearColor,
            text: "row: "+i+" col: "+j+"very long text for line warp",//"multiline\n/line2\n/line3",
            fontSize: fontSize
        }));
        }
    }
    return grid
}

function* algorithm() {
    var rowNames = ["a","ab","abd","abde","abdez"]
    var columnNames = ["a","ab","abc","abcd","abcde","abcdef"]
    cellWidth = 110;
    cellHeight = 50;
    tableX = 10
    tableY = 0
    var grid = makeDynamicTable(rowNames,columnNames,cellWidth,cellHeight,tableX,tableY)
    for(i = 0; i < rowNames.length*columnNames.length; i += 1) {
        grid.elements[i].set({
            text: "new"
        });
        yield({step:"change text"});
    }
}