package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class CustomerMessageFlowResponse(@SerializedName("id") val id: Int,
                                  @SerializedName("notify") val notify: Boolean,
                                  @SerializedName("vendor_name") val vendor_name: String
)