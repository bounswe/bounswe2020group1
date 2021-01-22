package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class CustomerMsgFlowResponse(@SerializedName("id") val id: Int,
                              @SerializedName("notify") val notify: Boolean,
                              @SerializedName("vendor_name") val vendor_name: String
)