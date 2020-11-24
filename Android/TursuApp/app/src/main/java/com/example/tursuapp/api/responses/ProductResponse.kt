package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

//"id": 1, "name": "Apple iPhone 11", "photo_url": "", "vendor_name": "Apple", "category": "Electronics", "rating": "-1.0", "stock": 1000, "price": "7999.99"
class ProductResponse(id:Int, name:String, photo_url:String, vendor_name:String,category:String, rating:String, stock:Int, price:String){
    @SerializedName("id")
    val id : Int = id
    @SerializedName("name")
    val name : String = name
    @SerializedName("photo_url")
    val photo_url : String = photo_url
    @SerializedName("vendor_name")
    val vendor_name : String = vendor_name
    @SerializedName("category")
    val category : String = category
    @SerializedName("rating")
    val rating : String = rating
    @SerializedName("stock")
    val stock : Int = stock
    @SerializedName("price")
    val price : String = price


}