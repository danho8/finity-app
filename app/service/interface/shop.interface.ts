export interface IListShop {
  repair?: enumListShop,
  paginate_size: number,
}

export enum enumListShop {
  repair = 1,
  glass = 0,
}

export interface IProductInventory {
  can_use: enumProductInventory,
  paginate_size: number,
  level?: number,
  durability?: number,
  most_recently_purchase?: number,
}

export enum enumProductInventory {
  can = 1,
  canNot = 0,
}

export interface IBuyProduct {
  product_inventory_id: number,
}

export interface IProductUpgrade {
  product_inventory_id: number,
  coin_id?: number,
}

export interface IRepairFees {
  id: number,
}

export interface IRepair {
  product_inventory_id: number,
}

export interface IGiveProduct {
  product_inventory_id: number,
  user_receive: number,
}

export interface ISettingBike {
  product_inventory_id: number
}
