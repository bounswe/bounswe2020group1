package com.example.tursuapp.api.responses

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

class CustomerOrderResponse(product: Product,quantity:Int,id:Int,status:String,cargoID:String,estimatedArrivalDate:String,arrivalDate:String){

        @SerializedName("product")
        val product : Product = product
        @SerializedName("quantity")
        val quantity : Int = quantity
        @SerializedName("id")
        val id : Int = id
        @SerializedName("status")
        val status : String = status
        @SerializedName("cargoID")
        val cargoID : String = cargoID
        @SerializedName("estimatedArrivalDate")
        val estimatedArrivalDate : String = estimatedArrivalDate
        @SerializedName("arrivalDate")
        val arrivalDate : String = arrivalDate



}
class Product(id:Int, name:String, photo_url:String, vendor_name:String, category:String, rating:String, stock:Int, price:String, brand:String) {
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
    @SerializedName("brand")
    val brand : String = brand
}