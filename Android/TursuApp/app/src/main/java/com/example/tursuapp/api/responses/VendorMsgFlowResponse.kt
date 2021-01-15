package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class VendorMsgFlowResponse(@SerializedName("customer_flows") val customer_flows: List<CustomerFlow>,
                        @SerializedName("admin_flows") val admin_flows: List<CustomerFlow>
)
class CustomerFlow(@SerializedName("id") val id: Int,
                   @SerializedName("notify") val notify: Boolean,
                   @SerializedName("username") val username: String,
                   @SerializedName("context") val context: String,
                   @SerializedName("object_id") val object_id: Int,
                   @SerializedName("type") val type: String
)
