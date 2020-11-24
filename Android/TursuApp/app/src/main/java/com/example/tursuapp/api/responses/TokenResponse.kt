package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class TokenResponse (auth_token:String){
    @SerializedName("auth_token")
    val auth_token : String = auth_token
}

