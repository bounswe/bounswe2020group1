package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class AddProductResponse (status:String){
    @SerializedName("status")
    val status : String = status
}