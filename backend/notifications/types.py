from enum import Enum


class NotificationType(Enum):
    ORDER_STATUS_CHANGE = 1
    PRODUCT_VERIFIED = 2
    PRICE_BELOW_ALERT = 3
    PRICE_CHANGE_ALERT = 4
    STOCK_ABOVE_ALERT = 5
    

class AlertType(Enum):
    PRICE_BELOW_ALERT = 1
    PRICE_CHANGE_ALERT = 2
    STOCK_ABOVE_ALERT = 3


