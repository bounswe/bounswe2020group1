package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

/*
id →  int: id of the notification
type → int: type of the notification (look below notification types for valid types)
read → bool, true if read, false otherwise
product_name → string: name of the product
product_id → int: id of the product
order_id → int: only if order related
status → string: status order, only if order related
new_value → int: changed new value, only if product
 */
class NotificationResponse (
    @SerializedName("id") val id: Int,
    @SerializedName("type") val type: Int,
    @SerializedName("read") val read: Boolean,
    @SerializedName("product_name") val product_name: String,
    @SerializedName("product_id") val product_id: Int,
    @SerializedName("order_id") val order_id: Int,
    @SerializedName("status") val status: String,
    @SerializedName("new_value") val new_value: Double
)