package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

//"id": 1, "name": "Apple iPhone 11", "photo_url": "", "vendor_name": "Apple", "category": "Electronics", "rating": "-1.0", "stock": 1000, "price": "7999.99"
class VendorResponse(name:String, location:String, city:String, is_verified:Boolean, rating:String){
    @SerializedName("name")
    val name : String = name
    @SerializedName("location")
    val location : String = location
    @SerializedName("city")
    val city : String = city
    @SerializedName("is_verified")
    val is_verified : Boolean = is_verified
    @SerializedName("rating")
    val rating : String = rating
}