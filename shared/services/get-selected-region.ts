import { IRouteData } from './../types/route.interface';

export const getSelectedRegion = (route: IRouteData) => {

  if (route) {
    return {
      phoneNumber: route?.regions_data?.phone_number?.replace(/[\s\(\)-]/g, ''),
      address: route?.regions_data?.address
    }
  }
}