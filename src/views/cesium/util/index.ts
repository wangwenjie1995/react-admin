import * as Cesium from 'cesium'
export const enableTimelineInteractions = (className: string) => {
  const timelineElement = document.querySelector(className) as HTMLElement;
  if (timelineElement) {
    timelineElement.style.pointerEvents = 'auto'; // 恢复鼠标事件
  }
};
export const disableTimelineInteractions = (className: string) => {
  // 通过覆盖时间轴,用来禁止时间轴拖动/点击等时间
  const timelineElement = document.querySelector(className) as HTMLElement;
  if (timelineElement) {
    timelineElement.style.pointerEvents = 'none'; // 禁用鼠标事件
  }
};
/**
 * 返回模型属性
 * @param viewer
 * @param positionProperty
 * @returns
 */
export const loadAirModel = (viewer: Cesium.Viewer, positionProperty: Cesium.PositionProperty) => {
  const airModel = {
    //availability:定义了该实体的时间可用性，即模型在那些时间内可见
    // availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
    // position: entitiesPositionProperty,
    // position: new Cesium.CallbackProperty(function(time) {
    //   // 假设 entitiesPositionProperty 是经纬度数据，缺少高度
    //   const curPosition = entitiesPositionProperty.getValue(time);  // 获取经纬度（longitude, latitude）
    //   return new Cesium.Cartesian3(curPosition[0], curPosition[1], 200);  // 使用默认高度
    // }, false),
    position: new Cesium.CallbackProperty((time) => {
      //positionProperty.getValue(time):获取对应时间的动态位置
      // 获取当前时间对应的动态位置
      const currentPosition = positionProperty.getValue(time);
      if (!currentPosition) return undefined; // 确保位置有效
      const { lng, lat } = cartesianToDegrees(currentPosition, viewer)
      return Cesium.Cartesian3.fromDegrees(lng, lat, 20);
    }, false) as Cesium.CallbackPositionProperty,
    model: {
      uri: '/3DModels/Cesium_Air.glb', // 带有骨骼动画的小人模型
      minimumPixelSize: 128, //设置模型的最小像素大小，即模型在屏幕上显示时的最小尺寸（以像素为单位
      maximumScale: 20000,
      runAnimations: true, // 启用模型动画
    },
    // Automatically compute the orientation from the position.
    // orientation:定义实体的朝向（旋转）
    // VelocityOrientationProperty是一个计算方向的属性，它通过计算实体位置属性的速度来自动生成实体的朝向
    // 如果 positionProperty 是动态的，VelocityOrientationProperty 会基于位置的速度计算出一个合适的朝向（例如，如果飞行器正在飞行，模型会朝向飞行的方向）。
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    // PathGraphics 是用于绘制实体路径的属性：设置了 3 像素
    path: new Cesium.PathGraphics({ width: 3 })
  }
  return airModel
}
/**
 *
 * @param position
 * @param viewer
 * @returns 返回当前位置的经纬度
 */
export const cartesianToDegrees = (position: Cesium.Cartesian3, viewer: Cesium.Viewer): { lat: number, lng: number } => {
  if (!position || !viewer) {
    return { lat: 0, lng: 0 };
  }

  const ellipsoid = viewer.scene.globe.ellipsoid;
  const cartographic = ellipsoid.cartesianToCartographic(position);

  if (!cartographic) {
    console.error("Failed to convert Cartesian to Cartographic.");
    return { lat: 0, lng: 0 };
  }

  const lat = Cesium.Math.toDegrees(cartographic.latitude);
  const lng = Cesium.Math.toDegrees(cartographic.longitude);

  return { lat, lng };
};
/**
 * 切换到模型的第一视角
 */
