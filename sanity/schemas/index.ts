import { product } from './product'
import { category } from './category'
import { order, orderItem, shippingAddress } from './order'
import { user, userAddress } from './user'

export const schemaTypes = [product, category, order, orderItem, shippingAddress, user, userAddress]
