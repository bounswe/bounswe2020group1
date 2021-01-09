package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class PublicVendorResponse(username: String,email:String,first_name:String,last_name:String,latitude:String,longitude:String,city:String,iban:String,rating:String,products:List<PublicVendorProductLists>){

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
        @SerializedName("city")
        val city : String = city
        @SerializedName("iban")
        val iban : String = iban
        @SerializedName("rating")
        val rating : String = rating
        @SerializedName("products")
        val products : List<PublicVendorProductLists> = products



    }
    class PublicVendorProductLists(id:Int,name:String,photo_url:String,vendor_name:String,category:String, rating:String, stock:Int, price:String) {
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