export const enableFirstPersonView = (viewer: Cesium.Viewer, entity: Cesium.Entity) => {
  viewer.scene.screenSpaceCameraController.enableZoom = false; //禁止视角缩放
  viewer.scene.screenSpaceCameraController.enableRotate = false; //禁止视角缩放
  viewer.scene.screenSpaceCameraController.enableTilt = false; //禁止中键旋转视角

  // 动态更新相机位置和方向
  const updateCameraView = () => {
    const currentTime = viewer.clock.currentTime;

    // 获取实体当前位置和方向
    const position = entity.position?.getValue(currentTime);
    const orientation = entity.orientation?.getValue(currentTime);

    if (!position || !orientation) {
      console.error("实体位置或方向无效");
      return;
    }

    // 设置相机的视图矩阵，使其与实体同步
    const transform = Cesium.Matrix4.fromRotationTranslation(
      Cesium.Matrix3.fromQuaternion(orientation), // 方向矩阵
      position                                    // 位置
    );

    // 将相机绑定到模型
    viewer.scene.camera.lookAtTransform(
      transform,
      new Cesium.Cartesian3(-50, 0, 20) // 偏移量：x 向前，y 向上
    );
  };

  // 添加时钟监听器，每帧更新相机位置
  const removeListener = viewer.clock.onTick.addEventListener(updateCameraView);

  // 返回清理函数（可选）
  return () => {
    // 恢复默认相机控制
    viewer.scene.screenSpaceCameraController.enableZoom = true;
    viewer.scene.screenSpaceCameraController.enableRotate = true;
    viewer.scene.screenSpaceCameraController.enableTilt = true;

    // 移除监听器
    removeListener();
  };
}

interface ButtonConfig {
  key: string;
  text: string;
  onClick: () => void;
}
export const addCesiumButton = (buttonsConfig: ButtonConfig[], defaultActive: string = '') => {
  const container = document.getElementById('cesiumContainer');
  let cesiumButtonsDiv: HTMLElement | null
  // 用于存储按钮元素
  let buttons: HTMLButtonElement[] = [];
  if (!container) {
    console.error("容器不存在：cesiumContainer");
    return;
  }

  // 检查是否已存在具有特定 key 的 div
  cesiumButtonsDiv = container.querySelector("[data-key='view-buttons']");
  if (cesiumButtonsDiv) {
    cesiumButtonsDiv.innerHTML = ''; // 清空内部内容
    buttons = []
  } else {
    cesiumButtonsDiv = document.createElement("div");
    cesiumButtonsDiv.setAttribute("data-key", "view-buttons"); // 设置唯一标识
    document.getElementById('cesiumContainer')!.appendChild(cesiumButtonsDiv);
  }

  cesiumButtonsDiv.style.cssText = `
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 1000;
  `;
  const buttonStyle = `
    display: inline-block;
    background: #303336;
    border: 1px solid #444;
    color: #edffff;
    fill: #edffff;
    border-radius: 4px;
    padding: 5px 12px;
    margin: 2px 3px;
    cursor: pointer;
    overflow: hidden;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 1000;
    cursor: pointer;
  `;
  // 高亮样式
  const activeButtonStyle = `
    background: red;
    border: 1px solid #666;
    color: #fff;
  `;

  // 遍历创建按钮
  console.log('遍历创建按钮')
  buttonsConfig.forEach(({ text, key, onClick }) => {
    const button = document.createElement("button");
    button.style.cssText = buttonStyle;
    button.innerText = text;
    button.addEventListener("click", () => {
      onClick();
      // 更新高亮样式
      buttons.forEach((btn, index) => {
        const { key: btnKey } = buttonsConfig[index];
        btn.style.cssText = btnKey === key ? buttonStyle + activeButtonStyle : buttonStyle;
      });
    }); // 添加点击事件
    // 默认高亮选中按钮
    if (key === defaultActive) {
      button.style.cssText = buttonStyle + activeButtonStyle;
    }
    buttons.push(button);
    cesiumButtonsDiv.appendChild(button); // 添加按钮到容器
  });

}
export const removeCesiumButton = () => {
  const container = document.getElementById('cesiumContainer');
  // 用于存储按钮元素
  if (!container) {
    console.error("容器不存在：cesiumContainer");
    return;
  }
  let cesiumButtonsDiv = container.querySelector("[data-key='view-buttons']");
  // 检查是否已存在具有特定 key 的 div
  if (cesiumButtonsDiv) {
    cesiumButtonsDiv.innerHTML = ''; // 清空内部内容
  }
}

export const getCameraOffset = (viewer: Cesium.Viewer): Cesium.Cartesian3 => {
  const camera = viewer.scene.camera;

  // 如果 transform 是 IDENTITY，说明没有设置 lookAtTransform
  if (Cesium.Matrix4.equals(camera.transform, Cesium.Matrix4.IDENTITY)) {
    throw new Error("当前相机没有绑定到 transform");
  }

  // 计算相机的本地偏移量
  const inverseTransform = Cesium.Matrix4.inverse(camera.transform, new Cesium.Matrix4());
  const offset = Cesium.Matrix4.multiplyByPoint(inverseTransform, camera.position, new Cesium.Cartesian3());

  return offset; // 偏移量（本地坐标系）
}
