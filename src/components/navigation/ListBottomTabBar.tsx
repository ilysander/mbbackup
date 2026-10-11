interface BottomTabBar {
  key: string;
  value: any;
}
export const listBottomTabBar: BottomTabBar[] = [];
export const listButtonStart: BottomTabBar[] = [];

export function addBottomTab(bottomTab: any): number {
  listBottomTabBar.push(bottomTab);
  return listBottomTabBar.length;
}

export function addButtonStart(bottomTour: any): number {
  listButtonStart.push(bottomTour);
  return listButtonStart.length;
}
