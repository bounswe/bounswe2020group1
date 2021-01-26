package com.example.tursuapp.api.responses

import com.google.gson.annotations.SerializedName

class RecommendationPackResponse(@SerializedName("recommended") val recommended: List<ProductResponse>,
                                 @SerializedName("bestseller") val bestseller: List<ProductResponse>,
                                 @SerializedName("top_rated") val toprated: List<ProductResponse>,
                                 @SerializedName("newest_arrival") val newest: List<ProductResponse>){
}