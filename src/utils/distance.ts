import * as Cesium from 'cesium'

/**
 * 计算一系列点组成的路径总长度
 * @param {Array<Cesium.Cartesian3>} positions 位置点数组
 * @param {Boolean} isSufaceDistance 是否计算曲面距离，默认为true
 * @return {Number} 路径总长度（单位：米）
 */

export const calculatePathLengths = (positions: Cesium.Cartesian3[], isSufaceDistance: Boolean = true): number[] => {
  if (positions.length < 2) {
    return []
  }
  const pathLengths: number[] = [0]; //初始长度为0
  let totalLength = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    let segmentLength = 0;
    if (isSufaceDistance) {
      var cartographic1 = Cesium.Cartographic.fromCartesian(positions[i]);
      var cartographic2 = Cesium.Cartographic.fromCartesian(positions[i + 1]);
      var geodesic = new Cesium.EllipsoidGeodesic(cartographic1, cartographic2);
      segmentLength = geodesic.surfaceDistance;
    }
    else {
      segmentLength = Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
    }
    totalLength += segmentLength
    pathLengths.push(totalLength)
  }

  return pathLengths
}
