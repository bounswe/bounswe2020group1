package com.example.tursuapp.api.requests

import com.google.gson.annotations.SerializedName
import retrofit2.http.Headers

class LoginRequest (email:String, password:String){

    @SerializedName(value = "email")
    val email : String = email

    @SerializedName(value = "password")
    val password : String = password
}
