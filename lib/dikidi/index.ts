export { COMPANY_ID, getDikidiApiKey } from "./config";
export {
  getCatalogServices,
  getCatalogMasters,
  getMastersForService,
  getServicesForMaster,
  categoriesFromServices,
} from "./catalog";
export {
  getDatetimes,
  timeReservation,
  clearReservation,
  sendCode,
  checkCode,
  createRecord,
} from "./widget";
export { getWidgetSession } from "./session";
export { fetchBeautyCompany } from "./beauty";
export type { CompanyContacts } from "./beauty";
