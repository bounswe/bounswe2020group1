package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class CreateOrderResponse(invalid:List<String>){

@SerializedName("invalid")
val invalid :List<String> = invalid


}