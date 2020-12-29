package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName
class VendorDataResponse(username: String,email:String,first_name:String,last_name:String,latitude:String,longitude:String,iban:String,rating:String,orders:List<VendorOrderLists>,products:List<VendorProductLists>){

    @SerializedName("username")
    val username : String = username
    @SerializedName("email")
    val email : String = email
    @SerializedName("first_name")
    val first_name : String = first_name
    @SerializedName("last_name")
    val last_name : String = last_name
    @SerializedName("latitude")
    val latitude : String = latitude
    @SerializedName("longitude")
    val longitude : String = longitude
    @SerializedName("iban")
    val iban : String = iban
    @SerializedName("rating")
    val rating : String = rating
    @SerializedName("orders")
    val orders : List<VendorOrderLists> = orders
    @SerializedName("products")
    val products : List<VendorProductLists> = products



}
class VendorProductLists(id:Int, category:String,name:String, brand:String,description: String, rating:String, stock:Int, price:String, date_added: String, photo_url:String) {
    @SerializedName("id")
    val id : Int = id
    @SerializedName("category")
    val category : String = category
    @SerializedName("name")
    val name : String = name
    @SerializedName("brand")
    val brand : String = brand
    @SerializedName("description")
    val description : String = description
    @SerializedName("rating")
    val rating : String = rating
    @SerializedName("stock")
    val stock : Int = stock
    @SerializedName("price")
    val price : String = price
    @SerializedName("date_added")
    val date_added : String = date_added
    @SerializedName("photo_url")
    val photo_url : String = photo_url

}

class VendorOrderLists(id:Int,customer:String,product:Int,status:String,cargoID:String, orderDate:String, estimatedArrivalDate:String, arrivalDate:String,quantity:Int, comment:String){
    @SerializedName("id")
    val id : Int = id
    @SerializedName("customer")
    val customer : String = customer
    @SerializedName("product")
    val product : Int = product
    @SerializedName("status")
    val status : String = status
    @SerializedName("cargoID")
    val cargoID : String = cargoID
    @SerializedName("orderDate")
    val orderDate : String = orderDate
    @SerializedName("estimatedArrivalDate")
    val estimatedArrivalDate : String = estimatedArrivalDate
    @SerializedName("arrivalDate")
    val arrivalDate : String = arrivalDate
    @SerializedName("quantity")
    val quantity : Int = quantity
    @SerializedName("comment")
    val comment : String = comment




}