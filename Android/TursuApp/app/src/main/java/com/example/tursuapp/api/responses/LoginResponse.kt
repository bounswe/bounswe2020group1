package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class LoginResponse(auth_token:String, first_name:String, last_name:String, user_type:String) {
    @SerializedName("auth_token")
    val auth_token : String = auth_token

    @SerializedName("first_name")
    val first_name : String = first_name

    @SerializedName("last_name")
    val last_name : String = last_name

    @SerializedName("user_type")
    val user_type : String = user_type

}
