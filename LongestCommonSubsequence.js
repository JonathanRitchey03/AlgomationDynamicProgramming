function* algorithm() {
    setHighlightColor = new algo.Color({ red: 0x55/255.0, green: 0xAA/255.0, blue: 0x55/255.0, alpha: 0.2})
    getHighlightColor = new algo.Color({ red: 0x44/255.0, green: 0x92/255.0, blue: 0xCC/255.0, alpha: 0.2})
    answerHighlightColor = new algo.Color({ red: 0x66/255.0, green: 0xAA/255.0, blue: 0x66/255.0, alpha: 0.4})
    //new algo.Color({ red: 0/255.0, green: 0x76/255.0, blue: 0xFF/255.0, alpha: 0.4})
    var source = "abcdef";
    var target = "badef";
    var columnNames = prefixesForString(source);
    var rowNames = prefixesForString(target);
    rows = rowNames.length;
    columns = columnNames.length;
    cellWidth = 110;
    cellHeight = 55;
    tableX = 10;
    tableY = 0;
    codeX = 100;
    codeTableWidth = 400;
    evalCodeX = codeX + codeTableWidth
    evalTableWidth = 100
    codeY = (rows + 1) * cellHeight + tableY;
    codeLines = [   "1  // setup obvious lcs", //0
                    "2  for r in 0...rows:", //1
                    "3      T[r][0] = 0", //2
                    "4  for c in 1...cols:", //3
                    "5      T[0][c] = 0", //4
                    "6  // use recurrence for remaining cells", //5
                    "7  for r in 1...rows:", //6
                    "8      for c in 1...columns:", //7
                    "9          // target, source same last char", //8
                    "10         if target[r] == source[c]:", //9
                    "11             T[r][c] = 1 + cell[r-1][c-1]", //10
                    "12         // lcs = 1 + max(left,rowAbove)", //11
                    "13         else:",//12
                    "14             T[r][c] = max(T[r][c-1],T[r-1][c])",//13
                    "15 return T[rows][cols] // answer in bottom-right"//14
                ]
    var codeGrid = makeCodeGrid(10,codeTableWidth,codeX,codeY);
    replaceCodeLinesInGrid(codeGrid,codeLines,0,2);
    var evalGrid = makeCodeGrid(10,evalTableWidth,evalCodeX,codeY);
    evalLines = [   "", //0
                    "0..."+rows+":", //1
                    "T[r][0] = r", //2
                    "1..."+columns+":", //3
                    "T[0][c] = c", //4
                    "", //5
                    "1..."+rows+":", //6
                    "1..."+columns+":", //7
                    "", //8
                    "target[r] == source[c]:", //9
                    "T[r][c] = cell[r-1][c-1]", //10
                    "", //11
                    "",//12
                    "T[r][c] = max(T[r][c-1],T[r-1][c])",//13
                    "return T["+(rows)+"]["+(columns)+"]"//14
                ]
    replaceCodeLinesInGrid(evalGrid,evalLines,0,2)
    var grid = makeDynamicTable(rowNames,columnNames,cellWidth,cellHeight,tableX,tableY)
    for(i = 0; i < rows; i++) {
        text = "lcs = 0 between "+columnNames[0] + " → "+rowNames[i]+".";
        setGridAtRowColumnToText(grid,i,0,columns,text,setHighlightColor);
        evalLines[2]="T["+i+"][0] = 0"
        highlightCodeLineInGrid(evalGrid,0,2,setHighlightColor)
        replaceCodeLinesInGrid(evalGrid,evalLines,0,2)
        yield({step:text});
        setGridAtRowColumnToText(grid,i,0,columns,""+0);
        unhighlightGrid(grid);
    }
    replaceCodeLinesInGrid(codeGrid,codeLines,3,4);
    replaceCodeLinesInGrid(evalGrid,evalLines,3,4)
    for(j = 1; j < columns; j++) {
        text = "lcs = 0 between "+rowNames[0]+" → "+columnNames[j];
        setGridAtRowColumnToText(grid,0,j,columns,text,setHighlightColor);
        evalLines[4]="T[0]["+j+"] = 0"
        replaceCodeLinesInGrid(evalGrid,evalLines,3,4)
        highlightCodeLineInGrid(evalGrid,3,4,setHighlightColor)
        yield({step:text})
        setGridAtRowColumnToText(grid,0,j,columns,""+0,setHighlightColor);
        unhighlightGrid(grid);
    }
    replaceCodeLinesInGrid(codeGrid,codeLines,5,13)
    replaceCodeLinesInGrid(evalGrid,evalLines,5,13)
    for(i = 1; i < rows; i++) {
        for (j = 1; j < columns; j++) {
            evalLines[10] = ""
            evalLines[13] = ""
            if ( target[i-1] === source[j-1] ) {
                evalLines[9] = ""+target[i-1]+"=="+source[j-1]
                upperLeft = getGridTextAtRowColumn(grid,i-1,j-1,columns);
                actualLCS = 1 + Number(upperLeft);
                evalLines[10] = "T["+Number(i-1)+"]["+Number(j-1)+"]="+actualLCS
                replaceCodeLinesInGrid(evalGrid,evalLines,5,13)
                highlightCodeLineInGrid(evalGrid,5,10,setHighlightColor)
                text = "lcs = 1 + upper_left("+upperLeft+").";
                setGridAtRowColumnToText(grid,i,j,columns,text,setHighlightColor);
                yield({step:text})
                setGridAtRowColumnToText(grid,i,j,columns,""+actualLCS,setHighlightColor);
                unhighlightGrid(grid);
            } else {
                evalLines[9] = ""+target[i-1]+"!="+source[j-1]
                left = getGridTextAtRowColumn(grid,i,j-1,columns,getHighlightColor);
                rowAbove = getGridTextAtRowColumn(grid,i-1,j,columns,getHighlightColor);
                actualLCS = Math.max(left,rowAbove);
                evalLines[13] = "T["+Number(i-1)+"]["+Number(j-1)+"]="+actualLCS
                replaceCodeLinesInGrid(evalGrid,evalLines,5,13)
                highlightCodeLineInGrid(evalGrid,5,13,setHighlightColor)
                text = "lcs = max("+left+","+rowAbove+").";
                setGridAtRowColumnToText(grid,i,j,columns,text,setHighlightColor);
                yield({step:text})
                setGridAtRowColumnToText(grid,i,j,columns,""+actualLCS,setHighlightColor);
                unhighlightGrid(grid);
            }
        }
    }
    lastRow = rowNames.length - 1;
    lastColumn = columnNames.length - 1;
    text = "lcs = "+getGridTextAtRowColumn(grid,lastRow,lastColumn,columns,getHighlightColor)+" between "+source+" → "+target;
    answerHighlight = new algo.Color({ red: 0/255.0, green: 0x76/255.0, blue: 0xFF/255.0, alpha: 0.7});
    setGridAtRowColumnToText(grid,lastRow,lastColumn,columns,text,answerHighlightColor);
    yield({step:text});
}

