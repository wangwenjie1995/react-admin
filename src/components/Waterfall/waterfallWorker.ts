self.onmessage = (event) => {
  const { items, gap, containerWidth, columnCount, columnHeights } = event.data;

  // 每列宽度
  const columnWidth = (containerWidth - (columnCount - 1) * gap) / columnCount;
  const tempColumnHeights = JSON.parse(JSON.stringify(columnHeights))
  const newPositions = items.map((item: any) => {
    const cardHeight = (item.height / item.width) * columnWidth;
    const columnIndex = tempColumnHeights.indexOf(Math.min(...tempColumnHeights)); // 找到最短列

    const x = columnIndex * (gap + columnWidth);
    const y = tempColumnHeights[columnIndex];
    tempColumnHeights[columnIndex] += cardHeight + gap; // 更新列高度

    return {
      ...item,
      width: columnWidth,
      height: cardHeight,
      x,
      y,
    };
  })

  // 返回计算后的结果
  self.postMessage({ newPositions, columnHeights: tempColumnHeights });
}
