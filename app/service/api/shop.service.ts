import request from 'app/utils/api/baseAxios';
import {
  IBuyProduct,
  IGiveProduct,
  IListShop,
  IProductInventory,
  IProductUpgrade,
  IRepair,
  IRepairFees,
  ISettingBike,
} from '../interface/shop.interface';

const listShop = (params: IListShop) => {
  return request({
    url: '/products/list-shop',
    method: 'GET',
    params,
  });
};

const getStatusFunctions = () => {
  return request({
    url: '/general/status-functions',
    method: 'GET',
  });
};

const productInventory = (params: IProductInventory) => {
  return request({
    url: '/product-inventorys',
    method: 'GET',
    params,
  });
};

const priceUpgrade = (params: IBuyProduct) => {
  return request({
    url: `/product-inventorys/price-upgrade/${params?.product_inventory_id}`,
    method: 'GET',
  });
};

const buyProduct = (data: IBuyProduct) => {
  return request({
    url: '/orders/buy-product',
    method: 'POST',
    data,
  });
};

const productUpgrade = (data: IProductUpgrade) => {
  return request({
    url: `/product-inventorys/upgrade`,
    method: 'POST',
    data,
  });
};

const repairFees = (params: IRepairFees) => {
  return request({
    url: `/product-inventorys/repair-fees/${params?.id}`,
    method: 'GET',
    params
  });
};

const repair = (data: IRepair) => {
  return request({
    url: `/product-inventorys/repair`,
    method: 'POST',
    data,
  });
};

const giveProduct = (data: IGiveProduct) => {
  return request({
    url: `/product-inventorys/give-product`,
    method: 'POST',
    data,
  });
};

const settingBike = (data: ISettingBike) => {
  return request({
    url: `/bike-settings/bike-default`,
    method: 'POST',
    data,
  });
};

export {
  listShop,
  productInventory,
  buyProduct,
  priceUpgrade,
  productUpgrade,
  repairFees,
  repair,
  giveProduct,
  settingBike,
  getStatusFunctions
};
