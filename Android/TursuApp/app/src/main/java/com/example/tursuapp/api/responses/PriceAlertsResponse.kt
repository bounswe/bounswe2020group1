package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class PriceAlertResponse(@SerializedName("id") val alertId: Int,
                 @SerializedName("type") val alertType: Int,
                 @SerializedName("value") val alertValue: Int,
                 @SerializedName("product_name") val productName: String,
                 @SerializedName("product_id") val productId: Int
)