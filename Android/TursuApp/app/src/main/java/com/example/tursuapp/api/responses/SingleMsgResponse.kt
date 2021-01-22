package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class SingleMsgResponse(@SerializedName("sender") val sender: String,
                        @SerializedName("customer") val customer: String,
                        @SerializedName("vendor_name") val vendor_name: String,
                        @SerializedName("message") val message: String,
                        @SerializedName("date_sent") val date_sent: String
)