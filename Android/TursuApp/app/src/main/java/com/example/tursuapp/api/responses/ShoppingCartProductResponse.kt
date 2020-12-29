package com.example.tursuapp.api.responses
import com.google.gson.annotations.SerializedName

class ShoppingCartProductResponse(product:Product,quantity:Int) {
    @SerializedName("product")
    val product : Product = product
    @SerializedName("quantity")
    var quantity : Int = quantity

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
}
