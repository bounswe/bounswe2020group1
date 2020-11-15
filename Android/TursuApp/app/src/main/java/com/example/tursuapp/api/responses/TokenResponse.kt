package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

data class TokenResponse (
    @SerializedName("token")
    val token : String
)
