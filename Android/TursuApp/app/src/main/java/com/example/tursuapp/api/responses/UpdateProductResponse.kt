package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

data class UpdateProductResponse (
        @SerializedName("status")
        var status: String

)