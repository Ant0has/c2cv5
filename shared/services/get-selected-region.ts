import { PHONE_NUMBER_FIRST } from "../constants"
import { IRegion } from "../types/types"

export const getSelectedRegion = ({
  regions,
  pathname
}: {
  regions: IRegion[],
  pathname?: string
}) => {
  const currentRegion = regions?.find(region => region.url === pathname?.replace('/', ''))

  if (currentRegion) {
    return {
      phoneNumber: currentRegion.phone_number?.replace(/[\s\(\)-]/g, '') ?? PHONE_NUMBER_FIRST,
      address: currentRegion.address
    }
  }
}