function makeCodeGrid(numLines,cellWidth,codeX,codeY) {
    clearColor = new algo.Color({ red: 0.5, green: 0.5, blue: 1, alpha: 0})
    var codeGrid = new algo.render.ElementGroup();
    var cellHeight = 22;
    for ( i = 0; i < numLines; i++ ) {
        codeGrid.add(new algo.render.Rectangle({
            x:codeX,
            y:codeY + i * cellHeight,
            w:cellWidth,
            h:cellHeight,
            stroke: clearColor,
            text: "",
            textAlign:"left",
            fontSize: 16,
        }));
    }
    return codeGrid;
}

function replaceCodeLinesInGrid(grid,codeLines,startIndex,endIndex) {
    grid.set({text:""});
    for ( ic = startIndex; ic <= endIndex; ic++ ) {
        gridIndex = ic - startIndex;
        grid.elements[gridIndex].set({
            text:codeLines[ic]
        }
        );
    }
}

function highlightCodeLineInGrid(grid,startIndex,absoluteIndex,highlightColor) {
    clearColor = new algo.Color({ red: 0.5, green: 0.5, blue: 1, alpha: 0})
    grid.set({fill:clearColor})
    grid.elements[absoluteIndex-startIndex].set({
        fill:highlightColor
    })
}

function makeDynamicTable(rowNames,columnNames,cellWidth,cellHeight,tableX,tableY) {
    gridColor = new algo.Color({ red: 0x78/255.0, green: 0x92/255.0, blue: 0xB2/255.0, alpha: 1})
    clearColor = new algo.Color({ red: 0.5, green: 0.5, blue: 1, alpha: 0})
    fontSize = 14
    
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
    element = grid.elements[i*numColumns+j];
    element.set({fill:highlightColor})
    return element["text"];
}

function prefixesForString(str) {
    var prefixes = [];
    prefixes.push("∅");
    for ( var i = 1; i <= str.length; i++ ) {
        prefixes.push(str.slice(0,i));
    }
    return prefixes;
}