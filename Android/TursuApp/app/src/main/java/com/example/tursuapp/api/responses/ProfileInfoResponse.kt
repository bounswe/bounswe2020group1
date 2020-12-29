package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class ProfileInfoResponse(username:String, email:String, first_name:String, last_name:String, money_spent:Int, orders:List<CustomerProfileOrder>, lists:List<String>) {
    @SerializedName("username")
    val username : String = username
    @SerializedName("email")
    val email : String = email
    @SerializedName("first_name")
    val first_name : String = first_name
    @SerializedName("last_name")
    val last_name : String = last_name
    @SerializedName("money_spent")
    val money_spent : Int = money_spent
    @SerializedName("orders")
    val orders : List<CustomerProfileOrder> = orders
    @SerializedName("lists")
    val lists : List<String> = lists
}
class CustomerProfileOrder(){

}