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
            text: "",
            fontSize: fontSize
        }));
        }
    }
    return grid
}

function setGridAtRowColumnToText(grid,i,j,numColumns,text,highlightColor) {
    //highlightColor = new algo.Color({ red: 0x78/255.0, green: 0x92/255.0, blue: 0xB2/255.0, alpha: 0.2})
    grid.elements[i*numColumns+j].set({
        fill: highlightColor,
        text: text
    });
}

function unhighlightGrid(grid) {
    grid.set({
        fill: clearColor
    });
}

function getGridTextAtRowColumn(grid,i,j,numColumns,highlightColor) {
    //highlightColor = new algo.Color({ red: 0x78/255.0, green: 0x92/255.0, blue: 0xB2/255.0, alpha: 0.1})
    element = grid.elements[i*numColumns+j];
    element.set({fill:highlightColor})
    return element["text"];
}

function* algorithm() {
    setHighlightColor = new algo.Color({ red: 0x78/255.0, green: 0x92/255.0, blue: 0xB2/255.0, alpha: 0.2})
    getHighlightColor = new algo.Color({ red: 0x78/255.0, green: 0x92/255.0, blue: 0xB2/255.0, alpha: 0.1})
    answerHighlightColor = new algo.Color({ red: 0/255.0, green: 0x76/255.0, blue: 0xFF/255.0, alpha: 0.5})
    var source = "abcdef";
    var target = "azced";
    var columnNames = prefixesForString(source);
    var rowNames = prefixesForString(target);
    rows = rowNames.length;
    columns = columnNames.length;
    cellWidth = 110;
    cellHeight = 50;
    tableX = 10
    tableY = 0
    var grid = makeDynamicTable(rowNames,columnNames,cellWidth,cellHeight,tableX,tableY)
    for(i = 0; i < rows; i++) {
        text = ""+i+" edits from "+columnNames[0] + " → "+rowNames[i]+".";
        setGridAtRowColumnToText(grid,i,0,columns,text,setHighlightColor);
        yield({step:text});
        setGridAtRowColumnToText(grid,i,0,columns,""+i);
        unhighlightGrid(grid);
    }
    for(j = 1; j < columns; j++) {
        text = ""+j+" edits from "+rowNames[0]+" → "+columnNames[j];
        setGridAtRowColumnToText(grid,0,j,columns,text,setHighlightColor);
        yield({step:text})
        setGridAtRowColumnToText(grid,0,j,columns,""+j,setHighlightColor);
        unhighlightGrid(grid);
    }
    for(i = 1; i < rows; i++) {
        for (j = 1; j < columns; j++) {
            if ( source[i] === target[j] ) {
                actualEdits = getGridTextAtRowColumn(grid,i-1,j-1,columns);
                text = "last char same, so "+actualEdits+" edits.";
                setGridAtRowColumnToText(grid,i,j,columns,text,setHighlightColor);
                yield({step:text})
                setGridAtRowColumnToText(grid,i,j,columns,""+actualEdits,setHighlightColor);
                unhighlightGrid(grid);
            } else {
                left = getGridTextAtRowColumn(grid,i,j-1,columns,getHighlightColor);
                upperLeft = getGridTextAtRowColumn(grid,i-1,j-1,columns,getHighlightColor);
                rowAbove = getGridTextAtRowColumn(grid,i-1,j,columns,getHighlightColor);
                actualEdits = 1 + Math.min(left,upperLeft,rowAbove);
                text = "1 + min("+left+","+upperLeft+","+rowAbove+") edits.";
                setGridAtRowColumnToText(grid,i,j,columns,text,setHighlightColor);
                yield({step:text})
                setGridAtRowColumnToText(grid,i,j,columns,""+actualEdits,setHighlightColor);
                unhighlightGrid(grid);
            }
        }
    }
    lastRow = rowNames.length - 1;
    lastColumn = columnNames.length - 1;
    text = ""+getGridTextAtRowColumn(grid,lastRow,lastColumn,columns,getHighlightColor)+" edits from "+source+" → "+target;
    answerHighlight = new algo.Color({ red: 0/255.0, green: 0x76/255.0, blue: 0xFF/255.0, alpha: 0.7});
    setGridAtRowColumnToText(grid,lastRow,lastColumn,columns,text,answerHighlightColor);
    yield({step:text});
}

function prefixesForString(str) {
    var prefixes = [];
    for ( var i = 1; i <= str.length; i++ ) {
        prefixes.push(str.slice(0,i));
    }
    return prefixes;
}