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

function setGridAtRowColumnToText(grid,i,j,numColumns,text) {
    highlightColor = new algo.Color({ red: 0x78/255.0, green: 0x92/255.0, blue: 0xB2/255.0, alpha: 0.2})
    grid.elements[i*numColumns+j].set({
        fill: highlightColor,
        text: text
    });
}

function unsetGridAtRowColumnToText(grid,i,j,numColumns,text) {
    grid.elements[i*numColumns+j].set({
        fill: clearColor,
        text: text,
    });
}

function getGridTextAtRowColumn(grid,i,j) {
    element = grid.elements[i*columns+j];
    return element[text];
}

function* algorithm() {
    var source = "abcdef";
    var target = "abdez";
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
        text = ""+i+" edits from "+columnNames[0] + " → "+rowNames[i];
        setGridAtRowColumnToText(grid,i,0,columns,text);
        yield({step:text});
        unsetGridAtRowColumnToText(grid,i,0,columns,""+i);
    }
    for(j = 1; j < columns; j++) {
        text = ""+j+" edits from "+rowNames[0]+" → "+columnNames[j];
        setGridAtRowColumnToText(grid,0,j,columns,""+j+" edits from "+rowNames[0]+" → "+columnNames[j]);
        yield({step:text})
        unsetGridAtRowColumnToText(grid,0,j,columns,""+j);
    }
    for(i = 1; i < rows; i++) {
        for (j = 1; j < columns; j++) {
            if ( source[i] === source[j] ) {
                text = "last char same, so 0 new edits from "+columnNames[j]+" → "+rowNames[j];
                setGridAtRowColumnToText(grid,i,j,columns,text);
                yield({step:text})
                unsetGridAtRowColumnToText(grid,i,j,columns,""+getGridTextAtRowColumn(grid,i-1,j-1));
            } else {
                left = getGridTextAtRowColumn(grid,i,j-1);
                upperLeft = getGridTextAtRowColumn(grid,i-1,j-1);
                rowAbove = getGridTextAtRowColumn(grid,i-1,j);
                text = "min of "+left+","+upperLeft+","+rowAbove+" more edits";
                setGridAtRowColumnToText(grid,i,j,columns,text);
                yield({step:text})
                actualEdits = Math.min(left,upperLeft,rowAbove);
                unsetGridAtRowColumnToText(grid,i,j,columns,""+actualEdits);
            }
        }
    }
    // for(i = 0; i < rowNames.length*columnNames.length; i += 1) {
    //     grid.elements[i].set({
    //         text: "new"
    //     });
    //     yield({step:"change text"});
    // }
    yield({step:"finished"});
}

function prefixesForString(str) {
    var prefixes = [];
    for ( var i = 1; i <= str.length; i++ ) {
        prefixes.push(str.slice(0,i));
    }
    return prefixes;
}

// int count(string s1, string s2)
// {
//         int m = s1.length();
//         int n = s2.length();
//         for (int i = 0; i <= m; i++) {
//                 v[i][0] = i;
//         }
//         for (int j = 0; j <= n; j++) {
//                 v[0][j] = j;
//         }
 
//         for (int i = 1; i <= m; i++) {
//                 for (int j = 1; j <= n; j++) {
//                         if (s1[i-1] == s2[j-1]) v[i][j] = v[i-1][j-1];
//                         else v[i][j] = 1 + min(min(v[i][j-1],v[i-1][j]),v[i-1][j-1]);
//                 }
//         }
 
//         return v[m][n];
// }