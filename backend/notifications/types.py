from enum import Enum


class NotificationType(Enum):
    MESSAGE = 0
    ORDER_STATUS_CHANGE = 1 # done
    PRODUCT_VERIFIED = 2 # done
    PRICE_BELOW_ALERT = 3 # done
    PRICE_CHANGE_ALERT = 4 # done 
    STOCK_ABOVE_ALERT = 5 # done

class AlertType(Enum):
    PRICE_BELOW_ALERT = 0
    PRICE_CHANGE_ALERT = 1
    STOCK_ABOVE_ALERT = 2


