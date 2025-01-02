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

